import { useCallback, useRef, useState } from 'react';
import sceneBus from '../lib/sceneBus.js';
// agentClient is Tab 1's stub interface; Tab 6 swaps in Tab 4's mockClient at the
// call site by passing a different `client`. We import the default here only so the
// hook is usable standalone — callers should pass `client` explicitly.
import { agentClient as defaultClient } from './agentClient.js';

/**
 * useAgent — drives the agent event protocol for the UI.
 *
 * Calls `client.streamAgent({ message, persona, history })`, consumes the async
 * iterable, and folds each event into message state. Every `{type:'tool'}` event
 * (start or done) also fires `sceneBus.emit('tool-call', { name })` so Tab 2's 3D
 * scene can pulse.
 *
 * Message shape (agent turn):
 *   { id, role:'agent', text, trace:[{kind,name,args,status}], citations:[…],
 *     refusal:string|null, streaming:boolean }
 * Message shape (user turn):
 *   { id, role:'user', text }
 *
 * The `trace` array is what <ReasoningTrace/> renders: `plan` events become
 * { kind:'plan', text } and `tool` events become { kind:'tool', name, args,
 * status } — a tool's 'done' updates the existing 'start' step in place.
 *
 * @param {{ client?: { streamAgent: Function }, persona?: string }} [opts]
 */
export function useAgent({ client = defaultClient, persona = 'recruiter' } = {}) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  // Monotonic id source — avoids key collisions when two messages land in the
  // same millisecond (Date.now() is not unique enough under fast streaming).
  const idRef = useRef(0);
  const nextId = () => `m${idRef.current++}`;

  // Guards against overlapping streams: ignore a second send() while one is live.
  const activeRef = useRef(false);

  /** Patch a single message (by id) immutably. */
  const patchMessage = useCallback((id, patch) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m
      )
    );
  }, []);

  /**
   * Send a user message and stream the agent's reply.
   * @param {string} message
   * @param {string} [personaOverride] persona for this turn (defaults to hook persona)
   */
  const send = useCallback(
    async (message, personaOverride) => {
      const text = (message ?? '').trim();
      if (!text || activeRef.current) return;

      activeRef.current = true;
      setIsStreaming(true);
      setError(null);

      const turnPersona = personaOverride || persona;

      // Snapshot prior turns as history BEFORE we append this turn, so the agent
      // gets the conversation up to (not including) the new question.
      const history = messages.map((m) => ({
        role: m.role,
        content: m.role === 'agent' ? m.text : m.text,
      }));

      const userId = nextId();
      const agentId = nextId();

      // Append the user turn + an empty agent turn we stream into.
      setMessages((prev) => [
        ...prev,
        { id: userId, role: 'user', text },
        {
          id: agentId,
          role: 'agent',
          text: '',
          trace: [],
          citations: [],
          refusal: null,
          streaming: true,
        },
      ]);

      try {
        const stream = client.streamAgent({ message: text, persona: turnPersona, history });

        for await (const event of stream) {
          if (!event || typeof event !== 'object') continue;

          switch (event.type) {
            case 'plan':
              patchMessage(agentId, (m) => ({
                trace: [...m.trace, { kind: 'plan', text: event.text }],
              }));
              break;

            case 'tool': {
              // Mirror every tool event onto the scene bus so the 3D reacts.
              sceneBus.emit('tool-call', { name: event.name });
              patchMessage(agentId, (m) => {
                const step = {
                  kind: 'tool',
                  name: event.name,
                  args: event.args,
                  status: event.status || 'start',
                };
                if (event.status === 'done') {
                  // Resolve the most recent matching 'start' step in place.
                  const idx = [...m.trace]
                    .map((t, i) => ({ t, i }))
                    .reverse()
                    .find(({ t }) => t.kind === 'tool' && t.name === event.name && t.status === 'start');
                  if (idx) {
                    const trace = m.trace.slice();
                    trace[idx.i] = { ...trace[idx.i], status: 'done', args: event.args ?? trace[idx.i].args };
                    return { trace };
                  }
                }
                return { trace: [...m.trace, step] };
              });
              break;
            }

            case 'token':
              // Stream the answer in; events arrive word-by-word from the client.
              patchMessage(agentId, (m) => ({ text: m.text + (event.text ?? '') }));
              break;

            case 'citation':
              patchMessage(agentId, (m) => ({
                citations: [...m.citations, { factId: event.factId, label: event.label }],
              }));
              break;

            case 'refusal':
              patchMessage(agentId, { refusal: event.reason || 'I can’t help with that one.' });
              break;

            case 'done':
              patchMessage(agentId, { streaming: false });
              break;

            default:
              // Unknown event type — ignore forward-compatibly.
              break;
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('useAgent stream error:', err);
        setError(err);
        patchMessage(agentId, (m) => ({
          streaming: false,
          // Surface a calm, in-voice fallback if nothing streamed.
          text: m.text || 'Something interrupted me mid-thought — mind asking again?',
        }));
      } finally {
        // Ensure the turn is closed even if the stream ended without a 'done'.
        patchMessage(agentId, { streaming: false });
        activeRef.current = false;
        setIsStreaming(false);
      }
    },
    [client, persona, messages, patchMessage]
  );

  /** Clear the conversation. */
  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isStreaming, error, send, reset };
}

export default useAgent;
