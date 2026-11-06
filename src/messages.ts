import {AppEvents, RNPlugin} from '@remnote/plugin-sdk';

// RemNote wraps broadcast payloads in {message: payload}.
// Accept direct payloads too for older hosts and development previews.
export function readMessage(event: unknown): any {
  if (!event || typeof event !== 'object') return undefined;
  return 'message' in event ? (event as {message: unknown}).message : event;
}

export function connectPet(plugin: RNPlugin, onState: (message: any) => void, onError: (message: string) => void) {
  let alive = true, received = false, pending = false;
  const listen = (event: unknown) => {
    const message = readMessage(event);
    if (alive && message?.kind === 'purr-state' && message.state) {
      received = true;
      onState(message);
    }
  };
  const request = async () => {
    if (!alive || received || pending) return;
    pending = true;
    try {
      await plugin.messaging.broadcast({kind: 'purr-action', action: {type: 'snapshot'}});
    } catch {
      if (alive && !received) onError('Could not reach your cat. Click to retry.');
    } finally { pending = false; }
  };
  plugin.event.addListener(AppEvents.MessageBroadcast, undefined, listen);
  void request();
  const retry = setInterval(() => void request(), 1500);
  const timeout = setTimeout(() => {
    if (alive && !received) onError('Cat connection timed out. Click to retry.');
  }, 10000);
  return () => {
    alive = false;
    clearInterval(retry);
    clearTimeout(timeout);
    plugin.event.removeListener(AppEvents.MessageBroadcast, undefined, listen);
  };
}
