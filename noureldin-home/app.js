/* NourEldin Home - behaviour
   1. Language switch (EN/AR): every element with data-en / data-ar is swapped.
   2. Pages: the URL hash (#home, #about ...) decides which [data-view] shows.
   3. Side menu, contact form. */
(function(){
  var SHEET_URL=(window.SITE_CONFIG&&window.SITE_CONFIG.sheetUrl)||'';
  var lang='en',btn=document.getElementById('lang'),nav=document.getElementById('nav');
  var arLoaded=false;
  function loadAr(){if(arLoaded)return;arLoaded=true;var k=document.createElement('link');k.rel='stylesheet';k.href='https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500&display=swap';document.head.appendChild(k)}
  function apply(l){
    if(l==='ar')loadAr();
    lang=l;var h=document.documentElement;
    h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-en]').forEach(function(e){var v=e.getAttribute('data-'+l);if(v!==null&&v.trim()!=='')e.textContent=v;});
    btn.textContent=l==='ar'?'English':'عربي';
    document.title=l==='ar'?'نور الدين هوم':'NourEldin Home';
    try{localStorage.setItem('ne-lang',l)}catch(e){}
    if(window.renderAll)window.renderAll();
  }
  btn.addEventListener('click',function(){apply(lang==='en'?'ar':'en')});
  var burger=document.getElementById('burger'),scrim=document.getElementById('scrim');
  function setMenu(o){nav.classList.toggle('open',o);scrim.classList.toggle('on',o);burger.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';}
  burger.addEventListener('click',function(){setMenu(!nav.classList.contains('open'))});
  scrim.addEventListener('click',function(){setMenu(false)});
  document.getElementById('close').addEventListener('click',function(){setMenu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  var s=null;try{s=localStorage.getItem('ne-lang')}catch(e){}
  if(s==='ar')apply('ar');
  document.getElementById('form').addEventListener('submit',function(e){
    e.preventDefault();
    var f=e.target,note=document.getElementById('note'),
    ok=lang==='ar'?'شكرًا لك. سنتواصل معك قريبًا.':'Thank you. We will contact you shortly.',
    bad=lang==='ar'?'تعذّر الإرسال. تواصل معنا عبر واتساب.':'Could not send. Please contact us on WhatsApp.';
    if(!SHEET_URL){note.textContent=ok;f.reset();return;}
    var d={name:f.n.value,phone:f.p.value,type:f.t.value,message:f.m.value,lang:lang,page:location.href};
    fetch(SHEET_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)})
      .then(function(){note.textContent=ok;f.reset();})
      .catch(function(){note.textContent=bad;});
  });
  var names=['cover','home','favorites','services','collections','projects','contact'],
      views=document.querySelectorAll('[data-view]'),block=document.getElementById('contactblock'),links=document.querySelectorAll('nav a');
  function route(){
    var h=location.hash.slice(1);if(names.indexOf(h)<0)h='cover';
    views.forEach(function(v){v.hidden=v.getAttribute('data-view').split(' ').indexOf(h)<0});
    block.hidden=(h==='cover');
    document.body.className=h==='cover'?'is-cover':(h==='services'?'is-green':'');
    var tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',h==='cover'?'#0f1a17':(h==='services'?'#0f1a17':'#f6f1e7'));
    links.forEach(function(a){var tg=a.getAttribute('href');if(tg==='#'+h||(tg==='#cover'&&h==='home'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    setMenu(false);
    window.scrollTo(0,0);
  }
  /* ---- Products and favorites ---- */
  var PRODUCTS=window.PRODUCTS||[],BASE=PRODUCTS.slice(),addOn=!(window.SITE_CONFIG&&window.SITE_CONFIG.showAddButton===false),CATS=window.CATEGORIES||[],favs=[],cat=CATS.length?CATS[0].id:'all',shown=24,
  HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z"/></svg>',
  T={save:{en:'Save to favorites',ar:'أضف إلى المفضلة'},saved:{en:'Remove from favorites',ar:'إزالة من المفضلة'},all:{en:'All',ar:'الكل'},addp:{en:'Add a piece',ar:'إضافة قطعة'},bad:{en:'Please write a name and choose a category.',ar:'اكتب اسم القطعة واختر القسم.'},fail:{en:'Could not save on this device.',ar:'تعذّر الحفظ على هذا الجهاز.'},del:{en:'Delete this piece?',ar:'حذف هذه القطعة؟'},more:{en:'Show more',ar:'عرض المزيد'},msg:{en:'I am interested in: ',ar:'أنا مهتم بالقطع التالية: '}};
  try{favs=JSON.parse(localStorage.getItem('ne-favs')||'[]')}catch(e){favs=[]}
  function t(k){return T[k][lang]}
  function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function catName(id){for(var i=0;i<CATS.length;i++)if(CATS[i].id===id)return CATS[i][lang];return ''}
  function card(p,i){
    var on=favs.indexOf(p.id)>-1,
    src=p.img||(p.imgs&&p.imgs[0])||'',
    im=src?'<img src="'+esc(src)+'" decoding="async" alt="'+esc(p[lang])+'" loading="lazy">':'<div class="ph '+['','b','c'][i%3]+'"></div>';
    return '<article class="pc" data-id="'+esc(p.id)+'"><div class="pimg" data-open>'+im+'<button class="heart" type="button" data-id="'+esc(p.id)+'" aria-pressed="'+on+'" aria-label="'+esc(on?t('saved'):t('save'))+'">'+HEART+'</button></div><h3><button type="button" class="pname" data-open>'+esc(p[lang])+'</button></h3><p>'+esc(catName(p.cat))+'</p>'+(p['desc_'+lang]?'<p class="pdesc">'+esc(p['desc_'+lang])+'</p>':'')+'</article>';
  }
  function renderShop(){
    var c=document.getElementById('chips'),g=document.getElementById('shop');if(!c||!g)return;
    var s='';
    CATS.forEach(function(k){s+='<button type="button" class="chip'+(cat===k.id?' on':'')+'" data-cat="'+k.id+'">'+esc(k[lang])+'</button>'});
    c.innerHTML=s;
    var list=PRODUCTS.filter(function(p){return cat==='all'||p.cat===cat}),m=document.getElementById('more');
    g.innerHTML=list.slice(0,shown).map(card).join('')+(addOn?'<button type="button" class="addtile" id="addbtn" aria-label="'+esc(t('addp'))+'"><i>+</i><span>'+esc(t('addp'))+'</span></button>':'');
    if(m){m.hidden=list.length<=shown;m.textContent=t('more')}
  }
  function renderFavs(){
    var items=PRODUCTS.filter(function(p){return favs.indexOf(p.id)>-1});
    document.getElementById('favgrid').innerHTML=items.map(card).join('');
    document.getElementById('favempty').hidden=items.length>0;
    document.getElementById('favquote').hidden=items.length===0;
  }
  function renderCount(){
    var n=document.getElementById('favcount');n.textContent=favs.length;n.hidden=!favs.length;
    document.querySelector('.fav').setAttribute('aria-label',lang==='ar'?'المفضلة':'Favorites');
  }
  window.renderAll=function(){renderShop();renderFavs();renderCount()};
  document.addEventListener('click',function(e){
    var b=e.target.closest('.heart'),c=e.target.closest('.chip');
    if(b){
      var id=b.getAttribute('data-id'),i=favs.indexOf(id);
      if(i>-1)favs.splice(i,1);else favs.push(id);
      try{localStorage.setItem('ne-favs',JSON.stringify(favs))}catch(x){}
      var on=favs.indexOf(id)>-1;
      document.querySelectorAll('.heart').forEach(function(x){
        if(x.getAttribute('data-id')!==id)return;
        x.setAttribute('aria-pressed',on);x.setAttribute('aria-label',on?t('saved'):t('save'));
        if(on){x.classList.remove('pop');void x.offsetWidth;x.classList.add('pop')}
      });
      renderCount();renderFavs();return;
    }
    if(e.target.closest('#more')){shown+=24;renderShop();return}
    if(c){cat=c.getAttribute('data-cat');shown=24;renderShop();return}
    if(e.target.closest('#favquote')){
      var names=PRODUCTS.filter(function(p){return favs.indexOf(p.id)>-1}).map(function(p){return p[lang]+' ('+catName(p.cat)+')'});
      document.querySelector('#form [name=m]').value=t('msg')+names.join(', ');
      location.hash='#contact';
    }
  });
  window.renderAll();
  /* ---- "+" add pieces: saved in this browser (IndexedDB) ---- */
  var DB=null,files=[],curImgs=[];
  function $(i){return document.getElementById(i)}
  function db(){return new Promise(function(ok,no){if(DB)return ok(DB);if(!window.indexedDB)return no();var r=indexedDB.open('ne-db',1);r.onupgradeneeded=function(){r.result.createObjectStore('products',{keyPath:'id'})};r.onsuccess=function(){DB=r.result;ok(DB)};r.onerror=no})}
  function dbDo(mode,fn){return db().then(function(d){return new Promise(function(ok,no){var q=fn(d.transaction('products',mode).objectStore('products'));q.onsuccess=function(){ok(q.result||[])};q.onerror=no})})}
  function loadAdded(){dbDo('readonly',function(s){return s.getAll()}).then(function(a){a.sort(function(x,y){return y.at-x.at});PRODUCTS=a.concat(BASE);window.renderAll()}).catch(function(){})}
  function shrink(file){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,1600/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);res(cv.toDataURL('image/jpeg',.88))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
  function drawThumbs(){$('thumbs').innerHTML=files.map(function(s,i){return '<button type="button" data-rm="'+i+'" aria-label="Remove"><img src="'+s+'" alt=""></button>'}).join('')}
  function findP(id){return PRODUCTS.filter(function(x){return x.id===id})[0]}
  function openDetail(id){
    var p=findP(id),d=$('detail');if(!p||!d)return;
    curImgs=(p.imgs&&p.imgs.length)?p.imgs:(p.img?[p.img]:[]);
    var m=$('dimg');m.hidden=!curImgs.length;$('dph').hidden=!!curImgs.length;if(curImgs.length)m.src=curImgs[0];
    $('dthumbs').innerHTML=curImgs.length>1?curImgs.map(function(s,i){return '<button type="button" class="dth" data-i="'+i+'"><img src="'+s+'" alt=""></button>'}).join(''):'';
    $('dname').textContent=p[lang];$('dcat').textContent=catName(p.cat);$('ddesc').textContent=p['desc_'+lang]||'';
    $('ddel').hidden=!p.local;d.setAttribute('data-id',id);d.showModal();
  }
  if($('addbox')){
    $('afile').addEventListener('change',function(e){
      var list=Array.prototype.slice.call(e.target.files).slice(0,6-files.length);
      Promise.all(list.map(shrink)).then(function(r){files=files.concat(r).slice(0,6);drawThumbs()}).catch(function(){});
      e.target.value='';
    });
    $('addform').addEventListener('submit',function(e){
      e.preventDefault();var f=e.target,en=f.nen.value.trim(),ar=f.nar.value.trim(),de=f.den.value.trim(),da=f.dar.value.trim();
      if(!(en||ar)||!f.acat.value){$('anote').textContent=t('bad');return}
      var p={id:'u-'+Date.now(),at:Date.now(),local:true,cat:f.acat.value,en:en||ar,ar:ar||en,desc_en:de||da,desc_ar:da||de,imgs:files.slice(),img:files[0]||''};
      dbDo('readwrite',function(s){return s.put(p)}).then(function(){cat=p.cat;shown=24;$('addbox').close();loadAdded()}).catch(function(){$('anote').textContent=t('fail')});
    });
    document.addEventListener('click',function(e){
      if(e.target.closest('.heart'))return;
      if(e.target.closest('#addbtn')){
        $('acat').innerHTML=CATS.map(function(k){return '<option value="'+k.id+'">'+esc(k[lang])+'</option>'}).join('');
        $('addform').reset();$('acat').value=cat;files=[];drawThumbs();$('anote').textContent='';$('addbox').showModal();return;
      }
      var rm=e.target.closest('[data-rm]');if(rm){files.splice(+rm.getAttribute('data-rm'),1);drawThumbs();return}
      var th=e.target.closest('.dth');if(th){$('dimg').src=curImgs[+th.getAttribute('data-i')];return}
      var op=e.target.closest('[data-open]');if(op){var c=op.closest('.pc');if(c)openDetail(c.getAttribute('data-id'));return}
      var cl=e.target.closest('[data-close]');if(cl){cl.closest('dialog').close();return}
      if(e.target.id==='detail'){e.target.close();return}
      if(e.target.closest('#ddel')){var id=$('detail').getAttribute('data-id');if(confirm(t('del')))dbDo('readwrite',function(s){return s.delete(id)}).then(function(){$('detail').close();loadAdded()});return}
      if(e.target.closest('#dquote')){var p=findP($('detail').getAttribute('data-id'));if(p){document.querySelector('#form [name=m]').value=t('msg')+p[lang]+' ('+catName(p.cat)+')'}$('detail').close();location.hash='#contact';return}
      if(e.target.closest('#aexport')){dbDo('readonly',function(s){return s.getAll()}).then(function(a){var l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(a)],{type:'application/json'}));l.download='noureldin-added-pieces.json';l.click()});}
    });
    loadAdded();
  }
  /* Logo: on the Home page it goes back to the Cover; on every other page (Cover, Services, Collections, Projects, Favorites, Contact) it goes to Home */
  document.querySelectorAll('.logo,.flogo').forEach(function(a){a.addEventListener('click',function(e){
    e.preventDefault();
    location.hash=(location.hash==='#home')?'#cover':'#home';
  })});
  window.addEventListener('hashchange',route);route();
})();

