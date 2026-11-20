const fs = require('fs')
const dir = process.argv[2]
const themes = {
  gold: {
    bg: 'radial-gradient(900px 600px at 20% 15%,rgba(212,175,55,.16),transparent 60%),radial-gradient(800px 600px at 90% 90%,rgba(212,175,55,.12),transparent 60%),linear-gradient(135deg,#0B0B0C 0%,#17140F 55%,#0B0B0C 100%)',
    pattern: 'rgba(212,175,55,.10)',
    bag1: '#F7E3A1', bag2: '#C9973D', aCol: '#141009', spark: '#FFF4D0',
    word: '#F3D98B', accent: '#E8C468', text: '#F8F3E6', sub: '#CDBF9C',
    pill1bg: 'linear-gradient(135deg,#F7E3A1,#C9973D)', pill1fg: '#1A1408',
    pill2bg: 'rgba(255,255,255,.04)', pill2fg: '#F3D98B', pill2border: '2px solid #C9973D',
    frame: '#D4AF37', badgeBg: 'linear-gradient(135deg,#F7E3A1,#C9973D)', badgeFg: '#1A1408',
    ring: 'rgba(212,175,55,.55)',
  },
  emerald: {
    bg: 'radial-gradient(900px 600px at 20% 15%,rgba(16,185,129,.22),transparent 60%),radial-gradient(800px 600px at 90% 90%,rgba(234,207,152,.16),transparent 60%),linear-gradient(135deg,#022C22 0%,#064E3B 55%,#03211A 100%)',
    pattern: 'rgba(234,207,152,.10)',
    bag1: '#F3E0B5', bag2: '#C8A465', aCol: '#063B2E', spark: '#FFFFFF',
    word: '#F3E0B5', accent: '#EACF98', text: '#F4FBF7', sub: '#BFE3D3',
    pill1bg: 'linear-gradient(135deg,#F3E0B5,#C8A465)', pill1fg: '#063B2E',
    pill2bg: 'rgba(255,255,255,.06)', pill2fg: '#F3E0B5', pill2border: '2px solid #C8A465',
    frame: '#EACF98', badgeBg: 'linear-gradient(135deg,#F3E0B5,#C8A465)', badgeFg: '#063B2E',
    ring: 'rgba(234,207,152,.55)',
  },
}
const logo = (t, id) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="9" y1="10" x2="55" y2="59"><stop offset="0" stop-color="${t.bag1}"/><stop offset="1" stop-color="${t.bag2}"/></linearGradient></defs><path d="M23 22v-5a9 9 0 0 1 18 0v5" fill="none" stroke="url(#${id})" stroke-width="4.2" stroke-linecap="round"/><rect x="9" y="21" width="46" height="38" rx="13" fill="url(#${id})"/><path d="M23.5 51 32 31.5 40.5 51" fill="none" stroke="${t.aCol}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.2 44.2h9.6" stroke="${t.aCol}" stroke-width="4.2" stroke-linecap="round"/><path d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6z" fill="${t.spark}"/></svg>`
const fonts = '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Playfair+Display:wght@600;700&family=Hind+Siliguri:wght@600;700&display=swap" rel="stylesheet">'
for (const [name, t] of Object.entries(themes)) {
  const profile = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;font-family:Poppins,sans-serif;background:${t.bg};display:grid;place-items:center;position:relative}
