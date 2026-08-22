import { useRef, useState, lazy, Suspense } from 'react';
import s from './App.module.css';
import AgentPanel from './agent/AgentPanel.jsx';
import apiClient from './agent/apiClient.js';
import { Hero, Experience, Projects, Skills, Contact } from './sections';
import profile from './content/profile.json';

const AmbientField = lazy(() => import('./scene'));

/**
 * App — integrated build (Tab 6).
 * Layering: ambient 3D background (fixed, z-index:-1, behind everything) →
 * résumé sections (main column) → the agent concierge docked in a sticky
 * sidebar. The agent runs on the offline `mockClient` (Phase 1 — no API key,
 * no network); each tool-call it makes pulses the 3D scene via sceneBus.
 */
export default function App() {
  const [persona, setPersona] = useState('recruiter');
  const panelRef = useRef(null);

  // Hero / Contact "Ask my AI" CTA → focus the agent input.
  const focusAgent = () => panelRef.current?.focus();

  return (
    <div className={s.app}>
      {/* Ambient 3D background — code-split and reacts to agent tool-calls */}
      <div className={s.bg} aria-hidden="true">
        <Suspense fallback={null}>
          <AmbientField />
        </Suspense>
      </div>

      <div className={s.layout}>
        <main className={`container ${s.main}`}>
          <Hero data={profile} onAsk={focusAgent} />
          <Experience data={profile} />
          <Projects data={profile} />
          <Skills data={profile} />
          <Contact data={profile} onAsk={focusAgent} />
        </main>

        <aside className={s.aside}>
          <AgentPanel
            ref={panelRef}
            className={s.agent}
            persona={persona}
            client={apiClient}
            onPersonaChange={setPersona}
          />
        </aside>
      </div>
    </div>
  );
}
