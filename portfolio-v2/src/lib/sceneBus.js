/**
 * sceneBus — a tiny zero-dependency pub/sub (Tab 1, frozen contract).
 *
 * Decouples the 3D scene (Tab 2) from everything else. Tabs 3/4 emit on each
 * agent tool-call; Tab 2 subscribes and pulses the ambient scene.
 *
 *   sceneBus.emit('tool-call', { name });
 *   const off = sceneBus.on('tool-call', cb);  // returns an unsubscribe fn
 *   off();                                      // stop listening
 *
 * Event names are kebab-case strings; the canonical event is 'tool-call'
 * with payload { name }.
 */
const listeners = new Map(); // event -> Set<callback>

export const sceneBus = {
  on(event, cb) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(cb);
    return () => {
      const set = listeners.get(event);
      if (set) {
        set.delete(cb);
        if (set.size === 0) listeners.delete(event);
      }
    };
  },

  emit(event, payload) {
    const set = listeners.get(event);
    if (!set) return;
    // copy so a handler that unsubscribes mid-emit doesn't mutate the live set
    for (const cb of [...set]) {
      try {
        cb(payload);
      } catch (err) {
        // a broken listener must not break the emitter or other listeners
        console.error(`sceneBus listener for "${event}" threw:`, err);
      }
    }
  },
};

export default sceneBus;
