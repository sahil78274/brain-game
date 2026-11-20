export async function listenForTilt(onTilt){
 const event=window.DeviceOrientationEvent;if(!event)return false;
 try{if(typeof event.requestPermission==='function'&&await event.requestPermission()!=='granted')return false;}catch{return false;}
 let baseline;
 function change(e){if(typeof e.gamma!=='number')return;baseline??=e.gamma;if(e.gamma-baseline<18)return;stop();onTilt();}
 function stop(){window.removeEventListener('deviceorientation',change);clearTimeout(timer);}
 const timer=setTimeout(stop,10000);
 window.addEventListener('deviceorientation',change);return stop;
}
