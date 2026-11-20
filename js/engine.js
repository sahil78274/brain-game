export const actions=['tap','hold','rotate','grow','shrink','back','front','tilt','drop','off'];
export function createState(level){return {index:0,won:false,pieces:Object.fromEntries(level.scene.map((p,z)=>[p.id,{...p,z,angle:0,scale:level.id===1&&p.id==='cloud'?1.16:1,marks:0}]))};}
export function apply(level,state,action){
 const {id,type,target}=action, piece=state.pieces[id], step=level.steps[state.index];
 if(state.won||!piece||piece.hidden||!step||step.id!==id||step.type!==type||step.target!==target||level.guard?.(state,action)===false)return false;
 const pieces=Object.values(state.pieces);
 if(type==='off')piece.hidden=true;
 if(type==='drop'){
  const destination=state.pieces[target];if(!destination||destination.hidden)return false;
  const side=piece.x<=destination.x?-1:1;
  piece.x=Math.max(55,Math.min(595,destination.x+side*(52+destination.marks%3*9)));
  piece.y=Math.min(278,destination.y+29+destination.marks%3*15);
  destination.marks++;
 }
 if(type==='rotate')piece.angle+=90;
 if(type==='tilt')piece.angle+=20;
 if(type==='shrink')piece.scale*=.73;
 if(type==='grow')piece.scale*=1.29;
 if(type==='back')piece.z=Math.min(...pieces.map(p=>p.z))-1;
 if(type==='front')piece.z=Math.max(...pieces.map(p=>p.z))+1;
 if(type==='hold'||type==='tap')piece.active=true;
 piece.marks++;
 if(step.reveal){const hidden=state.pieces[step.reveal];hidden.hidden=false;hidden.z=Math.max(...pieces.map(p=>p.z))+1;}
 level.effect?.(state,action);
 state.index++;
 state.won=state.index===level.steps.length;
 return true;
}
