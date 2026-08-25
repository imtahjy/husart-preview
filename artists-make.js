(() => {
  const list = document.querySelector('#artists-list');
  const panel = document.querySelector('[data-panel]');
  const content = document.querySelector('#artist-panel-content');
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
    const projectLinks=[['潛行','1'],['方寸之間','2'],['南巷藝事','3'],['無際棲域','4'],['花蓮國際石雕','5'],['匯聚的分岔點','6'],['光源台北','7'],['越後妻有','8'],['台北市典藏性作品規劃','9']];
    return `<section class="artist-detail-projects"><h3>合作專案</h3><div class="artist-detail-project-list">${artist.projects.map(project=>`
      <a class="artist-detail-project-row" href="${(()=>{const match=projectLinks.find(([keyword])=>project.label.includes(keyword));return match?`project.html?id=${match[1]}`:'projects.html'})()}">
        <span>${project.label}</span><img src="assets/ui/artist-arrow.svg" alt="" aria-hidden="true">
      </a>`).join('')}</div></section>`;
  }
  function openArtist(id){
    const artist=ARTISTS.find(item=>item.id===id);if(!artist)return;
    content.innerHTML=`<button class="artist-close artist-detail-close" type="button" aria-label="關閉">
        <img src="assets/ui/artist-close.svg" alt="" aria-hidden="true"><span>CLOSE</span>
      </button>
      <div class="artist-detail-header"><div class="artist-detail-copy"><h2>${artist.display}</h2><p>${artist.bio}</p></div>${artist.portrait?`<img class="artist-detail-portrait" src="${artist.portrait}" alt="${artist.display}">`:''}</div>${projectRows(artist)}`;
    document.body.classList.add('artist-open');panel.classList.add('open');panel.setAttribute('aria-hidden','false');
    content.querySelector('.artist-close').addEventListener('click',closeArtist);
    setHash(id);
  }
  function closeArtist(){document.body.classList.remove('artist-open');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');history.replaceState(null,'',location.pathname)}
  function setHash(id){history.replaceState(null,'',`#${id}`)}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))closeArtist()});
  if(location.hash)openArtist(location.hash.slice(1));
})();
