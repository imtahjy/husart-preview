const homeIndex=document.querySelector('.home-project-index');
const homeRows=[...homeIndex.querySelectorAll('a[data-image]')];
const homeBackground=document.querySelector('[data-project-background]');
const backgroundLayers=[...homeBackground.querySelectorAll('img')];
const homeLoader=document.querySelector('[data-home-loader]');
const loaderCard=document.querySelector('[data-loader-card]');
const loaderLayers=[...loaderCard.querySelectorAll('img')];
const loaderImages=[...new Set(homeRows.map(row=>row.dataset.image))];
let currentLayer=0;
let currentImage='';
let initialPreviewActive=false;
let initialPreviewReleaseTimer=0;

homeRows.forEach(row=>{
  const preload=new Image();
  preload.src=row.dataset.image;
});

function showProject(row){
  const nextImage=row.dataset.image;
  homeIndex.classList.add('has-hover');
  homeRows.forEach(item=>item.classList.toggle('is-hovered',item===row));
  document.body.classList.add('project-preview-active');

  if(nextImage===currentImage)return;
  const nextLayer=currentLayer===0?1:0;
  backgroundLayers[nextLayer].src=nextImage;
  backgroundLayers[nextLayer].classList.add('is-current');
  backgroundLayers[currentLayer].classList.remove('is-current');
  currentLayer=nextLayer;
  currentImage=nextImage;
}

function hideProject(){
  homeIndex.classList.remove('has-hover');
  homeRows.forEach(item=>item.classList.remove('is-hovered'));
  document.body.classList.remove('project-preview-active');
}

function handOffLoaderToFirstProject(){
  if(!homeRows.length)return;
  initialPreviewActive=true;
  showProject(homeRows[0]);
  clearTimeout(initialPreviewReleaseTimer);
  initialPreviewReleaseTimer=setTimeout(()=>{
    document.addEventListener('pointermove',event=>{
      if(!initialPreviewActive)return;
      initialPreviewActive=false;
      const target=event.target instanceof Element?event.target:null;
      const row=target?.closest('.home-project-index a[data-image]');
      if(row)showProject(row);
      else hideProject();
    },{once:true,capture:true});
  },120);
}

function runHomeLoader(){
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coverScale=Math.max(innerWidth/loaderCard.offsetWidth,innerHeight/loaderCard.offsetHeight)*1.02;
  loaderCard.style.setProperty('--loader-cover-scale',coverScale.toFixed(3));
  const visitToken='husart-home-seen=1';
  let hasVisited=false;
  try{
    hasVisited=sessionStorage.getItem('husart-home-seen')==='1';
    sessionStorage.setItem('husart-home-seen','1');
  }catch(error){}
  try{
    const tokens=window.name.split('|').filter(Boolean);
    if(tokens.includes(visitToken))hasVisited=true;
    else{
      tokens.push(visitToken);
      window.name=tokens.join('|');
    }
  }catch(error){}

  if(reduceMotion){
    handOffLoaderToFirstProject();
    homeLoader.remove();
    document.body.classList.remove('home-loading');
    return;
  }

  if(hasVisited){
    handOffLoaderToFirstProject();
    homeLoader.remove();
    document.body.classList.remove('home-loading');
    return;
  }

  let loaderLayer=0;
  let loaderIndex=0;
  requestAnimationFrame(()=>homeLoader.classList.add('is-ready'));

  const cycle=setInterval(()=>{
    loaderIndex=(loaderIndex+1)%loaderImages.length;
    const nextLayer=loaderLayer===0?1:0;
    loaderLayers[nextLayer].src=loaderImages[loaderIndex];
    loaderLayers[nextLayer].classList.add('is-visible');
    loaderLayers[loaderLayer].classList.remove('is-visible');
    loaderLayer=nextLayer;
  },170);

  setTimeout(()=>{
    clearInterval(cycle);
    const nextLayer=loaderLayer===0?1:0;
    loaderLayers[nextLayer].src=homeRows[0].dataset.image;
    loaderLayers[nextLayer].classList.add('is-visible');
    loaderLayers[loaderLayer].classList.remove('is-visible');
    homeLoader.classList.add('is-expanding');
  },1900);

  setTimeout(()=>{
    handOffLoaderToFirstProject();
    homeLoader.classList.add('is-leaving');
    document.body.classList.remove('home-loading');
  },3500);

  setTimeout(()=>homeLoader.remove(),4200);
}

homeRows.forEach(row=>{
  row.addEventListener('mouseenter',()=>{initialPreviewActive=false;showProject(row)});
  row.addEventListener('focus',()=>{initialPreviewActive=false;showProject(row)});
  row.addEventListener('pointerdown',()=>{initialPreviewActive=false;showProject(row)});
});
homeIndex.addEventListener('mouseleave',hideProject);
homeIndex.addEventListener('focusout',event=>{
  if(!homeIndex.contains(event.relatedTarget))hideProject();
});
runHomeLoader();
