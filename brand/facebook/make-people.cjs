const fs=require('fs');const {chromium}=require('playwright');
const logo=fs.readFileSync('cover.html','utf8').match(/<svg.*?<\/svg>/s)[0];
const variants={hijab:{img:'hero-hijab.jpg',pos:'50% 30%',cards:[['p-glow-serum.jpg',870,575,-8],['p-leather-tote.jpg',1395,600,7]]},
 man:{img:'hero-man.jpg',pos:'45% 62%',cards:[['p-smart-watch-pro.jpg',870,575,-8],['p-street-sneakers.jpg',1395,600,7]]}};
const page=(v)=>`<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1640px;height:924px;overflow:hidden;font-family:Poppins,'Hind Siliguri',sans-serif;color:#fff;position:relative;background:radial-gradient(700px 500px at 30% 40%,rgba(99,102,241,.45),transparent 60%),radial-gradient(600px 400px at 10% 100%,rgba(255,92,138,.25),transparent 60%),radial-gradient(700px 500px at 85% 50%,rgba(139,92,246,.35),transparent 60%),#0E0B2E}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(201,195,255,.12) 2px,transparent 2px);background-size:36px 36px}
.text{position:absolute;left:150px;top:178px;width:700px}
.brand{display:flex;align-items:center;gap:18px;margin-bottom:24px}
.brand svg{width:90px;height:90px;filter:drop-shadow(0 12px 26px rgba(255,92,138,.45))}
.brand b{font-size:68px;font-weight:700;letter-spacing:-1.5px;line-height:1}
.brand small{display:block;font-size:16px;letter-spacing:6px;color:#C9C3FF;margin-top:8px;font-weight:500}
h1{font-size:54px;line-height:1.12;font-weight:800}
h1 span{background:linear-gradient(90deg,#FF6B8B,#8B7CFF 55%,#6EC3FF);-webkit-background-clip:text;background-clip:text;color:transparent}
.bn{font-family:'Hind Siliguri',sans-serif;font-size:30px;font-weight:700;margin-top:12px;color:#C9C3FF}
.contact{position:absolute;left:150px;top:505px;display:flex;flex-direction:column;gap:14px}
.pill{display:inline-flex;align-items:center;gap:10px;font-size:25px;font-weight:700;padding:13px 24px;border-radius:16px;width:fit-content}
.web{background:#FF5C8A;box-shadow:0 12px 28px rgba(255,92,138,.35)}
.wa{background:#25D366;box-shadow:0 12px 28px rgba(6,95,70,.35)}
.glow{position:absolute;left:930px;top:120px;width:600px;height:680px;border-radius:50%;background:radial-gradient(closest-side,rgba(139,92,246,.55),transparent);filter:blur(20px)}
.photo{position:absolute;left:960px;top:150px;width:520px;height:600px;border-radius:36px;background:url(${v.img}) ${v.pos}/cover;border:6px solid transparent;background-clip:padding-box;box-shadow:0 0 0 6px rgba(139,124,255,.85),0 30px 70px rgba(0,0,0,.55);transform:rotate(3deg)}
.card{position:absolute;width:170px;height:170px;border-radius:28px;background-size:cover;background-position:center;border:5px solid #fff;box-shadow:0 18px 40px rgba(0,0,0,.5)}
.badge{position:absolute;left:1350px;top:165px;width:150px;height:150px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#FF5C8A);display:grid;place-items:center;text-align:center;font-family:'Hind Siliguri',sans-serif;font-weight:700;font-size:34px;line-height:1.05;box-shadow:0 16px 34px rgba(255,92,138,.45);transform:rotate(-10deg);border:4px solid #fff}
.badge small{display:block;font-size:18px}
</style></head><body><div class="dots"></div>
<div class="text"><div class="brand">${logo}<div><b>anaqia</b><small>EVERYTHING YOU LOVE</small></div></div>
<h1>Your World Of Shopping<br><span>Starts Here.</span></h1><p class="bn">আপনার পছন্দের সবকিছু, এক জায়গায়</p></div>
<div class="contact"><div class="pill web">🌐 anaqia.com</div><div class="pill wa">💬 01799276886</div></div>
<div class="glow"></div><div class="photo"></div>
${v.cards.map(([f,x,y,r])=>`<div class="card" style="left:${x}px;top:${y}px;background-image:url(${f});transform:rotate(${r}deg)"></div>`).join('')}
<div class="badge"><div>৫০%<small>পর্যন্ত ছাড়</small></div></div>
</body></html>`;
(async()=>{const b=await chromium.launch();
for(const [k,v] of Object.entries(variants)){
 fs.writeFileSync(`cover-${k}.html`,page(v));
 const p=await b.newPage({viewport:{width:1640,height:924}});await p.goto('file://'+process.cwd()+`/cover-${k}.html`);await p.waitForTimeout(1500);
 await p.screenshot({path:`anaqia-facebook-cover-${k}.png`});await p.close();
 const prev=fs.readFileSync('preview.html','utf8').replaceAll('anaqia-facebook-cover-v2.png',`anaqia-facebook-cover-${k}.png`).replaceAll('anaqia-facebook-profile-v2.png','anaqia-facebook-profile.png');
 fs.writeFileSync(`preview-${k}.html`,prev);
 const q=await b.newPage({viewport:{width:1400,height:520}});await q.goto('file://'+process.cwd()+`/preview-${k}.html`);await q.waitForTimeout(500);
 await q.screenshot({path:`preview-${k}.png`,fullPage:true});await q.close();}
await b.close();})();
