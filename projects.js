/* Projects page:
   1. Liron Moran style horizontal floating cards slider (alternating small & large cards, drag/wheel sliding, progress bar, hover dim/scale, staggered entry animation).
   2. Tapping a card animates into the full Liron Moran editorial project detail view (Flipkart-offices style: asymmetric "left small / right big", "single left", "left big / right small", "center", "single right" image blocks with scroll-reveal animations and full-screen lightbox on image click). */
(function(){
  var SHOW_HIDDEN=true;
  var ALL=[
    {n:1,imgs:15,vids:0,ext:'.jpg',noThumb:true,en:"Florida, USA",ar:"فلوريدا، الولايات المتحدة",cEn:"USA",cAr:"الولايات المتحدة",assetFolder:"images/projects/01-florida-usa/"},
    {n:2,imgs:5,vids:0,ext:'.jpg',noThumb:true,en:"Doha, Qatar",ar:"الدوحة، قطر",cEn:"Qatar",cAr:"قطر",assetFolder:"images/projects/02-doha-qatar/"},
    {n:3,imgs:8,vids:0,ext:'.jpg',noThumb:true,en:"Mivida New Cairo",ar:"ميفيدا القاهرة الجديدة",cEn:"New Cairo",cAr:"القاهرة الجديدة",assetFolder:"images/projects/03-mivida-new-cairo/"},
    {n:4,imgs:14,vids:0,en:"Makadi Heights",ar:"مكادي هايتس",cEn:"Hurghada",cAr:"الغردقة",assetFolder:"images/projects/makadi-heights/"},
    {n:5,imgs:7,vids:0,ext:'.jpg',noThumb:true,en:"Sodic East Town",ar:"سوديك إيست تاون",cEn:"New Cairo",cAr:"القاهرة الجديدة",assetFolder:"images/projects/05-sodic-east-town/"},
    {n:6,imgs:6,vids:0,ext:'.jpg',noThumb:true,en:"Alexandria",ar:"الإسكندرية",cEn:"Alexandria",cAr:"الإسكندرية",assetFolder:"images/projects/06-alexandria/"},
    {n:7,imgs:17,vids:0,ext:'.jpg',noThumb:true,en:"Up Town",ar:"أب تاون كايرو",cEn:"Cairo",cAr:"القاهرة",assetFolder:"images/projects/07-up-town/"},
    {n:8,imgs:7,vids:0,ext:'.jpg',noThumb:true,en:"Head Office of Saudi Company",ar:"المقر الرئيسي لشركة سعودية",cEn:"Saudi Arabia",cAr:"السعودية",assetFolder:"images/projects/08-saudi-company-hq/"},
    {n:9,imgs:0,vids:0,ext:'.jpg',noThumb:true,en:"Project 09",ar:"مشروع 09",cEn:"Coming Soon",cAr:"قريبًا",assetFolder:"images/projects/09-project-09/"},
    {n:10,imgs:0,vids:0,ext:'.jpg',noThumb:true,en:"Project 10",ar:"مشروع 10",cEn:"Coming Soon",cAr:"قريبًا",assetFolder:"images/projects/10-project-10/"}
  ];
  var P=ALL.filter(function(x){return SHOW_HIDDEN||!x.hide});
  window.PROJECTS=P;

  var $=function(i){return document.getElementById(i)},
      grid=$('pgrid'),
      viewport=$('lm-viewport'),
      progBar=$('lm-progress-bar'),
      countEl=$('lm-count'),
      secProjects=document.querySelector('.lm-projects'),
      secDetail=$('lm-detail'),
      dlg=$('pgal');
  if(!grid||!dlg)return;

  function ar(){return document.documentElement.lang==='ar'}
  function pad(n){return n<10?'0'+n:''+n}
  function base(p){return p.assetFolder||'images/projects/p'+p.n+'/'}
  function items(p){
    if(p.singleImg)return[{t:'i',src:p.singleImg,th:p.singleImg}];
    var a=[],i,ext=p.ext||'.webp';
    for(i=1;i<=p.imgs;i++){
      var s=base(p)+pad(i)+ext;
      a.push({t:'i',src:s,th:p.noThumb?s:(base(p)+'t'+pad(i)+ext)});
    }
    for(i=1;i<=p.vids;i++)a.push({t:'v',src:base(p)+'v'+i+'.mp4',th:base(p)+'v'+i+'.jpg'});
    return a;
  }
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}

  if(countEl)countEl.textContent=pad(P.length);

  /* Render Floating Cards (Alternating small even / large odd like Liron Moran) */
  function renderCards(){
    var l=ar()?'ar':'en';
    grid.innerHTML=P.map(function(p,k){
      var ext=p.ext||'.webp';
      var cover=p.singleImg||(p.imgs?base(p)+'01'+ext:(p.vids?base(p)+'v1.jpg':''));
      var sizeCls=(k%2===0)?'lm-card-sm':'lm-card-lg';
      var titlePos=(k%2===0)?'lm-title-bottom':'lm-title-top';
      var soon=ar()?(p.cAr||'قريبًا'):(p.cEn||'Coming Soon');
      return '<article class="lm-card '+sizeCls+' '+titlePos+(cover?'':' lm-card-empty')+'" data-i="'+k+'" style="--stagger:'+k+'">'+
        '<span class="lm-card-num">'+pad(k+1)+'</span>'+
        '<button type="button" class="lm-card-btn" data-i="'+k+'" aria-label="'+esc(p[l])+'"'+(cover?'':' aria-disabled="true"')+'>'+
          '<span class="lm-card-img-wrap">'+
            (cover
              ?'<img src="'+cover+'" alt="'+esc(p[l])+'" loading="'+(k<4?'eager':'lazy')+'" fetchpriority="'+(k<2?'high':'auto')+'" decoding="async">'
              :'<span class="lm-card-soon" data-en="'+esc(p.cEn||'Coming Soon')+'" data-ar="'+esc(p.cAr||'قريبًا')+'">'+esc(soon)+'</span>')+
          '</span>'+
        '</button>'+
        '<h3 class="lm-card-title" data-en="'+esc(p.en)+'" data-ar="'+esc(p.ar)+'">'+esc(p[l])+'</h3>'+
      '</article>';
    }).join('');
  }
  renderCards();

  /* Liron Moran style smooth lerp horizontal slider (reaches all cards 01..27 + releases vertical scroll at ends to reach footer) */
  var targetX=0,currentX=0,maxScroll=0,rafId=null;
  var isDown=false,startX=0,dragStartTarget=0,dragMoved=0,downCard=null;
  var prevBtn=$('lm-prev'),nextBtn=$('lm-next'),progWrap=$('lm-progress-wrap');

  function calcMax(){
    if(!viewport||!grid)return 0;
    var trackW=grid.scrollWidth||grid.offsetWidth||0;
    var viewW=viewport.clientWidth||window.innerWidth||0;
    maxScroll=Math.max(0,trackW-viewW);
    if(targetX>maxScroll)targetX=maxScroll;
    if(targetX<0)targetX=0;
    return maxScroll;
  }

  function renderSliderPos(){
    if(!grid||!viewport)return;
    calcMax();
    var dir=ar()?1:-1;
    grid.style.transform='translate3d('+(dir*currentX).toFixed(2)+'px,0,0)';
    if(progBar){
      if(maxScroll<=0){
        progBar.style.width='100%';
        progBar.style.transform='translate3d(0,0,0)';
      } else {
        var ratio=Math.min(1,Math.max(0,currentX/maxScroll));
        var trackW=grid.scrollWidth||1;
        var barW=Math.max(10,Math.min(100,(viewport.clientWidth/trackW)*100));
        progBar.style.width=barW+'%';
        var maxShift=((100-barW)/barW)*100;
        var pDir=ar()?-1:1;
        progBar.style.transform='translate3d('+(pDir*ratio*maxShift).toFixed(2)+'%,0,0)';
      }
    }
  }

  function tickLerp(){
    var diff=targetX-currentX;
    if(Math.abs(diff)>0.25){
      currentX+=diff*0.11;
      renderSliderPos();
      rafId=requestAnimationFrame(tickLerp);
    } else {
      currentX=targetX;
      renderSliderPos();
      rafId=null;
    }
  }

  function setTarget(val,instant){
    calcMax();
    targetX=Math.min(maxScroll,Math.max(0,val));
    if(instant){
      currentX=targetX;
      renderSliderPos();
      if(rafId){cancelAnimationFrame(rafId);rafId=null;}
    } else if(!rafId){
      rafId=requestAnimationFrame(tickLerp);
    }
  }

  window.addEventListener('resize',function(){
    calcMax();
    renderSliderPos();
  });

  /* Recalculate width as card images finish loading so final cards are never unreachable */
  grid.querySelectorAll('img').forEach(function(im){
    im.addEventListener('load',function(){calcMax();renderSliderPos();},{once:true});
  });

  if(viewport){
    /* Left / Right arrow buttons */
    function slideByDir(dir){
      calcMax();
      var step=Math.max(360,Math.round(viewport.clientWidth*0.65));
      setTarget(targetX+dir*step,false);
    }
    if(prevBtn)prevBtn.addEventListener('click',function(){slideByDir(-1)});
    if(nextBtn)nextBtn.addEventListener('click',function(){slideByDir(1)});

    /* Click / drag on progress rail to scrub smoothly across all 27 cards */
    if(progWrap){
      var railDown=false;
      function scrubTo(clientX){
        calcMax();
        var rect=progWrap.getBoundingClientRect();
        var ratio=Math.min(1,Math.max(0,(clientX-rect.left)/Math.max(1,rect.width)));
        if(ar())ratio=1-ratio;
        setTarget(ratio*maxScroll,false);
      }
      progWrap.addEventListener('pointerdown',function(e){
        railDown=true;
        scrubTo(e.clientX);
      });
      window.addEventListener('pointermove',function(e){
        if(railDown)scrubTo(e.clientX);
      });
      window.addEventListener('pointerup',function(){
        railDown=false;
      });
    }

    /* Mouse & touch drag: cards follow the pointer 1:1, then glide with momentum on release */
    var lastDragX=0,lastT=0,velX=0,touchStartY=0,touchAxis=null,dragging=false,activePointerId=null;
    var DRAG_START=5;
    viewport.addEventListener('pointerdown',function(e){
      if(e.target.closest&&e.target.closest('.lm-arrow-btn'))return;
      if(e.button&&e.button!==0)return;
      calcMax();
      isDown=true;dragging=false;dragMoved=0;velX=0;touchAxis=null;
      activePointerId=e.pointerId!==undefined?e.pointerId:null;
      downCard=e.target.closest?e.target.closest('.lm-card'):null;
      startX=e.clientX;lastDragX=e.clientX;lastT=performance.now();
      touchStartY=e.clientY;
      /* continue from where the glide currently is, so grabbing a moving track feels natural */
      dragStartTarget=currentX;
      targetX=currentX;
      if(rafId){cancelAnimationFrame(rafId);rafId=null;}
    });
    window.addEventListener('pointermove',function(e){
      if(!isDown)return;
      var dx=e.clientX-startX,dy=e.clientY-touchStartY;
      if(!touchAxis&&(Math.abs(dx)>DRAG_START||Math.abs(dy)>DRAG_START)){
        touchAxis=Math.abs(dx)>=Math.abs(dy)?'x':'y';
      }
      if(touchAxis==='y'&&e.pointerType!=='mouse')return; /* let the page scroll vertically on phones */
      if(touchAxis!=='x')return;
      if(!dragging){
        dragging=true;
        viewport.classList.add('is-dragging');
        /* Only capture the pointer once a real drag starts so a simple tap/click stays on the card */
        if(viewport.setPointerCapture&&activePointerId!==null){
          try{viewport.setPointerCapture(activePointerId)}catch(ignore){}
        }
      }
      var now=performance.now(),dt=Math.max(1,now-lastT),stepX=e.clientX-lastDragX;
      velX=velX*0.6+(stepX/dt)*0.4; /* px per ms, smoothed */
      lastDragX=e.clientX;lastT=now;
      dragMoved=Math.abs(dx);
      var sign=ar()?1:-1;
      setTarget(dragStartTarget+sign*dx,true); /* instant: no lag while dragging */
      if(e.cancelable)e.preventDefault();
    },{passive:false});
    function endPointerDrag(){
      if(!isDown)return;
      isDown=false;
      viewport.classList.remove('is-dragging');
      if(dragging){
        dragging=false;
        if(viewport.releasePointerCapture&&activePointerId!==null){
          try{viewport.releasePointerCapture(activePointerId)}catch(ignore){}
        }
        if(performance.now()-lastT>90)velX=0; /* paused before release: no fling */
        var sign=ar()?1:-1;
        setTarget(targetX+sign*velX*260,false); /* momentum glide */
      }
      activePointerId=null;
    }
    window.addEventListener('pointerup',endPointerDrag);
    window.addEventListener('pointercancel',endPointerDrag);
    /* stop the browser's native image/link drag ghost, which was cancelling the drag */
    viewport.addEventListener('dragstart',function(e){e.preventDefault()});
    /* a real drag must not open a project on release */
    viewport.addEventListener('click',function(e){
      if(dragMoved>DRAG_START){e.stopPropagation();e.preventDefault();dragMoved=0;downCard=null;}
    },true);
  }

  /* Keyboard Left/Right support when on Projects page */
  window.addEventListener('keydown',function(e){
    if(!secProjects||secProjects.hidden||dlg.open)return;
    if(e.key==='ArrowRight'){
      setTarget(targetX+(ar()?-420:420),false);
    } else if(e.key==='ArrowLeft'){
      setTarget(targetX+(ar()?420:-420),false);
    }
  });

  /* Hover interaction: dim sibling cards and slightly scale hovered card (like Liron Moran) */
  grid.addEventListener('pointerover',function(e){
    if(e.pointerType&&e.pointerType!=='mouse')return;
    if(isDown&&dragMoved>5)return;
    var card=e.target.closest('.lm-card');
    if(card){
      grid.classList.add('has-hover');
      grid.querySelectorAll('.lm-card.is-hovered').forEach(function(c){if(c!==card)c.classList.remove('is-hovered')});
      card.classList.add('is-hovered');
    }
  });
  grid.addEventListener('pointerleave',function(){
    grid.classList.remove('has-hover');
    grid.querySelectorAll('.lm-card.is-hovered').forEach(function(c){c.classList.remove('is-hovered')});
  });

  window.initProjectsSlider=function(){
    if(secProjects)secProjects.hidden=false;
    if(secDetail)secDetail.hidden=true;
    grid.classList.remove('lm-entering');
    void grid.offsetWidth;
    grid.classList.add('lm-entering');
    setTimeout(function(){
      calcMax();
      renderSliderPos();
    },60);
  };

  /* Scroll-reveal observer for images inside project detail */
  var revealObs=null;
  if('IntersectionObserver' in window){
    revealObs=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('is-visible');
          revealObs.unobserve(en.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  }

  /* Build Liron Moran Flipkart-style asymmetric image rows from project media */
  var cur=null,list=[],idx=0,img=$('pimg'),vid=$('pvid'),thumbs=$('pthumbs');

  function renderProjectDetail(k){
    cur=P[k];
    list=items(cur);
    var l=ar()?'ar':'en';

    $('lm-detail-num').textContent=pad(k+1);
    var locEl=$('lm-detail-loc');
    var le=cur.cEn||'',la=cur.cAr||'';
    locEl.setAttribute('data-en',le);locEl.setAttribute('data-ar',la);
    locEl.textContent=l==='ar'?la:le;
    locEl.hidden=!le&&!la;

    var titleEl=$('lm-detail-title');
    titleEl.setAttribute('data-en',cur.en);titleEl.setAttribute('data-ar',cur.ar);
    titleEl.textContent=cur[l];

    function mediaBox(it,itemIndex,extraCls){
      if(it.t==='v'){
        return '<div class="lm-img-wrap '+(extraCls||'')+' lm-reveal" data-mindex="'+itemIndex+'">'+
          '<video src="'+it.src+'" poster="'+it.th+'" controls playsinline preload="metadata"></video>'+
        '</div>';
      }
      return '<div class="lm-img-wrap '+(extraCls||'')+' lm-reveal" data-mindex="'+itemIndex+'">'+
        '<img src="'+it.src+'" alt="'+esc(cur[l])+'" loading="lazy" decoding="async">'+
      '</div>';
    }

    /* Hero first image (full width) */
    var mainEl=$('lm-detail-main');
    if(list.length>0){
      mainEl.innerHTML=mediaBox(list[0],0,'lm-hero-media');
    } else {
      mainEl.innerHTML='';
    }

    /* Remaining images arranged in Liron Moran Flipkart-Offices editorial patterns:
       Pattern cycle:
       0: left-small-right-big (2 images: small top-left + large right, as in uploaded screenshot)
       1: single-left (1 image)
       2: left-big-right-small (2 images: large left + small right)
       3: center (1 wide image)
       4: single-right (1 image) */
    var bodyEl=$('lm-detail-body');
    var html='',pIdx=1,step=0;
    while(pIdx<list.length){
      var pat=step%5;
      var rem=list.length-pIdx;
      if((pat===0||pat===2)&&rem>=2){
        var cls=pat===0?'lm-row-left-small-right-big':'lm-row-left-big-right-small';
        html+='<div class="lm-row '+cls+'">'+
          mediaBox(list[pIdx],pIdx,'lm-col-1')+
          mediaBox(list[pIdx+1],pIdx+1,'lm-col-2')+
        '</div>';
        pIdx+=2;
      } else {
        var sCls=(pat===1)?'lm-row-single-left':((pat===4)?'lm-row-single-right':'lm-row-center');
        html+='<div class="lm-row '+sCls+'">'+
          mediaBox(list[pIdx],pIdx,'lm-col-single')+
        '</div>';
        pIdx+=1;
      }
      step++;
    }
    bodyEl.innerHTML=html;

    /* Next project footer (like Liron Moran NextProject section) */
    var nextK=(k+1)%P.length;
    while(nextK!==k&&!P[nextK].imgs&&!P[nextK].vids&&!P[nextK].singleImg){nextK=(nextK+1)%P.length;}
    var nextP=P[nextK];
    var nextEl=$('lm-detail-next');
    if(nextEl){
      nextEl.innerHTML=
        '<span class="lm-next-kicker" data-en="NEXT PROJECT" data-ar="المشروع التالي">'+(l==='ar'?'المشروع التالي':'NEXT PROJECT')+'</span>'+
        '<button type="button" class="lm-next-btn" data-next="'+nextK+'">'+
          '<span class="lm-next-title" data-en="'+esc(nextP.en)+'" data-ar="'+esc(nextP.ar)+'">'+esc(nextP[l])+'</span>'+
          '<span class="lm-next-circle" aria-hidden="true">→</span>'+
        '</button>';
    }

    /* Show detail view with smooth transition */
    if(secProjects)secProjects.hidden=true;
    secDetail.hidden=false;
    secDetail.classList.remove('lm-detail-enter');
    void secDetail.offsetWidth;
    secDetail.classList.add('lm-detail-enter');
    window.scrollTo({top:0,behavior:'smooth'});

    /* Observe reveal elements */
    var revEls=secDetail.querySelectorAll('.lm-reveal');
    revEls.forEach(function(el,idxEl){
      if(idxEl===0||!revealObs){
        setTimeout(function(){el.classList.add('is-visible')},80);
      } else {
        revealObs.observe(el);
      }
    });
  }

  function closeProjectDetail(){
    if(secDetail)secDetail.hidden=true;
    if(secProjects)secProjects.hidden=false;
    window.scrollTo({top:0,behavior:'smooth'});
    if(window.initProjectsSlider)window.initProjectsSlider();
  }

  /* Card click -> animate card and open project detail */
  function handleCardOpen(e){
    if(e.target&&e.target.closest&&e.target.closest('.lm-arrow-btn'))return;
    var card=(e.target&&e.target.closest&&e.target.closest('.lm-card'))||downCard;
    downCard=null;
    if(!card)return;
    var k=+card.getAttribute('data-i');
    if(!P[k]||(!P[k].imgs&&!P[k].vids&&!P[k].singleImg))return;
    card.classList.add('is-opening');
    setTimeout(function(){
      card.classList.remove('is-opening');
      renderProjectDetail(k);
    },320);
  }
  if(viewport)viewport.addEventListener('click',handleCardOpen);
  else grid.addEventListener('click',handleCardOpen);

  if($('lm-back'))$('lm-back').addEventListener('click',closeProjectDetail);
  if($('lm-close'))$('lm-close').addEventListener('click',closeProjectDetail);

  if(secDetail){
    secDetail.addEventListener('click',function(e){
      var nb=e.target.closest('[data-next]');
      if(nb){
        renderProjectDetail(+nb.getAttribute('data-next'));
        return;
      }
      var mw=e.target.closest('.lm-img-wrap');
      if(mw&&!e.target.closest('video')){
        var mIdx=+mw.getAttribute('data-mindex');
        openLightbox(mIdx);
      }
    });
  }

  /* Lightbox modal when clicking an image inside the project detail */
  function show(i){
    if(!list.length)return;
    idx=(i+list.length)%list.length;var it=list[idx];
    vid.pause();
    if(it.t==='v'){img.hidden=true;vid.hidden=false;vid.poster=it.th;vid.src=it.src}
    else{vid.hidden=true;vid.removeAttribute('src');vid.load();img.hidden=false;img.src=it.src}
    $('pcount').textContent=(idx+1)+' / '+list.length;
    [].forEach.call(thumbs.children,function(b,k){if(k===idx){b.setAttribute('aria-current','true');b.scrollIntoView&&b.scrollIntoView({block:'nearest',inline:'center'})}else b.removeAttribute('aria-current')});
  }
  function openLightbox(startIdx){
    if(!cur||!list.length)return;
    var nm=$('pname'),lc=$('ploc');
    nm.setAttribute('data-en',cur.en);nm.setAttribute('data-ar',cur.ar);nm.textContent=ar()?cur.ar:cur.en;
    var le=cur.cEn||'',la=cur.cAr||'';lc.setAttribute('data-en',le);lc.setAttribute('data-ar',la);lc.textContent=ar()?la:le;lc.hidden=!le&&!la;
    thumbs.innerHTML=list.map(function(it,j){return '<button type="button" data-j="'+j+'" aria-label="'+(j+1)+'"><img src="'+it.th+'" alt="" loading="lazy">'+(it.t==='v'?'<span class="pl">▶</span>':'')+'</button>'}).join('');
    var multi=list.length>1;$('pprev').hidden=!multi;$('pnext').hidden=!multi;
    dlg.showModal();show(startIdx||0);
  }
  function closeLightbox(){vid.pause();dlg.close()}
  thumbs.addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(+b.getAttribute('data-j'))});
  $('pprev').addEventListener('click',function(){show(idx-1)});
  $('pnext').addEventListener('click',function(){show(idx+1)});
  dlg.addEventListener('click',function(e){if(e.target===dlg||e.target.closest('[data-pclose]'))closeLightbox();else if(e.target.closest('#pquote')){closeLightbox()}});
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

  if($('lang'))$('lang').addEventListener('click',function(){setTimeout(function(){calcMax();renderSliderPos()},20)});

  setTimeout(function(){
    calcMax();
    renderSliderPos();
  },100);
})();
