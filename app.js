/* NourEldin Home - behaviour
   1. Language switch (EN/AR): every element with data-en / data-ar is swapped.
   2. Pages: the URL hash (#home, #about ...) decides which [data-view] shows.
   3. Side menu, contact form. */
(function(){
  var SHEET_URL=(window.SITE_CONFIG&&window.SITE_CONFIG.sheetUrl)||'',WA_NUM=String((window.SITE_CONFIG&&window.SITE_CONFIG.whatsappNumber)||'').replace(/\D/g,'');
  if(WA_NUM){document.querySelectorAll('.soc a[aria-label=WhatsApp],.wafloat').forEach(function(x){x.href='https://wa.me/'+WA_NUM})}
  var lang='en',btn=document.getElementById('lang'),nav=document.getElementById('nav');
  var arLoaded=false;
  function loadAr(){if(arLoaded)return;arLoaded=true;var k=document.createElement('link');k.rel='stylesheet';k.href='https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500&display=swap';document.head.appendChild(k)}
  function apply(l){
    if(l==='ar')loadAr();
    lang=l;var h=document.documentElement;
    h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-en]').forEach(function(e){var v=e.getAttribute('data-'+l);if(v!==null&&v.trim()!=='')e.textContent=v;});
    btn.textContent=l==='ar'?'English':'عربي';
    [['.logo','NourEldin Home','نور الدين هوم'],['.flogo','NourEldin Home','نور الدين هوم'],['#nav','Main','القائمة الرئيسية'],['#close','Close menu','إغلاق القائمة'],['#lang','Switch language','تغيير اللغة'],['#burger','Menu','القائمة'],['.cover .photo','Living room by NourEldin Home','غرفة معيشة من نور الدين هوم'],['.arch .ph','Living room','غرفة معيشة'],['.soc a[aria-label=Instagram]','Instagram','إنستجرام'],['.soc a[aria-label=Facebook]','Facebook','فيسبوك'],['.soc a[aria-label=WhatsApp]','WhatsApp','واتساب'],['.wafloat','WhatsApp','واتساب'],['.soc a[aria-label=TikTok]','TikTok','تيك توك'],['.dclose','Close','إغلاق'],['#wood-modal-close','Close photo','إغلاق الصورة'],['#wood-prev','Previous photo','الصورة السابقة'],['#wood-next','Next photo','الصورة التالية'],['#cue','Scroll down','مرر للأسفل']].forEach(function(a){document.querySelectorAll(a[0]).forEach(function(e){e.setAttribute('aria-label',l==='ar'?a[2]:a[1])})});
    document.querySelectorAll('.hero-n,.aimg').forEach(function(e){if(!e.dataset.alt)e.dataset.alt=e.alt;if(e.classList.contains('hero-n'))e.alt=l==='ar'?'نور الدين هوم':e.dataset.alt});
    var md=document.querySelector('meta[name=description]');if(md){if(!md.dataset.en)md.dataset.en=md.content;md.content=l==='ar'?'نور الدين هوم - بيوت متكاملة من الألف إلى الياء. أثاث وتصميم وتشطيب وتسليم.':md.dataset.en}
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
    var d={name:f.n.value,phone:f.p.value,type:f.t.value,message:f.m.value,lang:lang,page:location.href};
    if(!SHEET_URL&&!WA_NUM){note.textContent=ok;f.reset();return;}
    var pending=null;
    if(SHEET_URL){
      pending=fetch(SHEET_URL,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)});
    }
    if(WA_NUM){
      var txt='NourEldin Home\n'+(lang==='ar'?'الاسم: ':'Name: ')+d.name+'\n'+(lang==='ar'?'الهاتف: ':'Phone: ')+d.phone+'\n'+(lang==='ar'?'نوع المشروع: ':'Project: ')+d.type+(d.message?'\n'+(lang==='ar'?'التفاصيل: ':'Details: ')+d.message:'');
      var w=window.open('https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(txt),'_blank');
      if(!w)location.href='https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(txt);
    }
    if(!pending){note.textContent=ok;f.reset();return;}
    pending.then(function(){note.textContent=ok;f.reset();}).catch(function(){note.textContent=WA_NUM?ok:bad;});
  });
  var names=['cover','home','services','collections','wood-carpentry','projects','contact'],
      views=document.querySelectorAll('[data-view]'),block=document.getElementById('contactblock'),links=document.querySelectorAll('nav a');
  function onScroll(){var b=document.body;if(!b.classList.contains('lp'))return;var c=document.querySelector('.cover'),lim=Math.max(120,(c?c.offsetHeight:600)-90);b.classList.toggle('at-top',window.scrollY<lim)}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  var cue=document.getElementById('cue');if(cue)cue.addEventListener('click',function(){var c=document.querySelector('.cover');window.scrollTo({top:c?c.offsetHeight:window.innerHeight,behavior:'smooth'})});
  function route(){
    var h=location.hash.slice(1);if(names.indexOf(h)<0)h='cover';
    var show=h==='cover'?['cover','home']:[h];
    views.forEach(function(v){v.hidden=!v.getAttribute('data-view').split(' ').some(function(x){return show.indexOf(x)>-1})});
    block.hidden=false;
    document.body.className=h==='cover'?'lp at-top':((h==='services'||h==='projects')?'is-green':'');
    onScroll();
    var tc=document.querySelector('meta[name=theme-color]');if(tc)tc.setAttribute('content',h==='cover'?'#0f1a17':(h==='services'?'#0f1a17':'#f6f1e7'));
    links.forEach(function(a){var tg=a.getAttribute('href');if(tg==='#'+h||(tg==='#cover'&&h==='home'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    setMenu(false);
    window.scrollTo(0,0);
  }
  /* ---- Products: search, filter, sort ---- */
  var PV=(window.SITE_CONFIG&&window.SITE_CONFIG.previewIds)||[],PRODUCTS=(window.PRODUCTS||[]).filter(function(p){return !PV.length||PV.indexOf(p.id)>-1}),BASE=PRODUCTS.slice(),addOn=!(window.SITE_CONFIG&&window.SITE_CONFIG.showAddButton===false),CATS=window.CATEGORIES||[],STY=window.STYLES||[],TYP=window.TYPES||[],
  cat='all',sty='all',typ='all',sort='feat',qs='',shown=99999,
  SORTS=[['feat','Featured','الترتيب الافتراضي'],['az','Name A–Z','الاسم أ–ي'],['za','Name Z–A','الاسم ي–أ'],['wa','Width: small to large','العرض: من الأصغر للأكبر'],['wd','Width: large to small','العرض: من الأكبر للأصغر']],
  T={all:{en:'All',ar:'الكل'},alltypes:{en:'All types',ar:'كل الأنواع'},ph:{en:'Search by name, size, material…',ar:'ابحث بالاسم أو المقاس أو الخامة…'},addp:{en:'Add a piece',ar:'إضافة قطعة'},bad:{en:'Please write a name and choose a category.',ar:'اكتب اسم القطعة واختر القسم.'},fail:{en:'Could not save on this device.',ar:'تعذّر الحفظ على هذا الجهاز.'},del:{en:'Delete this piece?',ar:'حذف هذه القطعة؟'},more:{en:'Show more',ar:'عرض المزيد'},msg:{en:'I am interested in: ',ar:'أنا مهتم بالقطع التالية: '}};
  function t(k){return T[k][lang]}
  function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function $(i){return document.getElementById(i)}
  function lab(L,id,l){for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i][l||lang];return ''}
  function catName(id){return lab(CATS,id)}
  function used(key){var m={};PRODUCTS.forEach(function(p){if(p[key])m[p[key]]=1});return m}
  function meta(p){var a=[];if(Object.keys(used('cat')).length>1||!p.style)a.push(catName(p.cat));var s=lab(STY,p.style),k=lab(TYP,p.kind);if(s)a.push(s);if(k)a.push(k);return a.join(' · ')}
  /* search text: lower case, no accents or Arabic marks, Arabic letter variants unified */
  function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})}
  function hay(p){return p._h||(p._h=norm([p.en,p.ar,p.desc_en,p.desc_ar,lab(CATS,p.cat,'en'),lab(CATS,p.cat,'ar'),lab(STY,p.style,'en'),lab(STY,p.style,'ar'),lab(TYP,p.kind,'en'),lab(TYP,p.kind,'ar')].join(' ')))}
  function card(p,i){
    var src=p.img||(p.imgs&&p.imgs[0])||'',
    im=src?'<img src="'+esc(src)+'" decoding="async" alt="'+esc(p[lang])+'" loading="lazy">':'<div class="ph '+['','b','c'][i%3]+'"></div>';
    return '<article class="pc" data-id="'+esc(p.id)+'"><div class="pimg" data-open>'+im+'</div><h3><button type="button" class="pname" data-open>'+esc(p[lang])+'</button></h3><p>'+esc(meta(p))+'</p>'+(p['desc_'+lang]?'<p class="pdesc">'+esc(p['desc_'+lang])+'</p>':'')+'</article>';
  }
  function result(){
    var w=norm(qs).split(/\s+/).filter(Boolean);
    var a=PRODUCTS.map(function(p,i){return{p:p,i:i}}).filter(function(o){var p=o.p;
      if(cat!=='all'&&p.cat!==cat)return false;if(sty!=='all'&&p.style!==sty)return false;if(typ!=='all'&&p.kind!==typ)return false;
      var h=hay(p);return w.every(function(x){return h.indexOf(x)>-1})});
    function wv(o,d){return o.p.w||(d>0?1e9:-1)}
    var by={feat:function(x,y){return x.i-y.i},
      az:function(x,y){return String(x.p[lang]).localeCompare(String(y.p[lang]),lang)||x.i-y.i},
      za:function(x,y){return String(y.p[lang]).localeCompare(String(x.p[lang]),lang)||x.i-y.i},
      wa:function(x,y){return wv(x,1)-wv(y,1)||x.i-y.i},
      wd:function(x,y){return wv(y,-1)-wv(x,-1)||x.i-y.i}};
    return a.sort(by[sort]||by.feat).map(function(o){return o.p});
  }
  function chipRow(el,key,items,cur){
    var s='';if(items.length>1){if(key!=='style')s='<button type="button" class="chip'+(cur==='all'?' on':'')+'" data-f="'+key+'" data-v="all">'+esc(t('all'))+'</button>';
    items.forEach(function(k){s+='<button type="button" class="chip'+(cur===k.id?' on':'')+'" data-f="'+key+'" data-v="'+k.id+'">'+esc(k[lang])+'</button>'})}
    el.innerHTML=s;
  }
  function renderShop(){
    var q=$('q'),g=$('shop');if(!q||!g)return;
    var uc=used('cat'),us=used('style'),ut=used('kind');
    chipRow($('chips'),'cat',CATS.filter(function(k){return uc[k.id]}),cat);
    chipRow($('schips'),'style',STY.filter(function(k){return us[k.id]}),sty);
    $('ftype').innerHTML='<option value="all">'+esc(t('alltypes'))+'</option>'+TYP.filter(function(k){return ut[k.id]}).map(function(k){return '<option value="'+k.id+'">'+esc(k[lang])+'</option>'}).join('');
    $('ftype').value=typ;$('ftype').parentNode.hidden=Object.keys(ut).length<2;
    $('fsort').innerHTML=SORTS.map(function(o){return '<option value="'+o[0]+'">'+esc(lang==='ar'?o[2]:o[1])+'</option>'}).join('');
    $('fsort').value=sort;
    q.placeholder=t('ph');q.setAttribute('aria-label',t('ph'));
    renderGrid();
  }
  function renderGrid(){
    var g=$('shop'),m=$('more'),list=result(),n=list.length,all=PRODUCTS.length,f=qs.trim()||cat!=='all'||sty!=='all'||typ!=='all';
    g.innerHTML=list.slice(0,shown).map(card).join('')+(addOn?'<button type="button" class="addtile" id="addbtn" aria-label="'+esc(t('addp'))+'"><i>+</i><span>'+esc(t('addp'))+'</span></button>':'');
    if(m){m.hidden=n<=shown;m.textContent=t('more')}
    $('noresult').hidden=n>0;$('fclear').hidden=!f;
    $('rcount').textContent=lang==='ar'?(f?n+' من '+all+' قطعة':all+' قطعة'):(f?n+' of '+all+' pieces':all+(all===1?' piece':' pieces'));
  }
  function clearAll(){cat=sty=typ='all';qs='';$('q').value='';shown=99999;renderShop()}
  var woodIndex=0,woodDialog=$('wood-modal');
  function woodNumber(i){var n=String(i+1).padStart(2,'0');return lang==='ar'?'رقم '+n:'No. '+n}
  function openWood(i){
    woodIndex=(i+44)%44;var n=String(woodIndex+1).padStart(2,'0');
    $('wood-full').src='images/wood-carpentry/full/wood-'+n+'.webp';
    $('wood-full').alt=lang==='ar'?'صورة نجارة خشبية رقم '+n:'Wood carpentry photo '+n;
    $('wood-count').textContent=n+' / 44';
    $('wood-modal-title').textContent=(lang==='ar'?'النجارة الخشبية — ':'Wood Carpentry — ')+woodNumber(woodIndex);
    if(!woodDialog.open)woodDialog.showModal();
  }
  function renderWood(){
    var g=$('wood-grid');if(!g)return;
    var cards='';
    for(var i=1;i<=44;i++){
      var n=String(i).padStart(2,'0'),label=woodNumber(i-1),aria=lang==='ar'?'عرض صورة النجارة '+n:'View woodwork photo '+n;
      cards+='<button type="button" class="wood-card" data-wood-index="'+(i-1)+'" aria-label="'+aria+'"><img src="images/wood-carpentry/wood-'+n+'.webp" alt="" loading="lazy" decoding="async"><span class="wood-card-number">'+label+'</span></button>';
    }
    g.innerHTML=cards;
  }
  window.renderAll=function(){renderShop();renderWood()};
  document.addEventListener('click',function(e){
    var woodCard=e.target.closest('[data-wood-index]');
    if(woodCard){openWood(+woodCard.getAttribute('data-wood-index'));return}
    if(e.target.closest('#wood-prev')){openWood(woodIndex-1);return}
    if(e.target.closest('#wood-next')){openWood(woodIndex+1);return}
    if(e.target.closest('#wood-modal-close')){woodDialog.close();return}
    if(e.target===woodDialog){woodDialog.close();return}
    var c=e.target.closest('.chip');
    if(c){var k=c.getAttribute('data-f'),v=c.getAttribute('data-v');if(k==='cat')cat=v;else sty=(sty===v?'all':v);shown=99999;renderShop();return}
    if(e.target.closest('#more')){shown+=99999;renderGrid();return}
    if(e.target.closest('#fclear,#noclear')){clearAll()}
  });
  $('q').addEventListener('input',function(e){qs=e.target.value;shown=99999;renderGrid()});
  $('ftype').addEventListener('change',function(e){typ=e.target.value;shown=99999;renderGrid()});
  $('fsort').addEventListener('change',function(e){sort=e.target.value;shown=99999;renderGrid()});
  document.addEventListener('keydown',function(e){if(!woodDialog.open)return;if(e.key==='ArrowRight')openWood(woodIndex+(document.documentElement.dir==='rtl'?-1:1));if(e.key==='ArrowLeft')openWood(woodIndex+(document.documentElement.dir==='rtl'?1:-1))});
  window.renderAll();
  /* ---- "+" add pieces: saved in this browser (IndexedDB) ---- */
  var DB=null,files=[],curImgs=[];
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
    $('dname').textContent=p[lang];$('dcat').textContent=meta(p);$('ddesc').textContent=p['desc_'+lang]||'';
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
      dbDo('readwrite',function(s){return s.put(p)}).then(function(){cat=p.cat;sty=typ='all';qs='';$('q').value='';shown=99999;$('addbox').close();loadAdded()}).catch(function(){$('anote').textContent=t('fail')});
    });
    document.addEventListener('click',function(e){
      if(e.target.closest('#addbtn')){
        $('acat').innerHTML=CATS.map(function(k){return '<option value="'+k.id+'">'+esc(k[lang])+'</option>'}).join('');
        $('addform').reset();$('acat').value=cat==='all'?CATS[0].id:cat;files=[];drawThumbs();$('anote').textContent='';$('addbox').showModal();return;
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

