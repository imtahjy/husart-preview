(() => {
  const overlay=document.createElement('div');
  overlay.className='project-drawer-overlay';
  overlay.setAttribute('aria-hidden','true');

  const shell=document.createElement('aside');
  shell.className='project-drawer-shell';
  shell.setAttribute('role','dialog');
  shell.setAttribute('aria-modal','true');
  shell.setAttribute('aria-label','專案內容');
  shell.setAttribute('aria-hidden','true');
  shell.innerHTML='<iframe class="project-drawer-frame" title="專案內容"></iframe>';

  document.body.append(overlay,shell);
  const frame=shell.querySelector('iframe');
  let activeCard=null;
  let closeTimer=0;

  function projectFromUrl(){return new URL(location.href).searchParams.get('project')}
  function setUrl(id,push){
    const url=new URL(location.href);
    if(id)url.searchParams.set('project',id);else url.searchParams.delete('project');
    const state=id?{husartProjectDrawer:true,project:id}:{};
    history[push?'pushState':'replaceState'](state,'',url);
  }
  function openProject(id,{push=true}={}){
    if(!id)return;
    clearTimeout(closeTimer);
    activeCard=document.querySelector(`.make-project-card[href$="id=${CSS.escape(id)}"]`)||document.activeElement;
    frame.src=`project.html?id=${encodeURIComponent(id)}&embedded=1`;
    overlay.classList.add('open');shell.classList.add('open');document.body.classList.add('project-drawer-open');
    overlay.setAttribute('aria-hidden','false');shell.setAttribute('aria-hidden','false');
    if(push)setUrl(id,true);
  }
  function closeProject({updateHistory=true}={}){
    if(!shell.classList.contains('open'))return;
    overlay.classList.remove('open');shell.classList.remove('open');document.body.classList.remove('project-drawer-open');
    overlay.setAttribute('aria-hidden','true');shell.setAttribute('aria-hidden','true');
    closeTimer=setTimeout(()=>{if(!shell.classList.contains('open'))frame.src='about:blank'},650);
    if(updateHistory){if(history.state?.husartProjectDrawer)history.back();else setUrl('',false)}
    activeCard?.focus?.();
  }

  document.querySelectorAll('.make-project-card').forEach(card=>card.addEventListener('click',event=>{
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    event.preventDefault();
    openProject(new URL(card.href).searchParams.get('id'));
  }));
  overlay.addEventListener('click',()=>closeProject());
  addEventListener('message',event=>{
    if(event.source===frame.contentWindow&&event.data?.type==='husart-close-project')closeProject();
  });
  addEventListener('keydown',event=>{
    if(event.key==='Escape'&&shell.classList.contains('open')&&document.activeElement!==frame)closeProject();
  });
  addEventListener('popstate',()=>{
    const id=projectFromUrl();
    if(id)openProject(id,{push:false});else closeProject({updateHistory:false});
  });

  const initialProject=projectFromUrl();
  if(initialProject)openProject(initialProject,{push:false});
})();
