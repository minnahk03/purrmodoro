import {AppEvents,ReactRNPlugin,WidgetLocation} from '@remnote/plugin-sdk';
import {State,initial,migrate,tick,reduce,Action,countWords} from './engine';
import {recordWords} from './engine';
export const KEY='purrmodoro-v1';
export async function activate(plugin:ReactRNPlugin){
 let s=migrate(await plugin.storage.getLocal(KEY)),catId:string|undefined,menuId:string|undefined,interval:ReturnType<typeof setInterval>,busy=Promise.resolve(),active=true,dirty=false,saveAt=0,wordTimer:ReturnType<typeof setTimeout>,trackingError='';
 const enqueue=(fn:()=>Promise<void>)=>{busy=busy.then(fn).catch(async e=>{console.error('Purrmodoro',e);await plugin.app.toast('Purrmodoro could not finish that action. Try reopening the cat.');});return busy;};
 const save=async()=>{await plugin.storage.setLocal(KEY,s);dirty=false;saveAt=Date.now();};
 const emit=()=>plugin.messaging.broadcast({kind:'purr-state',state:s,menuOpen:!!menuId,trackingError});
 const show=async()=>{if(catId&&await plugin.window.isFloatingWidgetOpen(catId))return;catId=await plugin.window.openFloatingWidget('cat',{bottom:8,right:24},undefined,false);};
 const menu=async()=>{if(menuId&&await plugin.window.isFloatingWidgetOpen(menuId)){await plugin.window.closeFloatingWidget(menuId);menuId=undefined;}else{menuId=await plugin.window.openFloatingWidget('menu',{bottom:180,right:24},undefined,false);}await emit();};
 // Style only this plugin's floating frames, never other widgets or the editor.
 const selector='iframe[src*="purrmodoro-study-cat"]';
 await plugin.app.registerCSS('purr-transparent',`${selector},div:has(> ${selector}),div:has(> div > ${selector}){background:transparent!important;background-color:transparent!important;box-shadow:none!important;border:0!important;padding:0!important;} ${selector}{color-scheme:normal;}`);
 await plugin.app.registerWidget('cat',WidgetLocation.FloatingWidget,{dimensions:{height:'auto',width:180}});
 await plugin.app.registerWidget('menu',WidgetLocation.FloatingWidget,{dimensions:{height:'auto',width:330}});
 const onMessage=(m:any)=>{if(!active||m?.kind!=='purr-action')return;enqueue(async()=>{const a=m.action as Action;if(a.type==='snapshot'){await emit();return;}if(a.type==='menu'){await menu();return;}if(a.type==='resetPosition'){if(catId)await plugin.window.setFloatingWidgetPosition(catId,{bottom:8,right:24});await plugin.messaging.broadcast({kind:'purr-reset-position'});return;}s=reduce(s,a);await save();await emit();});};
 const sample=async()=>{if(!s.writing)return;try{const rem=await plugin.focus.getFocusedRem();if(!rem)return;const text=await plugin.editor.getFocusedEditorText();if(!text)return;const plain=await plugin.richText.toString(text);const before=s;const next=recordWords(s,rem._id,countWords(plain));s=next;dirty=true;trackingError='';if(next.words!==before.words)await emit();}catch{trackingError='Writing tracking is unavailable. Check this plugin’s read permission.';await emit();}};
 const onEdit=()=>{clearTimeout(wordTimer);wordTimer=setTimeout(()=>enqueue(sample),400);};
 const onFocus=()=>{clearTimeout(wordTimer);enqueue(sample);};
 await plugin.event.addListener(AppEvents.MessageBroadcast,undefined,onMessage);
 await plugin.event.addListener(AppEvents.EditorTextEdited,undefined,onEdit);
 await plugin.event.addListener(AppEvents.FocusedRemChange,undefined,onFocus);
 await plugin.app.registerCommand({id:'show-cat',name:'Purrmodoro: show study cat',action:show});
 await plugin.app.registerCommand({id:'pet-menu',name:'Purrmodoro: open cat menu',action:menu});
 await plugin.app.registerCommand({id:'pause-timer',name:'Purrmodoro: start or pause focus',action:()=>enqueue(async()=>{s=reduce(s,{type:'toggle'});await save();await emit();})});
 interval=setInterval(()=>enqueue(async()=>{if(!active)return;const prev=s;s=tick(s,Date.now());if(s!==prev)dirty=true;if(s.phase!==prev.phase){await plugin.app.toast(s.message);await plugin.messaging.broadcast({kind:'purr-chime'});}if(dirty&&(Date.now()-saveAt>=10000||s.coins!==prev.coins||s.phase!==prev.phase))await save();if(menuId&&!await plugin.window.isFloatingWidgetOpen(menuId))menuId=undefined;await emit();}),1000);
 await show();await enqueue(sample);await save();
 return async()=>{active=false;clearInterval(interval);clearTimeout(wordTimer);await busy;await save();await plugin.event.removeListener(AppEvents.MessageBroadcast,undefined,onMessage);await plugin.event.removeListener(AppEvents.EditorTextEdited,undefined,onEdit);await plugin.event.removeListener(AppEvents.FocusedRemChange,undefined,onFocus);if(catId)await plugin.window.closeFloatingWidget(catId);if(menuId)await plugin.window.closeFloatingWidget(menuId);};
}
