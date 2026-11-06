const assert = require('node:assert/strict');
const esbuild = require('esbuild');
const vm = require('node:vm');
const events = {MessageBroadcast:'messaging.broadcast',EditorTextEdited:'edit',FocusedRemChange:'focus'};
const intervals=new Map(), timeouts=new Map(); let timerId=0;
function load(file) {
 const code=esbuild.buildSync({entryPoints:[file],bundle:true,platform:'node',format:'cjs',external:['@remnote/plugin-sdk'],write:false}).outputFiles[0].text;
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:()=>({AppEvents:events,WidgetLocation:{FloatingWidget:'floating'}}),console,Date,setInterval:f=>{intervals.set(++timerId,f);return timerId},clearInterval:id=>intervals.delete(id),setTimeout:f=>{timeouts.set(++timerId,f);return timerId},clearTimeout:id=>timeouts.delete(id)});
 return module.exports;
}
const {activate}=load('src/controller.ts');
const {connectPet}=load('src/messages.ts');
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve()};
(async()=>{
 for(const wrapped of [true,false]) {
  const listeners=new Set(),windows=new Set(); let saved,state;
  const plugin={
   event:{addListener:(event,key,fn)=>{if(event===events.MessageBroadcast)listeners.add(fn)},removeListener:(event,key,fn)=>listeners.delete(fn)},
   messaging:{broadcast:async message=>{for(const fn of [...listeners])fn(wrapped?{message}:message)}},
   storage:{getLocal:async()=>({coins:42,minutes:3}),setLocal:async(key,value)=>{saved=value}},
   app:{registerCSS:async()=>{},registerWidget:async()=>{},registerCommand:async()=>{},toast:async()=>{}},
   window:{openFloatingWidget:async name=>{windows.add(name);return name},closeFloatingWidget:async id=>windows.delete(id),isFloatingWidgetOpen:async id=>windows.has(id),setFloatingWidgetPosition:async()=>{}},
   focus:{getFocusedRem:async()=>undefined}
  };
  // Widget mounts first: initial snapshot is lost; retry must recover.
  const disconnect=connectPet(plugin,m=>{state=m},e=>assert.fail(e));
  await flush();
  const stop=await activate(plugin); await flush();
  assert.equal(state.state.coins,42,'saved progress survives startup');
  await plugin.messaging.broadcast({kind:'purr-action',action:{type:'toggle'}});await flush();
  assert.ok(state.state.deadline,'start reaches controller');
  await plugin.messaging.broadcast({kind:'purr-action',action:{type:'toggle'}});await flush();
  assert.equal(state.state.deadline,null,'pause returns state');
  await plugin.messaging.broadcast({kind:'purr-action',action:{type:'menu'}});await flush();
  assert.equal(state.menuOpen,true);assert.ok(windows.has('menu'));
  await plugin.messaging.broadcast({kind:'purr-action',action:{type:'menu'}});await flush();
  assert.equal(state.menuOpen,false);
  disconnect();await stop();assert.equal(listeners.size,0);assert.equal(windows.size,0);
  assert.equal(saved.coins,42);
 }
 let requests=0,error='';let listener;
 const delayed={event:{addListener:(e,k,fn)=>listener=fn,removeListener:()=>{}},messaging:{broadcast:async()=>{requests++}}};
 const disconnect=connectPet(delayed,()=>{},e=>error=e);await flush();
 for(const fn of intervals.values())fn();await flush();assert.equal(requests,2,'retry missing snapshot');
 for(const fn of timeouts.values())fn();assert.match(error,/timed out/);
 listener({message:{kind:'purr-state',state:{coins:1}}});
 for(const fn of intervals.values())fn();await flush();assert.equal(requests,2,'stop retries on receipt');
 disconnect();assert.equal(intervals.size,0);assert.equal(timeouts.size,0);
 console.log('PASS: wrapped/direct broadcasts, startup, saved progress, start/pause, menu, retry, timeout, cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});
