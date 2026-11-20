import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const read=name=>JSON.parse(readFileSync(new URL(`../levels/${name}`,import.meta.url)));
const levels=read('manifest.json').batches.flatMap(read).sort((a,b)=>a.id-b.id);
const fallback=process.env.CHROMIUM_FROM_NPM?(await import('@sparticuz/chromium')).default:null;
const browser=await chromium.launch(fallback?{executablePath:await fallback.executablePath(),args:fallback.args}:{});
const errors=[];
const setup=async options=>{const page=await browser.newPage(options);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await page.goto(process.env.TEST_URL||'http://localhost:4173');await page.locator('.scene').waitFor();return page;};
const act=async(page,step)=>{await page.locator('#help-controls').click();await page.locator('#object').selectOption(step.id);if(step.type==='drop'){await page.locator('#target').selectOption(step.target);await page.locator('#drop').click();}else await page.locator(`[data-action="${step.type}"]`).click();};
try{
 const page=await setup({viewport:{width:1440,height:900}});
 const cloud=page.locator('[data-piece="cloud"]');const bounds=await cloud.boundingBox();const svg=await page.locator('.scene').boundingBox();
 await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.mouse.move(svg.x+2,svg.y+110,{steps:12});await page.mouse.up();
 await page.getByText('Nicely done!').waitFor();await page.locator('#next').click();
 for(const l of levels.slice(1)){
  await page.getByRole('heading',{name:l.question,exact:true}).waitFor();
  for(const step of l.steps){
   if((l.id===3&&step.id==='switch')||(l.id===4&&step.type==='hold')){
    const r=await page.locator(`[data-piece="${step.id}"]`).boundingBox();await page.mouse.move(r.x+r.width/2,r.y+r.height*.45);await page.mouse.down();if(step.type==='hold')await page.waitForTimeout(625);await page.mouse.up();
   }else await act(page,step);
  }
  await page.getByText('Nicely done!').waitFor();await page.locator('#next').click();
 }
 await page.getByRole('heading',{name:'World Map'}).waitFor();assert.match(await page.locator('#wallet').innerText(),new RegExp(String(levels.length*10)));await page.reload();await page.locator(`[data-level="${Math.min(levels.length,200)}"]:not(:disabled)`).waitFor();assert.equal(await page.locator('[data-level]:not(:disabled)').count(),Math.min(levels.length,200));
 await page.locator('[data-level="1"]').click();await page.locator('#hint').click();await page.getByText(/no real advertisement/).waitFor();await page.locator('#mock').click();await page.getByText(levels[0].hint,{exact:true}).waitFor();await page.locator('.close').click();await page.reload();await page.locator('#hint').click();await page.getByText(levels[0].hint,{exact:true}).waitFor();await page.locator('.close').click();
 await page.locator('[data-tab="daily"]').click();await page.locator('#daily-play').click();const title=await page.locator('h1').innerText();for(const step of levels.find(l=>l.question===title).steps)await act(page,step);await page.getByText(/\+25 coins/).waitFor();await page.locator('#next').click();await page.getByText(/reward collected/).waitFor();
 await page.locator('#settings').click();await page.locator('#sound').click();await page.locator('#wipe').click();await page.locator('#confirm').click();assert.match(await page.locator('#wallet').innerText(),/0 coins/);
 const mobile=await setup({viewport:{width:390,height:844},isMobile:true,hasTouch:true});assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);await act(mobile,levels[0].steps[0]);await mobile.getByText('Nicely done!').waitFor();
 assert.deepEqual(errors,[]);console.log(`Browser passed: ${levels.length}/${levels.length} puzzles, pointer drag/tap/hold, accessible controls, rewards, reload, daily, reset, and mobile-width layout.`);
}finally{await browser.close();}