.pat{position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,${t.pattern} 0 1px,transparent 1px 34px),repeating-linear-gradient(-45deg,${t.pattern} 0 1px,transparent 1px 34px);-webkit-mask-image:radial-gradient(circle,transparent 40%,#000 75%);mask-image:radial-gradient(circle,transparent 40%,#000 75%)}
.ring{position:absolute;left:50%;top:50%;width:900px;height:900px;transform:translate(-50%,-50%);border-radius:50%;border:3px solid ${t.ring};box-shadow:0 0 0 14px rgba(0,0,0,.15),0 0 0 17px ${t.ring}}
.wrap{position:relative;display:flex;flex-direction:column;align-items:center;gap:20px;transform:translateY(6px)}
.icon{width:470px;height:470px;filter:drop-shadow(0 30px 50px rgba(0,0,0,.55))}.icon svg{width:100%;height:100%}
.word{font-family:Poppins,sans-serif;color:${t.word};font-weight:700;font-size:120px;letter-spacing:-2px;line-height:1}
</style></head><body><div class="pat"></div><div class="ring"></div><div class="wrap"><div class="icon">${logo(t, 'gp')}</div><div class="word">anaqia</div></div></body></html>`
  const cover = `<!doctype html><html><head><meta charset="utf-8">${fonts}<style>*{margin:0;padding:0;box-sizing:border-box}
body{width:1640px;height:924px;overflow:hidden;font-family:Poppins,'Hind Siliguri',sans-serif;color:${t.text};position:relative;background:${t.bg}}
.pat{position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,${t.pattern} 0 1px,transparent 1px 38px),repeating-linear-gradient(-45deg,${t.pattern} 0 1px,transparent 1px 38px);opacity:.8}
.line{position:absolute;left:150px;top:150px;width:120px;height:3px;background:${t.accent}}
.text{position:absolute;left:150px;top:178px;width:720px}
.brand{display:flex;align-items:center;gap:18px;margin-bottom:22px}
.brand svg{width:92px;height:92px;filter:drop-shadow(0 12px 22px rgba(0,0,0,.5))}
.brand b{font-size:70px;font-weight:700;letter-spacing:-1.5px;line-height:1;color:${t.word}}
.brand small{display:block;font-size:16px;letter-spacing:7px;margin-top:8px;font-weight:600;color:${t.sub}}
h1{font-family:'Playfair Display',serif;font-size:58px;line-height:1.1;font-weight:700}
h1 span{color:${t.accent};font-style:italic}
.bn{font-family:'Hind Siliguri',sans-serif;font-size:30px;font-weight:600;margin-top:14px;color:${t.sub}}
.contact{position:absolute;left:150px;top:510px;display:flex;flex-direction:column;gap:14px}
.pill{display:inline-flex;align-items:center;gap:10px;font-size:25px;font-weight:700;padding:13px 24px;border-radius:14px;width:fit-content}
.p1{background:${t.pill1bg};color:${t.pill1fg};box-shadow:0 12px 28px rgba(0,0,0,.4)}
.p2{background:${t.pill2bg};color:${t.pill2fg};border:${t.pill2border}}
.photo{position:absolute;left:970px;top:160px;width:500px;height:590px;border-radius:30px;background:url(hero.jpg) 55% center/cover;border:6px solid ${t.frame};box-shadow:0 30px 70px rgba(0,0,0,.6),0 0 0 14px rgba(0,0,0,.25)}
.card{position:absolute;width:160px;height:160px;border-radius:24px;background-size:cover;background-position:center;border:5px solid ${t.frame};box-shadow:0 18px 40px rgba(0,0,0,.55)}
.badge{position:absolute;left:1360px;top:175px;width:140px;height:140px;border-radius:50%;background:${t.badgeBg};color:${t.badgeFg};display:grid;place-items:center;text-align:center;font-family:'Playfair Display',serif;font-weight:700;font-size:24px;line-height:1.1;box-shadow:0 16px 34px rgba(0,0,0,.5)}
.badge small{display:block;font-family:Poppins,sans-serif;font-size:13px;letter-spacing:2px;font-weight:600}
</style></head><body><div class="pat"></div><div class="line"></div>
<div class="text"><div class="brand">${logo(t, 'gc')}<div><b>anaqia</b><small>EVERYTHING YOU LOVE</small></div></div>
<h1>Your World Of Shopping<br><span>Starts Here.</span></h1><p class="bn">আপনার পছন্দের সবকিছু, এক জায়গায়</p></div>
<div class="contact"><div class="pill p1">🌐 anaqia.com</div><div class="pill p2">💬 01799276886</div></div>
<div class="photo"></div>
<div class="card" style="left:890px;top:575px;background-image:url(p-street-sneakers.jpg);transform:rotate(-6deg)"></div>
<div class="card" style="left:1400px;top:610px;background-image:url(p-glow-serum.jpg);transform:rotate(6deg)"></div>
<div class="card" style="left:880px;top:160px;width:130px;height:130px;background-image:url(p-anc-headphones.jpg);transform:rotate(-5deg)"></div>
<div class="badge"><div><small>PREMIUM</small>Quality</div></div>
</body></html>`
  fs.writeFileSync(`${dir}/profile-${name}.html`, profile)
  fs.writeFileSync(`${dir}/cover-${name}.html`, cover)
  fs.writeFileSync(`${dir}/preview-${name}.html`, fs.readFileSync(`${dir}/preview.html`, 'utf8').replaceAll('anaqia-facebook-cover-v2.png', `anaqia-facebook-cover-${name}.png`).replaceAll('anaqia-facebook-profile-v2.png', `anaqia-facebook-profile-${name}.png`))
}
