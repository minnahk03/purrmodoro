import React from 'react';
import {State} from './engine';
import './cat.css';
export function time(ms:number){const n=Math.ceil(ms/1000);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;}
export function Pet({s,src,walking=false,left=false,step=0,onClick,onHover}:{s:State;src:string;walking?:boolean;left?:boolean;step?:number;onClick:()=>void;onHover?:(v:boolean)=>void}){
 const active=s.actionUntil>Date.now()?s.action:'';const focusing=s.phase==='focus'&&s.deadline!==null;
 const pose=active==='treat'?4:active==='play'?5:focusing?(s.focusPose==='sleep'?1:0):walking?(step%2?3:2):0;
 return <div className={`pet-stage ${s.motion?'motion':''}`} onMouseEnter={()=>onHover?.(true)} onMouseLeave={()=>onHover?.(false)}>
 <div className="speech"><span>{s.deadline? s.phase==='focus'?'Shh… focusing':'Time to stretch':s.remaining===s.duration?'Ready when you are':'Taking a paws'}</span><strong>{time(s.remaining)}</strong></div>
 <button className="cat-button" onClick={onClick} aria-label={`${s.name}, ${time(s.remaining)} remaining. Open cat menu`} style={{width:s.size,height:s.size*1.5}}>
 <span className={`sprite pose-${pose}`} style={{backgroundImage:`url("${src}")`,backgroundPosition:`${(pose%3)*50}% ${pose<3?0:100}%`,transform:left&&walking?'scaleX(-1)':undefined}}/>
 {s.accessory!=='none'&&<span className={`accessory ${s.accessory}`}>{s.accessory==='star'?'♛':s.accessory==='rose'?'🎀':'〰'}</span>}
 {['pet','celebrate'].includes(active)&&<span className="hearts">♡ ✧ ♡</span>}{focusing&&pose===1&&<span className="zzz">z z Z</span>}
 </button></div>;
}
