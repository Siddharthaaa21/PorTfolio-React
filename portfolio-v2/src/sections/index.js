// Barrel export for the page sections (Tab 5).
// App.jsx (Tab 6) wires these up:
//   import { Hero, Experience, Projects, Skills, Contact } from './sections';
// Each takes a `data` prop shaped like profile.json. Hero (and optionally Contact)
// also takes an `onAsk` callback that focuses the agent panel.
export { default as Hero } from './Hero.jsx';
export { default as Experience } from './Experience.jsx';
export { default as Projects } from './Projects.jsx';
export { default as Skills } from './Skills.jsx';
export { default as Contact } from './Contact.jsx';
