const active=document.body.dataset.page||'';
if(!document.querySelector('link[href^="nav-unified.css"]')){
  const unifiedNav=document.createElement('link');
  unifiedNav.rel='stylesheet';unifiedNav.href='nav-unified.css?v=7';
  const artDirection=document.querySelector('link[href="art-direction.css"]');
  artDirection?artDirection.before(unifiedNav):document.head.append(unifiedNav);
}
const header=`<header class="make-header" data-header><a class="make-logo" href="home.html" aria-label="胡氏藝術首頁"><img src="assets/husart-logo.svg" alt=""></a><nav class="make-nav" aria-label="主要導覽"><a data-nav="home" href="home.html">首頁</a><a data-nav="about" href="index.html">關於我們</a><a data-nav="projects" href="projects.html">執行專案</a><a data-nav="artists" href="artists.html">合作藝術家</a><a data-nav="news" href="news.html">最新消息</a><a data-nav="publications" href="publications.html">出版</a></nav><div class="lang language-switch" aria-label="目前語言：中文"><span class="is-active" aria-current="true">CN</span><span>EN</span></div><button type="button" class="make-menu" data-menu aria-label="開啟選單" aria-expanded="false"></button></header><div class="make-drawer" data-drawer aria-hidden="true"><nav><a href="home.html">首頁</a><a href="index.html">關於我們</a><a href="projects.html">執行專案</a><a href="artists.html">合作藝術家</a><a href="news.html">最新消息</a><a href="publications.html">出版</a></nav><a href="mailto:husart@husart.net">husart@husart.net</a></div>`;
const footer=`<footer class="make-footer"><div class="wordmark">HU'S ART</div><div><p>ART CONSULTING<br>CURATION<br>PUBLIC ART</p></div><div><a href="mailto:husart@husart.net">husart@husart.net</a><p>+886 2 2578 5467<br>TAIPEI · TAIWAN</p></div></footer>`;
const headerTarget=document.querySelector('[data-shell-header]');if(headerTarget)headerTarget.outerHTML=header;
const footerTarget=document.querySelector('[data-shell-footer]');if(footerTarget)footerTarget.outerHTML=footer;
const activeLink=document.querySelector(`[data-nav="${active}"]`);
activeLink?.classList.add('active');
activeLink?.setAttribute('aria-current','page');
