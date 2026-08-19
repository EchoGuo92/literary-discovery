
const STATE={data:null,route:"cold",anchorId:null,cardIndex:0,lastRoute:null,bookId:null};
const KEY="literary-discovery-rc-0.9";
const $=s=>document.querySelector(s);
const esc=s=>(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const initials=name=>name.split(/\s+/).map(x=>x[0]).slice(0,2).join("");
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
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(window.__t);window.__t=setTimeout(()=>el.classList.remove("show"),1400)}
async function boot(){
 const [books,writers,paths]=await Promise.all([
  fetch("./data/books.json").then(r=>r.json()),
  fetch("./data/writers.json").then(r=>r.json()),
  fetch("./data/recommendation_paths.json").then(r=>r.json())
 ]);
 STATE.data={books:Object.fromEntries(books.map(x=>[x.id,x])),writers:Object.fromEntries(writers.map(x=>[x.id,x])),paths:Object.fromEntries(paths.map(x=>[x.anchor_id,x]))};
 const l=load(); if(l.anchorId&&STATE.data.paths[l.anchorId]){STATE.anchorId=l.anchorId;STATE.route="home"} render();
}
function header(active){
 return `<header class="web-header"><div class="brand"><span class="brand-mark"></span>Literary Discovery</div>
 <nav class="desktop-nav"><button class="${active==="home"?"active":""}" onclick="go('home')">Home</button><button class="${active==="library"?"active":""}" onclick="go('library')">Library</button></nav></header>`;
}
function mobileNav(active){return `<nav class="mobile-nav"><button class="${active==="home"?"active":""}" onclick="go('home')">Home</button><button class="${active==="library"?"active":""}" onclick="go('library')">Library</button></nav>`}
function cold(){
 const as=Object.values(STATE.data.paths);
 return `<div class="site"><div class="shell">${header("")}<main class="cold"><div class="eyebrow">Familiar entry · deliberate expansion</div><h1>最近想到哪些书或作家？</h1><p>从一个你已经想到的作家开始。</p><div class="anchor-list">${as.map(a=>`<button class="anchor-choice" onclick="setAnchor('${a.anchor_id}')"><strong>${esc(a.anchor)}</strong><span>从这里开始 →</span></button>`).join("")}</div></main></div></div>`;
}
function setAnchor(id){STATE.anchorId=id;STATE.cardIndex=0;STATE.route="home";const l=load();l.anchorId=id;save(l);render();window.scrollTo(0,0)}
function resetAnchor(){const l=load();delete l.anchorId;save(l);STATE.anchorId=null;STATE.route="cold";render();window.scrollTo(0,0)}
function go(route,extra={}){STATE.lastRoute=STATE.route;STATE.route=route;Object.assign(STATE,extra);render();window.scrollTo(0,0)}
function setCard(i){STATE.cardIndex=i;render();window.scrollTo(0,0)}
function current(){const p=STATE.data.paths[STATE.anchorId],r=p.recommendations[STATE.cardIndex];return {p,r,b:STATE.data.books[r.book_id]}}
function moodWords(m){return m.replace(/[，。；]/g," · ").replace(/\s*·\s*/g," · ").replace(/·\s*$/,"")}
function hero(b){
 const p=palette[b.id]||["#b9b1a2","#73776e","#c0a17c"];
 const src=`./assets/heroes/${b.id}.webp`;
 return `<div class="hero" style="--a:${p[0]};--b:${p[1]};--c:${p[2]}"><img class="hero-art" src="${src}" alt="" aria-hidden="true"><div class="hero-title"><h1>${esc(b.title)}</h1>${b.title_zh?`<div class="zh">《${esc(b.title_zh)}》</div>`:""}<div class="author">${esc(b.writer)}</div></div></div>`;
}
function bookBody(b,bridge,pathline=true){
 const l=load(),status=(l.books||{})[b.id]||null,w=STATE.data.writers[b.writer_id];
 return `<main class="home">${pathline?`<div class="pathline"><span>从 <strong>${esc(STATE.data.paths[STATE.anchorId].anchor)}</strong> 出发</span><button class="link-btn" onclick="resetAnchor()">换一个入口</button></div><div class="dots">${STATE.data.paths[STATE.anchorId].recommendations.map((_,i)=>`<button class="dot ${i===STATE.cardIndex?"active":""}" aria-label="Recommendation ${i+1}" onclick="setCard(${i})"></button>`).join("")}</div>`:""}
 ${hero(b)}
 <p class="premise">${esc(b.premise)}</p>
 <section class="judgment-grid">
   <div class="panel"><h2>这本书有什么特别</h2><p>${esc(b.special)}</p></div>
   ${bridge?`<div class="panel connection"><h2>与你的联系</h2><p>${esc(bridge)}</p></div>`:""}
 </section>
 <div class="meta-row"><span class="meta-label">Reading Mood</span><span class="mood-words">${esc(moodWords(b.mood))}</span></div>
 <section class="writer-snapshot" aria-label="Writer information">
   <div class="writer-photo" data-writer="${esc(w.id)}"><img src="${esc(w.image.local_path)}" alt="${esc(w.name)}" loading="lazy"></div>
   <div class="writer-info"><div class="writer-name">${esc(w.name)}</div><div class="writer-meta">${esc(w.years)}${w.place?` · ${esc(w.place)}`:""}</div><div class="writer-context">${esc(w.context)}</div></div>
 </section>
 <div class="actions">
   <button class="action primary ${status==="want"?"selected":""}" onclick="setStatus('${b.id}','want')">想读</button>
   <button class="action secondary ${status==="read"?"selected":""}" onclick="setStatus('${b.id}','read')">我读过</button>
   <button class="action tertiary ${status==="not"?"selected":""}" onclick="setStatus('${b.id}','not')">不太感兴趣</button>
 </div>
 </main>`;
}
function home(){const {p,r,b}=current();return `<div class="site"><div class="shell">${header("home")}<div id="swipeArea">${bookBody(b,r.bridge,true)}</div>${mobileNav("home")}</div></div>`}
function setStatus(id,s){const l=load();l.books=l.books||{};if(l.books[id]===s){delete l.books[id];toast("已取消")}else{l.books[id]=s;toast(s==="want"?"已加入想读":s==="read"?"已记录":"已记录")}save(l);render()}
function library(){
 const l=load(),statuses=l.books||{},refs=l.reflections||{};
 const items=Object.entries(statuses).filter(([,s])=>s==="want"||s==="read");
 return `<div class="site"><div class="shell">${header("library")}<main class="library"><h1 class="page-title">Library</h1>${items.length?items.map(([id,s])=>{const b=STATE.data.books[id];return `<button class="list-card" onclick="go('book',{bookId:'${id}'})"><span class="mini-art"><img src="./assets/heroes/${id}.webp" alt="" aria-hidden="true"></span><span class="list-copy"><strong>${esc(b.title)}</strong><small>${esc(b.writer)} · ${s==="read"?"已读":"想读"}</small>${refs[id]?`<div class="reflection-preview">${esc(refs[id].slice(0,90))}${refs[id].length>90?"…":""}</div>`:""}</span></button>`}).join(""):`<div class="empty">还没有留下任何书。Home 里的“想读”和“我读过”会把书带到这里。</div>`}</main>${mobileNav("library")}</div></div>`;
}
function bookPage(){const b=STATE.data.books[STATE.bookId];return `<div class="site"><div class="shell">${header("")}<main class="book-detail"><button class="back" onclick="back()">← 返回 Library</button>${bookBody(b,null,false)}<button class="reflection-btn" onclick="openReflection('${b.id}')">聊聊这本书</button></main>${mobileNav("")}</div></div>`}
function back(){STATE.route=STATE.lastRoute||"library";render();window.scrollTo(0,0)}
function openReflection(id){
 const l=load(),existing=(l.reflections||{})[id]||"",b=STATE.data.books[id];
 document.body.insertAdjacentHTML("beforeend",`<div class="overlay" id="overlay" onclick="if(event.target===this)this.remove()"><div class="modal"><div class="modal-head"><h2>聊聊我的阅读</h2><button class="close" onclick="$('#overlay').remove()">×</button></div><p>${esc(b.title)} · 说说你现在想到的就好。</p><textarea id="refText" placeholder="写下你现在想到的……">${esc(existing)}</textarea><button class="save" onclick="saveReflection('${id}')">保存</button></div></div>`)
}
function saveReflection(id){const t=$("#refText").value.trim(),l=load();l.reflections=l.reflections||{};if(t)l.reflections[id]=t;else delete l.reflections[id];save(l);$("#overlay").remove();toast("已保存")}
function attachSwipe(){const el=$("#swipeArea");if(!el)return;let x=null;el.addEventListener("touchstart",e=>x=e.touches[0].clientX,{passive:true});el.addEventListener("touchend",e=>{if(x===null)return;const dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>55){const n=STATE.data.paths[STATE.anchorId].recommendations.length;STATE.cardIndex=dx<0?Math.min(n-1,STATE.cardIndex+1):Math.max(0,STATE.cardIndex-1);render();window.scrollTo(0,0)}x=null},{passive:true})}
function render(){if(!STATE.data)return;let html=STATE.route==="cold"?cold():STATE.route==="home"?home():STATE.route==="library"?library():STATE.route==="book"?bookPage():home();document.getElementById("app").innerHTML=html;attachSwipe()}
boot();
