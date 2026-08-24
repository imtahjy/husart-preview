(() => {
  const STORAGE_KEY='husart-page-transition';
  const WINDOW_NAME_TOKEN='husart-page-transition=1';
  const HOLD_TIME=380;
  const FADE_TIME=360;
  const COVER_FALLBACK=420;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const curtain=document.createElement('div');
  curtain.className='page-transition-curtain';
  curtain.setAttribute('aria-hidden','true');
  curtain.innerHTML='<i></i>';
  document.documentElement.append(curtain);
  let isTransitioning=false;

  const consumeArrivalFlag=()=>{
    let value=false;
    try{
      value=sessionStorage.getItem(STORAGE_KEY)==='1';
      sessionStorage.removeItem(STORAGE_KEY);
    }catch(error){}
    try{
      const tokens=window.name.split('|').filter(Boolean);
      const tokenIndex=tokens.indexOf(WINDOW_NAME_TOKEN);
      if(tokenIndex>=0){
        value=true;
        tokens.splice(tokenIndex,1);
        window.name=tokens.join('|');
      }
    }catch(error){}
    return value;
  };

  const setArrivalFlag=()=>{
    try{sessionStorage.setItem(STORAGE_KEY,'1')}catch(error){}
    try{
      const tokens=window.name.split('|').filter(Boolean);
      if(!tokens.includes(WINDOW_NAME_TOKEN))tokens.push(WINDOW_NAME_TOKEN);
      window.name=tokens.join('|');
    }catch(error){}
  };

  const resetCurtain=()=>{
    curtain.className='page-transition-curtain';
    isTransitioning=false;
  };

  if(consumeArrivalFlag()&&!reducedMotion.matches){
    isTransitioning=true;
    curtain.className='page-transition-curtain is-holding';
    scrollTo(0,0);
    setTimeout(()=>{
      curtain.className='page-transition-curtain is-holding is-fading';
      setTimeout(resetCurtain,FADE_TIME);
    },HOLD_TIME);
  }

  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
    const destination=new URL(link.href,location.href);
    if(destination.origin!==location.origin||!/^https?:$|^file:$/.test(destination.protocol))return;
    if(destination.pathname===location.pathname&&destination.search===location.search)return;
    if(isTransitioning)return;
    event.preventDefault();
    if(reducedMotion.matches){location.href=destination.href;return}

    isTransitioning=true;
    setArrivalFlag();
    let didNavigate=false;
    const navigate=()=>{
      if(didNavigate)return;
      didNavigate=true;
      curtain.className='page-transition-curtain is-holding';
      requestAnimationFrame(()=>{location.href=destination.href});
    };
    curtain.addEventListener('transitionend',transitionEvent=>{
      if(transitionEvent.target===curtain&&transitionEvent.propertyName==='transform')navigate();
    },{once:true});
    curtain.className='page-transition-curtain is-covering';
    setTimeout(navigate,COVER_FALLBACK);
  });

  addEventListener('pageshow',event=>{
    if(event.persisted)resetCurtain();
  });
})();
