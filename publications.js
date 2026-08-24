(() => {
  const filter = document.querySelector('[data-publication-year]');
  const cards = [...document.querySelectorAll('.publication-card')];
  if(!filter)return;
  filter.addEventListener('change', () => {
    cards.forEach(card => card.classList.toggle('is-hidden', filter.value !== 'all' && card.dataset.year !== filter.value));
  });
})();
