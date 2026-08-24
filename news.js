(() => {
  const rows = [...document.querySelectorAll('.news-row')];
  const yearDropdown = document.querySelector('[data-news-year-dropdown]');
  const yearTrigger = document.querySelector('[data-news-year-trigger]');
  const yearMenu = document.querySelector('[data-news-year-menu]');
  const yearSummary = document.querySelector('[data-news-year-summary]');
  const selectedYears = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  rows.forEach(row => {
    const content = row.innerHTML;
    row.innerHTML = `
      <span class="news-row-track">
        <span class="news-row-face" aria-hidden="true">${content}</span>
        <span class="news-row-face hover">${content}</span>
        <span class="news-row-face" aria-hidden="true">${content}</span>
      </span>`;
    row.dataset.position = 'top';
  });

  function positionFor(row, position){
    const height = Number(row.dataset.rowHeight) || row.offsetHeight;
    if(position === 'middle') return -height;
    if(position === 'bottom') return 0;
    return -height * 2;
  }

  function slide(row, position, animate = true){
    const track = row.querySelector('.news-row-track');
    row.dataset.position = position;
    track.style.transition = animate && !reducedMotion
      ? 'transform .4s cubic-bezier(.25,1,.5,1)'
      : 'none';
    track.style.transform = `translateY(${positionFor(row, position)}px)`;
  }

  function measure(row){
    const faces = [...row.querySelectorAll('.news-row-face')];
    row.style.height = 'auto';
    faces.forEach(face => {
      face.style.height = 'auto';
      face.style.flexBasis = 'auto';
    });
    const height = Math.max(...faces.map(face => Math.ceil(face.scrollHeight)));
    row.dataset.rowHeight = height;
    row.style.height = `${height}px`;
    faces.forEach(face => {
      face.style.height = `${height}px`;
      face.style.flexBasis = `${height}px`;
    });
    const track = row.querySelector('.news-row-track');
    track.style.height = `${height * 3}px`;
    slide(row, row.dataset.position || 'top', false);
  }

  rows.forEach(row => {
    measure(row);
    row.addEventListener('mouseenter', event => {
      const rect = row.getBoundingClientRect();
      const fromTop = event.clientY < rect.top + rect.height / 2;
      if(fromTop) slide(row, 'middle');
      else {
        slide(row, 'bottom', false);
        row.offsetHeight;
        slide(row, 'middle');
      }
    });
    row.addEventListener('mouseleave', event => {
      const rect = row.getBoundingClientRect();
      slide(row, event.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom');
    });
    row.addEventListener('focus', () => slide(row, 'middle'));
    row.addEventListener('blur', () => slide(row, 'top'));
  });

  const years = [...new Set(rows.map(row => row.querySelector('time')?.getAttribute('datetime')?.slice(0, 4)).filter(Boolean))].sort((a,b) => b.localeCompare(a));
  const optionMarkup = (label, value, kind) => `<button class="project-filter-option" type="button" data-option-kind="${kind}" data-option-value="${value}" aria-pressed="false"><span class="project-option-mark" aria-hidden="true"></span><span>${label}</span></button>`;
  yearMenu.innerHTML = optionMarkup('不限日期','all','year-all') + years.map(year => optionMarkup(year,year,'year')).join('');

  function setYearMenu(open){
    yearDropdown.classList.toggle('open',open);
    yearTrigger.setAttribute('aria-expanded',String(open));
    yearMenu.hidden=!open;
  }
  function syncYearFilter(){
    yearMenu.querySelectorAll('[data-option-kind]').forEach(option => {
      const selected = option.dataset.optionKind === 'year-all' ? selectedYears.size === 0 : selectedYears.has(option.dataset.optionValue);
      option.classList.toggle('selected',selected);
      option.setAttribute('aria-pressed',String(selected));
    });
    const selected = [...selectedYears].sort((a,b) => b.localeCompare(a));
    yearSummary.textContent = selected.length === 0 ? '不限日期' : selected.length === 1 ? selected[0] : `${selected[0]}..+${selected.length-1}`;
    rows.forEach(row => {
      const year = row.querySelector('time')?.getAttribute('datetime')?.slice(0, 4);
      row.hidden = selectedYears.size > 0 && !selectedYears.has(year);
      if(!row.hidden) measure(row);
    });
  }
  yearTrigger?.addEventListener('click',() => setYearMenu(yearMenu.hidden));
  yearMenu?.addEventListener('click',event => {
    const option=event.target.closest('[data-option-kind]'); if(!option)return;
    if(option.dataset.optionKind==='year-all')selectedYears.clear();
    else{const year=option.dataset.optionValue;selectedYears.has(year)?selectedYears.delete(year):selectedYears.add(year)}
    syncYearFilter();
  });
  document.addEventListener('click',event => {if(!event.target.closest('[data-news-year-dropdown]'))setYearMenu(false)});
  document.addEventListener('keydown',event => {if(event.key==='Escape')setYearMenu(false)});
  syncYearFilter();

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => rows.forEach(measure), 100);
  });
})();
