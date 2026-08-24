(() => {
  const list = document.querySelector('#artists-list');
  const panel = document.querySelector('[data-panel]');
  const content = document.querySelector('#artist-panel-content');
  const mask = document.querySelector('[data-panel-mask]');
  const mobile = () => matchMedia('(max-width:600px)').matches;
  const pos = () => mobile() ? {top:-136,mid:-68,bottom:0} : {top:-160,mid:-80,bottom:0};

  const faces = (artist) => `
    <div class="artist-row-face"><span>${artist.name}</span><span>${artist.location}</span></div>
    <div class="artist-row-face hover"><span>${artist.name}</span><span class="artist-arrow" aria-hidden="true">→</span></div>
    <div class="artist-row-face"><span>${artist.name}</span><span>${artist.location}</span></div>`;

  list.innerHTML = ARTISTS.map(artist => `
    <button class="artist-row" type="button" data-artist="${artist.id}" aria-label="查看 ${artist.name}">
      <span class="artist-row-track">${faces(artist)}</span>
    </button>`).join('');

  function slide(track, y, animate=true){
    track.style.transition = animate ? 'transform .4s cubic-bezier(.25,1,.5,1)' : 'none';
    track.style.transform = `translateY(${y}px)`;
  }
  let activeRow = null;
  list.querySelectorAll('.artist-row').forEach(row => {
    const track = row.querySelector('.artist-row-track');
    row.addEventListener('mouseenter', e => {
      const p=pos(), rect=row.getBoundingClientRect(), fromTop=e.clientY<rect.top+rect.height/2;
      if(activeRow && activeRow!==row) slide(activeRow.querySelector('.artist-row-track'),fromTop?p.top:p.bottom);
      if(fromTop) slide(track,p.mid); else {slide(track,p.bottom,false);track.getBoundingClientRect();slide(track,p.mid)}
      activeRow=row;
    });
    row.addEventListener('mouseleave', e => {
      const p=pos(),rect=row.getBoundingClientRect();slide(track,e.clientY<rect.top+rect.height/2?p.top:p.bottom);if(activeRow===row)activeRow=null;
    });
    row.addEventListener('click',()=>openArtist(row.dataset.artist));
  });

  function projectRows(artist){
    if(!artist.projects.length)return '';
    return `<section class="panel-projects"><h3>合作專案</h3><div class="panel-project-list">${artist.projects.map((project,i)=>`
      <a class="project-row" href="project.html?id=${encodeURIComponent(project.id||'1')}" data-project="${i}"><span class="project-row-track">
        <span class="project-row-face"><span>${project.label}</span></span><span class="project-row-face hover"><span>${project.label}</span><span class="project-row-arrow" aria-hidden="true">→</span></span><span class="project-row-face"><span>${project.label}</span></span>
      </span></a>`).join('')}</div></section>`;
  }
  function openArtist(id){
    const artist=ARTISTS.find(item=>item.id===id);if(!artist)return;
    content.innerHTML=`<button class="artist-close" type="button" aria-label="關閉"><svg viewBox="0 0 20 20" fill="none"><path d="M15 5 5 15M5 5l10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>CLOSE</span></button>
      <div class="panel-bio"><div class="panel-bio-copy"><h2>${artist.display}</h2><p>${artist.bio}</p></div>${artist.portrait?`<img class="panel-portrait" src="${artist.portrait}" alt="${artist.display}">`:''}</div>${projectRows(artist)}`;
    document.body.classList.add('artist-open');panel.classList.add('open');panel.setAttribute('aria-hidden','false');
    content.querySelector('.artist-close').addEventListener('click',closeArtist);
    bindProjects();setHash(id);
  }
  function closeArtist(){document.body.classList.remove('artist-open');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');history.replaceState(null,'',location.pathname)}
  function setHash(id){history.replaceState(null,'',`#${id}`)}
  function bindProjects(){
    content.querySelectorAll('.project-row').forEach(row=>{
      const track=row.querySelector('.project-row-track');
      row.addEventListener('mouseenter',e=>{const rect=row.getBoundingClientRect(),fromTop=e.clientY<rect.top+rect.height/2;if(fromTop)slide(track,-64);else{slide(track,0,false);track.getBoundingClientRect();slide(track,-64)}});
      row.addEventListener('mouseleave',e=>{const rect=row.getBoundingClientRect();slide(track,e.clientY<rect.top+rect.height/2?-128:0)});
    });
  }
  mask?.addEventListener('click',closeArtist);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))closeArtist()});
  if(location.hash)openArtist(location.hash.slice(1));
})();
