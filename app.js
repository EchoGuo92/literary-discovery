
const STATE={data:null,route:"cold",anchorId:null,cardIndex:0,lastRoute:null,bookId:null,lang:"zh"};
const KEY="literary-discovery-rc-0.9";
const ZH={
 home:"Home",library:"Library",brandAria:"回到作家入口",
 coldEyebrow:"FAMILIAR ENTRY · DELIBERATE EXPANSION",coldTitle:"最近想到哪位作家？",
 coldSub:"从一个你已经想到的作家开始。",startHere:"从这里开始 →",chooseWriter:"换一个入口",
 specialHeading:"这本书有什么特别",connectionHeading:"与你的联系",moodLabel:"Reading Mood",writerInfo:"作家信息",
 want:"想读",read:"我读过",not:"不太感兴趣",statusWant:"想读",statusRead:"已读",
 empty:"还没有留下任何书。Home 里的“想读”和“我读过”会把书带到这里。",
 backLibrary:"← 返回 Library",reflectButton:"聊聊这本书",reflectTitle:"聊聊我的阅读",close:"关闭",
 reflectPrompt:"说说你现在想到的就好。",reflectPlaceholder:"写下你现在想到的……",save:"保存",
 toastRemoved:"已取消",toastWant:"已加入想读",toastRead:"已记录",toastNot:"已记录",toastSaved:"已保存",
 switchRecommendations:"切换推荐",prevRecommendation:"上一条推荐",nextRecommendation:"下一条推荐",
 languageLabel:"切换语言",pageDescription:"Literary Discovery — 从熟悉的作家出发，向三个有意识的方向扩展阅读。"
};
const $=s=>document.querySelector(s);
const esc=s=>(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const palette={
 "the-garden-party":["#c9b68d","#657458","#b88e62"],
 "the-hour-of-the-star":["#c4ad9d","#786d79","#d3bc83"],
 "the-summer-book":["#b7c7c8","#667d78","#d6c7a0"],
 "the-age-of-innocence":["#c7b2a0","#78665c","#cba678"],
 "excellent-women":["#c7bba9","#7d8177","#c6a77e"],
 "passing":["#b8afa6","#5f5d62","#b28c6b"],
 "runaway":["#b7b3a7","#6e7772","#c5a27d"],
 "family-lexicon":["#c8b59b","#85745f","#b8a06e"],
 "pedro-paramo":["#bda58d","#725e4b","#c59163"],
 "the-palm-wine-drinkard":["#b89b75","#6c775c","#cc9b58"],
 "the-memory-police":["#aeb9be","#64727a","#c3aa8b"],
 "gorilla-my-love":["#bf9f85","#735f55","#d0aa6d"],
 "annie-john":["#c4a98a","#6f7f76","#d8b171"],
 "convenience-store-woman":["#b6c4c6","#647980","#d4a7a0"]
};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function ui(){return STATE.lang==="en"?STATE.data.en.ui:ZH}
function localized(group,id,key,fallback){return STATE.lang==="en"?(STATE.data.en[group]?.[id]?.[key]||fallback):fallback}
function bookText(b,key){return localized("books",b.id,key,b[key])}
function writerText(w,key){return localized("writers",w.id,key,w[key])}
function relationText(r){return STATE.lang==="en"?(STATE.data.en.bridges?.[STATE.anchorId]?.[r.book_id]||r.bridge):r.bridge}
function pathLabel(anchor){return STATE.lang==="en"?`From <strong>${esc(anchor)}</strong>`:`从 <strong>${esc(anchor)}</strong> 出发`}
function recommendationLabel(i){return STATE.lang==="en"?`Recommendation ${i+1}`:`第 ${i+1} 条推荐`}
function applyLanguage(){
 const u=ui();document.documentElement.lang=STATE.lang==="en"?"en":"zh-CN";document.title="Literary Discovery";
 const meta=document.querySelector('meta[name="description"]');if(meta)meta.setAttribute("content",u.pageDescription)
}
function setLanguage(lang){
 if(lang!=="zh"&&lang!=="en")return;STATE.lang=lang;const l=load();l.lang=lang;save(l);
 const url=new URL(window.location.href);url.searchParams.set("lang",lang);history.replaceState(null,"",url);applyLanguage();render();window.scrollTo(0,0)
}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove("show"),1400)}
async function boot(){
 const [books,writers,paths,en]=await Promise.all([
  fetch("./data/books.json").then(r=>r.json()),
  fetch("./data/writers.json").then(r=>r.json()),
  fetch("./data/recommendation_paths.json").then(r=>r.json()),
  fetch("./data/en.json").then(r=>r.json())
 ]);
 STATE.data={books:Object.fromEntries(books.map(x=>[x.id,x])),writers:Object.fromEntries(writers.map(x=>[x.id,x])),paths:Object.fromEntries(paths.map(x=>[x.anchor_id,x])),en};
 const l=load(),q=new URLSearchParams(window.location.search).get("lang"),detected=(navigator.language||"").toLowerCase().startsWith("zh")?"zh":"en";
 STATE.lang=q==="zh"||q==="en"?q:(l.lang==="zh"||l.lang==="en"?l.lang:detected);l.lang=STATE.lang;save(l);applyLanguage();
 if(l.anchorId&&STATE.data.paths[l.anchorId]){STATE.anchorId=l.anchorId;STATE.route="home"} render();
}
function languageSwitch(){
 const u=ui();return `<div class="lang-switch" aria-label="${esc(u.languageLabel)}"><button class="lang-option ${STATE.lang==="zh"?"active":""}" aria-pressed="${STATE.lang==="zh"}" onclick="setLanguage('zh')">中</button><span aria-hidden="true">/</span><button class="lang-option ${STATE.lang==="en"?"active":""}" aria-pressed="${STATE.lang==="en"}" onclick="setLanguage('en')">EN</button></div>`
}
function header(active){
 const u=ui();return `<header class="web-header"><button class="brand" onclick="resetAnchor()" aria-label="${esc(u.brandAria)}"><span class="brand-mark" aria-hidden="true"></span>Literary Discovery</button>
 <div class="header-actions"><nav class="desktop-nav"><button class="${active==="home"?"active":""}" onclick="go('home')">${u.home}</button><button class="${active==="library"?"active":""}" onclick="go('library')">${u.library}</button></nav>${languageSwitch()}</div></header>`;
}
function mobileNav(active){const u=ui();return `<nav class="mobile-nav"><button class="${active==="home"?"active":""}" onclick="go('home')">${u.home}</button><button class="${active==="library"?"active":""}" onclick="go('library')">${u.library}</button></nav>`}
function cold(){
 const as=Object.values(STATE.data.paths),u=ui();
 return `<div class="site"><div class="shell">${header("home")}<main class="cold"><div class="eyebrow">${u.coldEyebrow}</div><h1>${u.coldTitle}</h1><p>${u.coldSub}</p><div class="anchor-list">${as.map(a=>`<button class="anchor-choice" onclick="setAnchor('${a.anchor_id}')"><strong>${esc(a.anchor)}</strong><span>${u.startHere}</span></button>`).join("")}</div></main></div></div>`;
}
function setAnchor(id){STATE.anchorId=id;STATE.cardIndex=0;STATE.route="home";const l=load();l.anchorId=id;save(l);render();window.scrollTo(0,0)}
function resetAnchor(){const l=load();delete l.anchorId;save(l);STATE.anchorId=null;STATE.route="cold";render();window.scrollTo(0,0)}
function go(route,extra={}){if(route==="home"&&!STATE.anchorId)route="cold";STATE.lastRoute=STATE.route;STATE.route=route;Object.assign(STATE,extra);render();window.scrollTo(0,0)}
function setCard(i){STATE.cardIndex=i;render();window.scrollTo(0,0)}
function cardControls(){
 const n=STATE.data.paths[STATE.anchorId].recommendations.length,i=STATE.cardIndex,u=ui();
 return `<div class="card-nav" aria-label="${esc(u.switchRecommendations)}"><button class="card-arrow" aria-label="${esc(u.prevRecommendation)}" onclick="setCard(${i-1})" ${i===0?"disabled":""}>‹</button><button class="card-arrow" aria-label="${esc(u.nextRecommendation)}" onclick="setCard(${i+1})" ${i===n-1?"disabled":""}>›</button></div>`;
}
function current(){const p=STATE.data.paths[STATE.anchorId],r=p.recommendations[STATE.cardIndex];return {p,r,b:STATE.data.books[r.book_id]}}
function moodWords(m){return STATE.lang==="en"?m:m.replace(/[，。；]/g," · ").replace(/\s*·\s*/g," · ").replace(/·\s*$/,"")}
function hero(b){
 const p=palette[b.id]||["#b9b1a2","#73776e","#c0a17c"];
 const src=`./assets/heroes/${b.id}.webp`;
 return `<div class="hero" style="--a:${p[0]};--b:${p[1]};--c:${p[2]}"><img class="hero-art" src="${src}" alt="" aria-hidden="true"><div class="hero-title"><h1>${esc(b.title)}</h1>${STATE.lang==="zh"&&b.title_zh?`<div class="zh">《${esc(b.title_zh)}》</div>`:""}<div class="author">${esc(b.writer)}</div></div></div>`;
}
function bookBody(b,bridge,pathline=true){
 const l=load(),status=(l.books||{})[b.id]||null,w=STATE.data.writers[b.writer_id],u=ui();
 return `<main class="home">${pathline?`<div class="pathline"><span>${pathLabel(STATE.data.paths[STATE.anchorId].anchor)}</span><button class="link-btn" onclick="resetAnchor()">${u.chooseWriter}</button></div><div class="dots">${STATE.data.paths[STATE.anchorId].recommendations.map((_,i)=>`<button class="dot ${i===STATE.cardIndex?"active":""}" aria-label="${esc(recommendationLabel(i))}" ${i===STATE.cardIndex?'aria-current="true"':""} onclick="setCard(${i})"></button>`).join("")}</div>`:""}
 ${hero(b)}
 <p class="premise">${esc(bookText(b,"premise"))}</p>
 <section class="judgment-grid">
   <div class="panel"><h2>${u.specialHeading}</h2><p>${esc(bookText(b,"special"))}</p></div>
   ${bridge?`<div class="panel connection"><h2>${u.connectionHeading}</h2><p>${esc(bridge)}</p></div>`:""}
 </section>
 <div class="meta-row"><span class="meta-label">${u.moodLabel}</span><span class="mood-words">${esc(moodWords(bookText(b,"mood")))}</span></div>
 <section class="writer-snapshot" aria-label="${esc(u.writerInfo)}">
   <div class="writer-photo" data-writer="${esc(w.id)}"><img src="${esc(w.image.local_path)}" alt="${esc(w.name)}" loading="lazy"></div>
   <div class="writer-info"><div class="writer-name">${esc(w.name)}</div><div class="writer-meta">${esc(w.years)}${w.place?` · ${esc(w.place)}`:""}</div><div class="writer-context">${esc(writerText(w,"context"))}</div></div>
 </section>
 <div class="actions">
   <button class="action primary ${status==="want"?"selected":""}" onclick="setStatus('${b.id}','want')">${u.want}</button>
   <button class="action secondary ${status==="read"?"selected":""}" onclick="setStatus('${b.id}','read')">${u.read}</button>
   <button class="action tertiary ${status==="not"?"selected":""}" onclick="setStatus('${b.id}','not')">${u.not}</button>
 </div>
 ${pathline?cardControls():""}
 </main>`;
}
function home(){const {r,b}=current();return `<div class="site"><div class="shell">${header("home")}<div id="swipeArea">${bookBody(b,relationText(r),true)}</div>${mobileNav("home")}</div></div>`}
function setStatus(id,s){const l=load(),u=ui();l.books=l.books||{};if(l.books[id]===s){delete l.books[id];toast(u.toastRemoved)}else{l.books[id]=s;toast(s==="want"?u.toastWant:s==="read"?u.toastRead:u.toastNot)}save(l);render()}
function library(){
 const l=load(),statuses=l.books||{},refs=l.reflections||{},u=ui();
 const items=Object.entries(statuses).filter(([,s])=>s==="want"||s==="read");
 return `<div class="site"><div class="shell">${header("library")}<main class="library"><h1 class="page-title">${u.library}</h1>${items.length?items.map(([id,s])=>{const b=STATE.data.books[id];return `<button class="list-card" onclick="go('book',{bookId:'${id}'})"><span class="mini-art"><img src="./assets/heroes/${id}.webp" alt="" aria-hidden="true"></span><span class="list-copy"><strong>${esc(b.title)}</strong><small>${esc(b.writer)} · ${s==="read"?u.statusRead:u.statusWant}</small>${refs[id]?`<div class="reflection-preview">${esc(refs[id].slice(0,90))}${refs[id].length>90?"…":""}</div>`:""}</span></button>`}).join(""):`<div class="empty">${u.empty}</div>`}</main>${mobileNav("library")}</div></div>`;
}
function bookPage(){const b=STATE.data.books[STATE.bookId],u=ui();return `<div class="site"><div class="shell">${header("")}<main class="book-detail"><button class="back" onclick="back()">${u.backLibrary}</button>${bookBody(b,null,false)}<button class="reflection-btn" onclick="openReflection('${b.id}')">${u.reflectButton}</button></main>${mobileNav("")}</div></div>`}
function back(){STATE.route=STATE.lastRoute||"library";render();window.scrollTo(0,0)}
function openReflection(id){
 const l=load(),existing=(l.reflections||{})[id]||"",b=STATE.data.books[id],u=ui();
 document.body.insertAdjacentHTML("beforeend",`<div class="overlay" id="overlay" onclick="if(event.target===this)this.remove()"><div class="modal"><div class="modal-head"><h2>${u.reflectTitle}</h2><button class="close" aria-label="${esc(u.close)}" onclick="$('#overlay').remove()">×</button></div><p>${esc(b.title)} · ${u.reflectPrompt}</p><textarea id="refText" placeholder="${esc(u.reflectPlaceholder)}">${esc(existing)}</textarea><button class="save" onclick="saveReflection('${id}')">${u.save}</button></div></div>`)
}
function saveReflection(id){const t=$("#refText").value.trim(),l=load();l.reflections=l.reflections||{};if(t)l.reflections[id]=t;else delete l.reflections[id];save(l);$("#overlay").remove();toast(ui().toastSaved)}
function attachSwipe(){const el=$("#swipeArea");if(!el)return;let x=null;el.addEventListener("touchstart",e=>x=e.touches[0].clientX,{passive:true});el.addEventListener("touchend",e=>{if(x===null)return;const dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>55){const n=STATE.data.paths[STATE.anchorId].recommendations.length;STATE.cardIndex=dx<0?Math.min(n-1,STATE.cardIndex+1):Math.max(0,STATE.cardIndex-1);render();window.scrollTo(0,0)}x=null},{passive:true})}
function render(){if(!STATE.data)return;let html=STATE.route==="cold"?cold():STATE.route==="home"?home():STATE.route==="library"?library():STATE.route==="book"?bookPage():home();document.getElementById("app").innerHTML=html;attachSwipe()}
boot();
