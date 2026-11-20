export class RewardedAdService{
 constructor(provider){this.provider=provider;}
 async request(kind){try{return (await this.provider?.show(kind))===true;}catch{return false;}}
}
export const mockProvider={label:'Mock rewarded ad · no real advertisement',async show(){return true;}};
export class RevealService{
 constructor(ads){this.ads=ads;}
 async reveal(level,kind){if(!['hint','solution'].includes(kind))return null;return await this.ads.request(kind)?level[kind]:null;}
}
export class AudioManager{
 play(enabled){if(!enabled)return;try{this.context??=new (window.AudioContext||window.webkitAudioContext)();const c=this.context;c.resume().catch(()=>{});[440,554,659].forEach((hz,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.075;o.frequency.value=hz;g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.25);});}catch{/* Sound is optional. */}}
}
