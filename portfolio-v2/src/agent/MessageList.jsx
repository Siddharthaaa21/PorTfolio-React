import { useEffect, useRef } from 'react';
import Message from './Message.jsx';
import s from './MessageList.module.css';

/**
 * MessageList — scrollable transcript of the conversation.
 *
 * Auto-scrolls to the latest content as messages stream in (unless the user has
 * scrolled up to read history). Renders an empty-state prompt before the first
 * question so the panel never looks broken on load.
 *
 * @param {{ messages: Array, onCitation?: (factId:string)=>void, emptyState?: React.ReactNode }} props
 */
export default function MessageList({ messages = [], onCitation, emptyState = null }) {
  const scrollRef = useRef(null);
  const pinnedRef = useRef(true); // are we stuck to the bottom?

  // Track whether the user is near the bottom; only autoscroll when they are.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    pinnedRef.current = distance < 48;
  };

  // On any message change (new turn or streamed token), keep the bottom in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !pinnedRef.current) return;
    el.scrollTop = el.scrollHeight;
  });

  return (
    <div
      ref={scrollRef}
      className={s.list}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {messages.length === 0 ? (
        <div className={s.empty}>{emptyState}</div>
      ) : (
        messages.map((m) => <Message key={m.id} message={m} onCitation={onCitation} />)
      )}
    </div>
  );
}
