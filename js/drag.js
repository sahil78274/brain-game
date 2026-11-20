import {transform} from './scene.js';
export function bindDrag(svg,getState,perform,select){
 let drag;
 const point=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
 svg.addEventListener('pointerdown',e=>{const node=e.target.closest('[data-piece]');if(!node||drag||e.button!==0)return;const p=getState().pieces[node.dataset.piece],a=point(e);drag={p,node,a,time:performance.now(),pointer:e.pointerId};svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(drag?.pointer!==e.pointerId)return;const {p,node,a}=drag,b=point(e);node.setAttribute('transform',transform(p,p.x+b.x-a.x,p.y+b.y-a.y));});
 svg.addEventListener('pointercancel',e=>{if(drag?.pointer!==e.pointerId)return;drag.node.setAttribute('transform',transform(drag.p));drag=null;});
 svg.addEventListener('pointerup',e=>{if(drag?.pointer!==e.pointerId)return;const {p,node,a,time}=drag,b=point(e);drag=null;node.setAttribute('transform',transform(p));const rect=svg.getBoundingClientRect();if(e.clientX<=rect.left+8||e.clientX>=rect.right-8||e.clientY<=rect.top+8||e.clientY>=rect.bottom-8){perform({id:p.id,type:'off'});return;}if(Math.hypot(b.x-a.x,b.y-a.y)<9){select(p.id);perform({id:p.id,type:performance.now()-time>=550?'hold':'tap'},true);return;}
 const targets=Object.values(getState().pieces).filter(q=>!q.hidden&&q.id!==p.id).map(q=>({q,d:Math.min(Math.hypot(q.x-b.x,q.y-b.y),Math.hypot(q.x-p.x-b.x+a.x,q.y-p.y-b.y+a.y))})).filter(t=>t.d<65).sort((a,b)=>a.d-b.d);
 const hit=targets[0];if(hit)perform({id:p.id,type:'drop',target:hit.q.id});else select(p.id);
 });
 svg.addEventListener('keydown',e=>{const id=e.target.dataset.piece;if(id&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(id);document.querySelector('#help-controls')?.focus();}});
}
