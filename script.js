const body=document.body;
const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-menu');
const progress=document.querySelector('.page-progress span');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

menuButton.addEventListener('click',()=>{
  const open=!body.classList.contains('menu-open');
  body.classList.toggle('menu-open',open);
  mobileMenu.classList.toggle('open',open);
  mobileMenu.setAttribute('aria-hidden',String(!open));
  menuButton.setAttribute('aria-expanded',String(open));
});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  body.classList.remove('menu-open');mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden','true');menuButton.setAttribute('aria-expanded','false');
}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const el=entry.target,end=Number(el.dataset.count),start=performance.now();
  const tick=now=>{const p=Math.min(1,(now-start)/1200);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);counterObserver.unobserve(el);
}),{threshold:.65});
document.querySelectorAll('[data-count]').forEach(el=>counterObserver.observe(el));

const valueStory=document.querySelector('[data-value-story]');
const clamp=(v,min=0,max=1)=>Math.min(max,Math.max(min,v));
const valueLines=[...document.querySelectorAll('[data-scroll-line]')];

function updateValueCopy(){
  if(!valueStory||!valueLines.length)return;
  const mobile=innerWidth<=560;
  const revealStart=innerHeight*(mobile?.42:.62);
  const revealEnd=innerHeight*(mobile?.25:.38);
  valueLines.forEach(line=>{
    const lineTop=line.getBoundingClientRect().top;
    const lineProgress=reducedMotion?1:clamp((revealStart-lineTop)/(revealStart-revealEnd));
    line.style.setProperty('--line-progress',`${(lineProgress*100).toFixed(2)}%`);
  });
}

document.querySelectorAll('.timeline-item').forEach(item=>item.addEventListener('click',()=>{
  document.querySelectorAll('.timeline-item').forEach(el=>el.classList.toggle('active',el===item));
}));

const awards=document.querySelector('[data-awards]');
if(awards){
  const stage=awards.querySelector('[data-awards-stage]');
  const cards=[...stage.querySelectorAll('[data-award-year]')];
  const tabs=[...awards.querySelectorAll('[data-award-tab]')];
  let activeYear=tabs[0]?.dataset.awardTab;
  let stageScrollFrame=0;
  const syncAwardTabs=(year,scrollTab=true)=>{
    activeYear=year;
    tabs.forEach(tab=>{
      const active=tab.dataset.awardTab===year;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
      if(active&&scrollTab){
        const rail=tab.parentElement;
        rail.scrollTo({left:tab.offsetLeft-(rail.clientWidth-tab.offsetWidth)/2,behavior:reducedMotion?'auto':'smooth'});
      }
    });
  };
  const setAwardYear=(year,scrollTab=true)=>{
    const firstCard=cards.find(card=>card.dataset.awardYear===year);
    if(!firstCard)return;
    syncAwardTabs(year,scrollTab);
    const centeredLeft=firstCard.offsetLeft-(stage.clientWidth-firstCard.offsetWidth)/2;
    stage.scrollTo({left:Math.max(0,centeredLeft),behavior:reducedMotion?'auto':'smooth'});
  };
  tabs.forEach(tab=>tab.addEventListener('click',()=>setAwardYear(tab.dataset.awardTab)));
  const step=direction=>{
    const index=tabs.findIndex(tab=>tab.dataset.awardTab===activeYear);
    setAwardYear(tabs[(index+direction+tabs.length)%tabs.length].dataset.awardTab);
  };
  awards.querySelector('[data-awards-prev]').addEventListener('click',()=>step(-1));
  awards.querySelector('[data-awards-next]').addEventListener('click',()=>step(1));
  let dragging=false,startX=0,startScroll=0;
  stage.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    dragging=true;startX=event.clientX;startScroll=stage.scrollLeft;
    stage.classList.add('is-dragging');stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove',event=>{if(dragging)stage.scrollLeft=startScroll-(event.clientX-startX)});
  const endDrag=event=>{if(!dragging)return;dragging=false;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId)};
  stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
  stage.addEventListener('scroll',()=>{
    cancelAnimationFrame(stageScrollFrame);
    stageScrollFrame=requestAnimationFrame(()=>{
      const marker=stage.scrollLeft+stage.clientWidth/2;
      const firstVisible=cards.reduce((closest,card)=>Math.abs(card.offsetLeft+card.offsetWidth/2-marker)<Math.abs(closest.offsetLeft+closest.offsetWidth/2-marker)?card:closest,cards[0]);
      if(firstVisible?.dataset.awardYear!==activeYear)syncAwardTabs(firstVisible.dataset.awardYear);
    });
  },{passive:true});
  cards.forEach(card=>{card.hidden=false;card.removeAttribute('data-relation');card.removeAttribute('data-side');card.removeAttribute('data-active-slot');card.removeAttribute('data-slot')});
  syncAwardTabs(activeYear,false);
}

let lastY=0,ticking=false;
function updateScroll(){
  ticking=false;const y=scrollY,max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=`${clamp(y/max)*100}%`;
  updateValueCopy();
  header.classList.toggle('over-hero',valueStory.getBoundingClientRect().bottom>innerHeight*.25);
  header.style.transform=y>lastY&&y>160?'translateY(-100%)':'translateY(0)';
  lastY=y;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
addEventListener('resize',updateScroll);updateScroll();
