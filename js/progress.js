export const key='brain-trap.v1';
export const fresh=()=>({completed:[],coins:0,current:1,reveals:{},daily:{},sound:true});
export function load(storage){try{const saved=JSON.parse(storage.getItem(key));return saved?{...fresh(),...saved}:fresh();}catch{return fresh();}}
export function save(storage,state){try{storage.setItem(key,JSON.stringify(state));return true;}catch{return false;}}
export const unlocked=(state,id)=>id===1||state.completed.includes(id-1);
export function reward(state,id,date){const list=date?state.daily:state.completed;if(date?list[date]:list.includes(id))return 0;if(date)list[date]=true;else list.push(id);const coins=date?25:10;state.coins+=coins;return coins;}
