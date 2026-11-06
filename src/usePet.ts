import {usePlugin,AppEvents} from '@remnote/plugin-sdk';
import {useState,useEffect} from 'react';
import {State,Action} from './engine';
export function usePet(){const plugin=usePlugin();const [s,set]=useState<State|null>(null),[menuOpen,menu]=useState(false),[error,err]=useState('');
 useEffect(()=>{let alive=true;const listen=(m:any)=>{if(m?.kind==='purr-state'&&alive){set(m.state);menu(m.menuOpen);err(m.trackingError||'');}};plugin.event.addListener(AppEvents.MessageBroadcast,undefined,listen);plugin.messaging.broadcast({kind:'purr-action',action:{type:'snapshot'}}).catch(()=>err('Could not reach your cat. Restart the plugin.'));return()=>{alive=false;plugin.event.removeListener(AppEvents.MessageBroadcast,undefined,listen);};},[plugin]);
 const send=(action:Action)=>{plugin.messaging.broadcast({kind:'purr-action',action}).catch(()=>err('Could not save that action. Try again.'));};return {s,send,plugin,menuOpen,error};}
