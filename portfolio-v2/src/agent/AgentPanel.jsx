import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Panel, Button } from '../ui';
import { agentClient as defaultClient } from './agentClient.js';
import useAgent from './useAgent.js';
import MessageList from './MessageList.jsx';
import PersonaToggle from './PersonaToggle.jsx';
import SuggestedChips from './SuggestedChips.jsx';
import s from './AgentPanel.module.css';

/**
 * AgentPanel — the centerpiece chat surface that renders the agent event
 * protocol: a glassy Panel with a header, the reasoning-trace transcript, a
 * persona toggle, suggested starter questions, and a text input.
 *
 * Persona handling is hybrid-controlled: if a `persona` prop is supplied it is
 * the source of truth (Tab 6 lifts persona to App and re-passes it). Otherwise
 * the panel owns persona locally so it works standalone. `onPersonaChange` (when
 * given) is called on every toggle so the parent can mirror/lift it.
 *
 * Exposes an imperative `focus()` (via ref) so a host CTA — e.g. Hero's "Ask my
 * AI anything" — can focus the input.
 *
 * @param {{
 *   persona?: string,
 *   client?: { streamAgent: Function },
 *   onPersonaChange?: (id:string)=>void,
 *   className?: string,
 * }} props
 */
const AgentPanel = forwardRef(function AgentPanel(
  { persona: personaProp, client = defaultClient, onPersonaChange, className = '' },
  ref
) {
  // Hybrid controlled/uncontrolled persona.
  const [personaState, setPersonaState] = useState(personaProp || 'recruiter');
  const persona = personaProp ?? personaState;

  const setPersona = (id) => {
    if (personaProp == null) setPersonaState(id); // only self-manage when uncontrolled
    onPersonaChange?.(id);
  };

  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const { messages, isStreaming, send } = useAgent({ client, persona });

  // Let a host focus the input (Hero CTA, keyboard shortcut, etc.).
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const submit = (text) => {
    const q = (text ?? draft).trim();
    if (!q || isStreaming) return;
    setDraft('');
    send(q, persona);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const handlePick = (q) => {
    inputRef.current?.focus();
    submit(q);
  };

  const showSuggestions = messages.length === 0;

  return (
    <Panel as="section" className={`${s.panel} ${className}`} aria-label="Ask Siddhartha's AI">
      <header className={s.header}>
        <div className={s.title}>
          <span className={s.dot} aria-hidden="true" />
          <div>
            <h2 className={s.heading}>Ask my AI</h2>
            <p className={s.sub}>I answer as Siddhartha — with a visible reasoning trace.</p>
          </div>
        </div>
        <PersonaToggle persona={persona} onChange={setPersona} disabled={isStreaming} />
      </header>

      <MessageList
        messages={messages}
        emptyState={
          <>
            Ask me anything about my work — GenAI agents, distributed backends,
            Azure delivery. Pick a starter below or type your own.
          </>
        }
      />

      <div className={s.footer}>
        {showSuggestions && (
          <SuggestedChips onPick={handlePick} disabled={isStreaming} />
        )}

        <form className={s.inputRow} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={s.input}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about my experience, projects, fit…"
            aria-label="Ask the agent a question"
            autoComplete="off"
            enterKeyHint="send"
          />
          <Button
            type="submit"
            variant="primary"
            className={s.send}
            disabled={isStreaming || !draft.trim()}
            aria-label="Send question"
          >
            {isStreaming ? 'Thinking…' : 'Ask'}
          </Button>
        </form>
      </div>
    </Panel>
  );
});

export default AgentPanel;
