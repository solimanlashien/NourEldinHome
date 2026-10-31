/* Projects page: one editorial panel per residence; tap to open its photo + video gallery.
   Media lives in images/projects/pN/ (01.webp, t01.webp ..., c.webp cover, v1.mp4, v1.jpg). */
(function(){
  var P=[
    {n:1,imgs:6,vids:0,en:"Doha",ar:"الدوحة",cEn:"",cAr:""},
    {n:2,imgs:27,vids:0,en:"Mivida",ar:"ميفيدا",cEn:"New Cairo",cAr:"القاهرة الجديدة"},
    {n:3,imgs:27,vids:0,en:"Mountain View",ar:"ماونتن فيو",cEn:"New Cairo",cAr:"القاهرة الجديدة"},
    {n:4,imgs:13,vids:0,en:"Madinaty",ar:"مدينتي",cEn:"New Cairo",cAr:"القاهرة الجديدة"},
    {n:5,imgs:13,vids:0,en:"Swan Lake",ar:"سوان ليك",cEn:"New Cairo",cAr:"القاهرة الجديدة"},
    {n:9,imgs:19,vids:1,en:"Diplo",ar:"ديبلو",cEn:"North Coast",cAr:"الساحل الشمالي"},
    {n:6,imgs:22,vids:5,en:"New Giza",ar:"نيو جيزة",cEn:"",cAr:""},
    {n:7,imgs:33,vids:6,en:"Palm Hills",ar:"بالم هيلز",cEn:"Giza",cAr:"الجيزة"},
    {n:8,imgs:8,vids:2,en:"Ora",ar:"أورا",cEn:"Giza",cAr:"الجيزة"},
    {n:10,imgs:10,vids:2,en:"Katameya Residence",ar:"القطامية ريزيدنس",cEn:"New Cairo",cAr:"القاهرة الجديدة"}
  ];
  window.PROJECTS=P;
  var $=function(i){return document.getElementById(i)},grid=$('pgrid'),dlg=$('pgal'),nav=$('pnav');
  if(!grid||!dlg)return;
  function ar(){return document.documentElement.lang==='ar'}
  function pad(n){return n<10?'0'+n:''+n}
  function base(p){return 'images/projects/p'+p.n+'/'}
  function items(p){var a=[],i;for(i=1;i<=p.imgs;i++)a.push({t:'i',src:base(p)+pad(i)+'.webp',th:base(p)+'t'+pad(i)+'.webp'});for(i=1;i<=p.vids;i++)a.push({t:'v',src:base(p)+'v'+i+'.mp4',th:base(p)+'v'+i+'.jpg'});return a}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
  function media(p,l){
    var a=[];
    if(p.imgs)a.push(l==='ar'?p.imgs+' صور':p.imgs+(p.imgs===1?' photograph':' photographs'));
    if(p.vids)a.push(l==='ar'?p.vids+' فيلم':p.vids+(p.vids===1?' film':' films'));
    return a.join(' · ');
  }
  function viewLbl(l){return l==='ar'?'شاهد المشروع':'View project'}
  var l0=ar()?'ar':'en';
  if(nav){
    nav.innerHTML=P.map(function(p,k){
      return '<button type="button" data-i="'+k+'"><span>'+pad(k+1)+'</span><i data-en="'+esc(p.en)+'" data-ar="'+esc(p.ar)+'">'+esc(l0==='ar'?p.ar:p.en)+'</i></button>';
    }).join('');
  }
  grid.innerHTML=P.map(function(p,k){
    var cover=p.imgs?base(p)+'c.webp':(p.vids?base(p)+'v1.jpg':''),l=ar()?'ar':'en';
    var le=p.cEn||'',la=p.cAr||'',loc=l==='ar'?la:le;
    return '<button type="button" class="pres" data-i="'+k+'" id="res-'+p.n+'">'+
      '<span class="pres-fig">'+(cover?'<img src="'+cover+'" alt="" loading="lazy" decoding="async">':'')+
      (p.vids?'<span class="pplay" aria-hidden="true">▶</span>':'')+'</span>'+
      '<span class="pres-copy"><span class="pnum">'+pad(k+1)+'</span>'+
      (le||la?'<p class="ploc" data-en="'+esc(le)+'" data-ar="'+esc(la)+'">'+esc(loc)+'</p>':'')+
      '<h3 data-en="'+esc(p.en)+'" data-ar="'+esc(p.ar)+'">'+esc(l==='ar'?p.ar:p.en)+'</h3>'+
      '<p class="pmedia" data-en="'+esc(media(p,'en'))+'" data-ar="'+esc(media(p,'ar'))+'">'+esc(media(p,l))+'</p>'+
      '<span class="penter" data-en="'+esc(viewLbl('en'))+'" data-ar="'+esc(viewLbl('ar'))+'">'+esc(viewLbl(l))+'</span></span></button>';
  }).join('');
  var cur=null,list=[],idx=0,img=$('pimg'),vid=$('pvid'),thumbs=$('pthumbs');
  function show(i){
    if(!list.length)return;
    idx=(i+list.length)%list.length;var it=list[idx];
    vid.pause();
    if(it.t==='v'){img.hidden=true;vid.hidden=false;vid.poster=it.th;vid.src=it.src}
    else{vid.hidden=true;vid.removeAttribute('src');vid.load();img.hidden=false;img.src=it.src}
    $('pcount').textContent=(idx+1)+' / '+list.length;
    [].forEach.call(thumbs.children,function(b,k){if(k===idx){b.setAttribute('aria-current','true');b.scrollIntoView&&b.scrollIntoView({block:'nearest',inline:'center'})}else b.removeAttribute('aria-current')});
  }
  function open(k){
    cur=P[k];list=items(cur);
    var nm=$('pname'),lc=$('ploc');
    nm.setAttribute('data-en',cur.en);nm.setAttribute('data-ar',cur.ar);nm.textContent=ar()?cur.ar:cur.en;
    var le=cur.cEn||'',la=cur.cAr||'';lc.setAttribute('data-en',le);lc.setAttribute('data-ar',la);lc.textContent=ar()?la:le;lc.hidden=!le&&!la;
    thumbs.innerHTML=list.map(function(it,j){return '<button type="button" data-j="'+j+'" aria-label="'+(j+1)+'"><img src="'+it.th+'" alt="" loading="lazy">'+(it.t==='v'?'<span class="pl">▶</span>':'')+'</button>'}).join('');
    var multi=list.length>1;$('pprev').hidden=!multi;$('pnext').hidden=!multi;
    dlg.showModal();show(0);
  }
  function close(){vid.pause();dlg.close()}
  function go(k){
    var el=grid.querySelector('.pres[data-i="'+k+'"]');
    if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  }
  grid.addEventListener('click',function(e){var b=e.target.closest('.pres');if(b)open(+b.getAttribute('data-i'))});
  if(nav)nav.addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(+b.getAttribute('data-i'))});
  thumbs.addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(+b.getAttribute('data-j'))});
  $('pprev').addEventListener('click',function(){show(idx-1)});
  $('pnext').addEventListener('click',function(){show(idx+1)});
  dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('[data-pclose]'))close();else if(e.target.closest('#pquote')){close()}});
  dlg.addEventListener('close',function(){vid.pause();vid.removeAttribute('src')});
  dlg.addEventListener('keydown',function(e){
    var rtl=ar();
    if(e.key==='ArrowRight'){e.preventDefault();show(idx+(rtl?-1:1))}
    else if(e.key==='ArrowLeft'){e.preventDefault();show(idx+(rtl?1:-1))}
  });
  var sx=null;
  dlg.querySelector('.pstage').addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  dlg.querySelector('.pstage').addEventListener('touchend',function(e){
    if(sx===null||e.target===vid)return;var dx=e.changedTouches[0].clientX-sx;sx=null;
    if(Math.abs(dx)>50){var next=dx<0;if(ar())next=!next;show(idx+(next?1:-1))}
  },{passive:true});
})();
