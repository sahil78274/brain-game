// Optional scene-specific hooks. Content remains serializable; the loader attaches these.
export const behaviors={
 2:{effect(state,a){if(a.type==='drop'){const {crown,frog}=state.pieces;crown.x=frog.x;crown.y=frog.y-38;}}},
 3:{effect(state,a){if(a.id==='switch')state.pieces.fan.active=true;if(a.id==='fan')state.pieces.bowl.cooled=true;}},
 5:{effect(state,a){if(a.id==='sun')state.pieces.tree.lit=true;}},
 8:{effect(state,a){if(a.type==='back'){const {crab,rock}=state.pieces;crab.x=rock.x;crab.y=rock.y;}}},
 23:{effect(state,a){if(a.type==='back'){const {seed,dirt}=state.pieces;seed.x=dirt.x;seed.y=dirt.y+6;}}}
};
