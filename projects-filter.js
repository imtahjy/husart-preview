(() => {
  const bar=document.querySelector('[data-project-filterbar]');
  if(!bar||typeof PROJECTS==='undefined')return;

  const cards=[...document.querySelectorAll('.make-project-card')];
  const categoryButtons=[...bar.querySelectorAll('[data-filter]')];
  const yearDropdown=bar.querySelector('[data-year-dropdown]');
  const yearTrigger=bar.querySelector('[data-year-trigger]');
  const yearMenu=bar.querySelector('[data-year-menu]');
  const yearSummary=bar.querySelector('[data-year-summary]');
  const typeDropdown=bar.querySelector('[data-type-dropdown]');
  const typeTrigger=bar.querySelector('[data-type-trigger]');
  const typeMenu=bar.querySelector('[data-type-menu]');
  const typeSummary=bar.querySelector('[data-type-summary]');
  const publicTypes=['室外','室內','平面','雕塑','新媒體','懸吊','壁面'];
  const selectedYears=new Set();
  const selectedTypes=new Set();
  let activeCategory='all';

  const optionMarkup=(label,value,kind,years='')=>`<button class="project-filter-option" type="button" data-option-kind="${kind}" data-option-value="${value}"${years?` data-option-years="${years}"`:''} aria-pressed="false"><span class="project-option-mark" aria-hidden="true"></span><span>${label}</span></button>`;

  function yearGroups(){
    const years=[...new Set(PROJECTS.map(project=>Number(project.year)).filter(Number.isFinite))].sort((a,b)=>b-a);
    if(!years.length)return [];
    const recentCutoff=years[0]-4;
    const groups=years.filter(year=>year>=recentCutoff).map(year=>({label:String(year),years:[year]}));
    const buckets=new Map();
    years.filter(year=>year<recentCutoff).forEach(year=>{
      const start=2008+Math.floor((year-2008)/5)*5;
      const end=Math.min(start+4,recentCutoff-1);
      const key=`${start}-${end}`;
      if(!buckets.has(key))buckets.set(key,{label:`${start}–${end}`,years:[]});
      buckets.get(key).years.push(year);
    });
    return groups.concat([...buckets.values()].sort((a,b)=>b.years[0]-a.years[0]));
  }

  yearMenu.innerHTML=optionMarkup('不限日期','all','year-all')+yearGroups().map(group=>optionMarkup(group.label,group.label,'year',group.years.join(','))).join('');
  typeMenu.innerHTML=optionMarkup('不限類型','all','type-all')+publicTypes.map(type=>optionMarkup(type,type,'type')).join('');

  function setMenu(dropdown,trigger,menu,open){
    dropdown.classList.toggle('open',open);
    trigger.setAttribute('aria-expanded',String(open));
    menu.hidden=!open;
  }
  function closeMenus(except=null){
    if(except!==yearDropdown)setMenu(yearDropdown,yearTrigger,yearMenu,false);
    if(except!==typeDropdown&&!typeDropdown.hidden)setMenu(typeDropdown,typeTrigger,typeMenu,false);
  }
  function syncOptions(){
    yearMenu.querySelectorAll('[data-option-kind]').forEach(option=>{
      const years=(option.dataset.optionYears||'').split(',').filter(Boolean);
      const selected=option.dataset.optionKind==='year-all'?selectedYears.size===0:years.length>0&&years.every(year=>selectedYears.has(year));
      option.classList.toggle('selected',selected);
      option.setAttribute('aria-pressed',String(selected));
    });
    typeMenu.querySelectorAll('[data-option-kind]').forEach(option=>{
      const selected=option.dataset.optionKind==='type-all'?selectedTypes.size===0:selectedTypes.has(option.dataset.optionValue);
      option.classList.toggle('selected',selected);
      option.setAttribute('aria-pressed',String(selected));
    });
    const selectedYearLabels=[...yearMenu.querySelectorAll('[data-option-kind="year"].selected')].map(option=>option.dataset.optionValue);
    const selectedTypeLabels=[...selectedTypes];
    const selectionSummary=(items,fallback)=>items.length===0?fallback:items.length===1?items[0]:`${items[0]}..+${items.length-1}`;
    yearSummary.textContent=selectionSummary(selectedYearLabels,'不限日期');
    typeSummary.textContent=selectionSummary(selectedTypeLabels,'不限類型');
  }
  function filterProjects(){
    cards.forEach(card=>{
      const categoryMatch=activeCategory==='all'||card.dataset.category===activeCategory;
      const yearMatch=selectedYears.size===0||selectedYears.has(card.dataset.year);
      const tags=(card.dataset.publicTypes||'').split(',').filter(Boolean);
      const typeMatch=activeCategory!=='public'||selectedTypes.size===0||tags.some(tag=>selectedTypes.has(tag));
      card.classList.toggle('hidden',!(categoryMatch&&yearMatch&&typeMatch));
    });
  }

  yearTrigger.addEventListener('click',()=>{const open=yearMenu.hidden;closeMenus(yearDropdown);setMenu(yearDropdown,yearTrigger,yearMenu,open)});
  typeTrigger.addEventListener('click',()=>{const open=typeMenu.hidden;closeMenus(typeDropdown);setMenu(typeDropdown,typeTrigger,typeMenu,open)});
  yearMenu.addEventListener('click',event=>{
    const option=event.target.closest('[data-option-kind]');if(!option)return;
    if(option.dataset.optionKind==='year-all')selectedYears.clear();
    else{
      const years=option.dataset.optionYears.split(',');
      const remove=years.every(year=>selectedYears.has(year));
      years.forEach(year=>remove?selectedYears.delete(year):selectedYears.add(year));
    }
    syncOptions();filterProjects();
  });
  typeMenu.addEventListener('click',event=>{
    const option=event.target.closest('[data-option-kind]');if(!option)return;
    if(option.dataset.optionKind==='type-all')selectedTypes.clear();
    else{const value=option.dataset.optionValue;selectedTypes.has(value)?selectedTypes.delete(value):selectedTypes.add(value)}
    syncOptions();filterProjects();
  });
  categoryButtons.forEach(button=>button.addEventListener('click',()=>{
    categoryButtons.forEach(item=>item.classList.toggle('active',item===button));
    activeCategory=button.dataset.filter;
    const publicActive=activeCategory==='public';
    typeDropdown.hidden=!publicActive;
    if(!publicActive){selectedTypes.clear();setMenu(typeDropdown,typeTrigger,typeMenu,false)}
    syncOptions();filterProjects();
  }));
  document.addEventListener('click',event=>{if(!event.target.closest('.project-dropdown'))closeMenus()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenus()});
  syncOptions();filterProjects();
})();
