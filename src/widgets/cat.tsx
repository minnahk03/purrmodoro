import {renderWidget,WidgetLocation,AppEvents} from '@remnote/plugin-sdk';
import {useEffect,useRef,useState} from 'react';
import {usePet} from '../usePet';
import {Pet} from '../Pet';
import {readMessage} from '../messages';
function Widget(){const {s,send,plugin,menuOpen,error}=usePet();const current=useRef({s,menuOpen});current.current={s,menuOpen};const hover=useRef(false);const [walk,W]=useState(false),[left,L]=useState(false),[step,S]=useState(0);
 useEffect(()=>{let alive=true,busy=false,id='',instance='',x=0,width=0,direction=-1,nextPause=Date.now()+5000,restUntil=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const locate=async()=>{const ctx=await plugin.widget.getWidgetContext<WidgetLocation.FloatingWidget>();id=ctx.floatingWidgetId;instance=ctx.widgetInstanceId;const rect=await plugin.widget.getDimensions(instance as unknown as number);x=rect.x;width=Math.max(180,rect.x+rect.width+24);};
 const reset=(event:unknown)=>{const m=readMessage(event);if(m?.kind==='purr-reset-position')locate().catch(()=>{});};
 locate().catch(()=>{});plugin.event.addListener(AppEvents.MessageBroadcast,undefined,reset);
 const timer=setInterval(async()=>{if(!alive||busy||!id)return;const {s,menuOpen}=current.current;const stopped=!s||!s.wander||!s.motion||reduced.matches||hover.current||menuOpen||(s.phase==='focus'&&s.deadline!==null)||s.actionUntil>Date.now()||Date.now()<restUntil;if(stopped){W(false);return;}if(Date.now()>nextPause){restUntil=Date.now()+3500;nextPause=restUntil+6500;W(false);return;}busy=true;try{x=Math.max(8,Math.min(width-180,x+direction*3));if(x<=8||x>=width-180)direction*=-1;await plugin.window.setFloatingWidgetPosition(id,{left:x,bottom:8});if(alive){W(true);L(direction<0);S(n=>n+1);}}catch{W(false);}finally{busy=false;}},180);
 return()=>{alive=false;clearInterval(timer);plugin.event.removeListener(AppEvents.MessageBroadcast,undefined,reset);};},[plugin]);
 return s?<Pet s={s} src={`${plugin.rootURL}ragdoll-sprites.png`} walking={walk} left={left} step={step} onClick={()=>send({type:'menu'})} onHover={v=>hover.current=v}/>:<button onClick={()=>send({type:'snapshot'})}>{error||'Waking cat…'}</button>;}
renderWidget(Widget);
