const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

// Shared gallery: the Discord bot writes clips to the site's API.
(async () => {
  const grid = document.getElementById('clip-grid');
  const empty = document.getElementById('clips-empty');
  const count = document.getElementById('clip-count');
  if (!grid || !empty || !count) return;

  function makeClipCard(clip, index) {
    const card = document.createElement('a');
    card.className = 'clip-card';
    card.href = clip.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Otwórz klip FATALITY numer ${index + 1} na Medal.tv`);

    const artwork = document.createElement('img');
    artwork.className = 'clip-card-art';
    artwork.src = 'assets/clip-card-bg.png';
    artwork.alt = '';
    artwork.loading = 'lazy';

    card.appendChild(artwork);
    return card;
  }

  async function loadClips() {
    try {
      const response = await fetch('/api/clips', { cache: 'no-store' });
      if (!response.ok) throw new Error('API unavailable');
      const clips = await response.json();
      grid.querySelectorAll('.clip-card').forEach(card => card.remove());
      count.textContent = String(clips.length).padStart(2, '0');
      empty.hidden = clips.length > 0;
      clips.forEach((clip, index) => grid.appendChild(makeClipCard(clip, index)));
    } catch (error) {
      count.textContent = '—';
      empty.hidden = false;
      empty.querySelector('strong').textContent = 'GALERIA NIEDOSTĘPNA';
      empty.querySelector('span:last-child').textContent =
        'Serwer galerii nie jest jeszcze uruchomiony. Skonfiguruj bota Discord zgodnie z instrukcją w paczce strony.';
    }
  }

  await loadClips();
  // Refresh automatically when new links are posted in the Discord channel.
  window.setInterval(loadClips, 30000);
})();
