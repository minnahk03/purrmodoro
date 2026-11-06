import {usePlugin} from '@remnote/plugin-sdk';
import {useState, useEffect} from 'react';
import {State, Action} from './engine';
import {connectPet} from './messages';

export function usePet() {
  const plugin = usePlugin();
  const [s, set] = useState<State | null>(null);
  const [menuOpen, menu] = useState(false);
  const [error, err] = useState('');
  useEffect(() => connectPet(plugin, message => {
    set(message.state);
    menu(message.menuOpen);
    err(message.trackingError || '');
  }, err), [plugin]);
  const send = (action: Action) => {
    plugin.messaging.broadcast({kind: 'purr-action', action})
      .catch(() => err('Could not save that action. Try again.'));
  };
  return {s, send, plugin, menuOpen, error};
}
