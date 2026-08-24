const menu=document.querySelector('[data-menu]');
const drawer=document.querySelector('[data-drawer]');
if(menu&&drawer){menu.addEventListener('click',()=>{const open=!drawer.classList.contains('open');drawer.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));drawer.setAttribute('aria-hidden',String(!open));});drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{drawer.classList.remove('open');document.body.classList.remove('menu-open');}));}
const revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const makeHeader=document.querySelector('[data-header]');
const darkHero=document.querySelector('.home-hero');
if(makeHeader&&darkHero){const syncHeader=()=>makeHeader.classList.toggle('on-dark',scrollY<darkHero.offsetHeight-78);addEventListener('scroll',syncHeader,{passive:true});addEventListener('resize',syncHeader);syncHeader();}
