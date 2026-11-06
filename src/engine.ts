export type State = {focus:number; rest:number; long:number; sessions:number; round:number; phase:'focus'|'break'|'long'; remaining:number; duration:number; deadline:number|null; credited:number; coins:number; minutes:number; completed:number; treats:number; plays:number; name:string; compact:boolean; sound:boolean; message:string};
export const initial = ():State => ({focus:25,rest:5,long:15,sessions:4,round:1,phase:'focus',remaining:1500000,duration:1500000,deadline:null,credited:0,coins:0,minutes:0,completed:0,treats:0,plays:0,name:'Mochi',compact:false,sound:true,message:'A little focus. A little purr.'});
export function tick(s:State, now:number):State {
 if(s.deadline===null)return s;
 const remaining=Math.max(0,Math.min(s.remaining,s.deadline-now));
 const earned=s.phase==='focus'?Math.floor((s.duration-remaining)/60000):0;
 const delta=Math.max(0,earned-s.credited);
 let n={...s,remaining,credited:earned,coins:s.coins+delta,minutes:s.minutes+delta};
 if(remaining===0){
  const wasFocus=s.phase==='focus';
  n.phase=wasFocus?(s.round>=s.sessions?'long':'break'):'focus';
  n.round=wasFocus?s.round:s.phase==='long'?1:s.round+1;
  n.duration=(n.phase==='focus'?s.focus:n.phase==='long'?s.long:s.rest)*60000;
  n.remaining=n.duration;n.deadline=null;n.credited=0;
  n.completed=s.completed+(wasFocus?1:0);
  n.message=wasFocus?'You did it! Time for a stretch.':'Ready for another little adventure?';
 }
 return n;
}
export function toggle(s:State,now:number){const n=tick(s,now);return {...n,deadline:n.deadline===null?now+n.remaining:null};}
export function buy(s:State,item:'treat'|'play'):State {const cost=item==='treat'?5:10;if(s.coins<cost)return s;return {...s,coins:s.coins-cost,treats:s.treats+(item==='treat'?1:0),plays:s.plays+(item==='play'?1:0),message:item==='treat'?'Nom nom… you are my favourite human.':'Best. Study break. Ever!'};}
