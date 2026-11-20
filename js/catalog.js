import {behaviors} from './behaviors.js';
export const worlds=['Tricky Beginnings','Unexpected Logic','Hidden Secrets','Funny Situations','Object Tricks','Character Challenges','Creative Thinking','Multi-Step Mysteries','Impossible Challenges','Genius Master World'];
const root=new URL('../levels/',import.meta.url);
async function json(file){const response=await fetch(new URL(file,root));if(!response.ok)throw Error(`Could not load ${file}`);return response.json();}
export async function loadLevels(){const {batches}=await json('manifest.json');return (await Promise.all(batches.map(json))).flat().sort((a,b)=>a.id-b.id).map(level=>({...level,...behaviors[level.id]}));}
