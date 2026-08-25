const artistDrawer=document.querySelector('[data-artist-drawer]');
const overlay=document.querySelector('[data-artist-overlay]');
const drawerName=document.querySelector('[data-drawer-name]');
const projectId=new URLSearchParams(location.search).get('id')||'1';
const projectData=typeof PROJECTS==='undefined'?null:PROJECTS.find(project=>project.id===projectId);
if(projectData){
  document.title=`${projectData.title}｜胡氏藝術`;
  const description=document.querySelector('meta[name="description"]');
  if(description)description.content=`胡氏藝術執行專案：${projectData.title}。`;
  document.querySelector('.project-title h1').textContent=projectData.title;
  document.querySelector('.project-title time').textContent=projectData.year;
  document.querySelector('[data-project-category]').textContent=projectData.id==='1'?'展覽策劃、跨界合作':projectData.type;
  const hero=document.querySelector('.project-hero img');
  hero.src=projectData.image;
  hero.alt=`${projectData.title}專案主視覺`;
  const firstRecord=document.querySelector('.record-grid img');
  if(firstRecord){firstRecord.src=projectData.image;firstRecord.alt=`${projectData.title}專案圖片`}
}
function setDrawer(open,name=''){
  if(name)drawerName.textContent=name;
  artistDrawer.classList.toggle('open',open);
  overlay.classList.toggle('open',open);
  artistDrawer.setAttribute('aria-hidden',String(!open));
  document.body.classList.toggle('drawer-open',open);
}
document.querySelectorAll('[data-artist]').forEach(button=>button.addEventListener('click',()=>setDrawer(true,button.dataset.artist)));
document.querySelector('[data-drawer-close]').addEventListener('click',()=>setDrawer(false));
overlay.addEventListener('click',()=>setDrawer(false));

const lightbox=document.querySelector('[data-lightbox]');
const lightboxImage=lightbox.querySelector('img');
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true')}
document.querySelectorAll('.record-grid button').forEach(button=>button.addEventListener('click',()=>{
  const image=button.querySelector('img');
  lightboxImage.src=image.src;lightboxImage.alt=image.alt;
  lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');
}));
document.querySelector('[data-lightbox-close]').addEventListener('click',closeLightbox);
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeLightbox()});
addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  if(artistDrawer.classList.contains('open')){setDrawer(false);return}
  if(lightbox.classList.contains('open'))closeLightbox();
});
