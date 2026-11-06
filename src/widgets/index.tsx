import { declareIndexPlugin, ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';
let floating:string|undefined;
async function onActivate(plugin:ReactRNPlugin){
 await plugin.app.registerWidget('cat',WidgetLocation.FloatingWidget,{dimensions:{height:'auto',width:330}});
 const open=async()=>{if(floating && await plugin.window.isFloatingWidgetOpen(floating))return;floating=await plugin.window.openFloatingWidget('cat',{bottom:16,right:16},undefined,false);};
 await plugin.app.registerCommand({id:'show-cat',name:'Purrmodoro: show study cat',action:open});
 await open();
}
async function onDeactivate(plugin:ReactRNPlugin){if(floating)await plugin.window.closeFloatingWidget(floating);}
declareIndexPlugin(onActivate,onDeactivate);
