
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

// GALERIA FATALITY — klipy pobierane z Discorda
(async () => {
  const grid = document.getElementById('clip-grid');
  const empty = document.getElementById('clips-empty');
  const count = document.getElementById('clip-count');

  if (!grid || !empty || !count) return;

  function makeClipCard(clip, index) {
  const card = document.createElement('a');

  card.className = 'clip-card clip-poster';
  card.href = clip.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.setAttribute('aria-label', `Otwórz klip numer ${index + 1}`);

  const number = String(index + 1).padStart(2, '0');

  card.innerHTML = `
    <div class="clip-poster-bg"></div>
    <div class="clip-poster-top">
      <span>FATALITY // HIGHLIGHT</span>
      <span>MEDAL.TV</span>
    </div>

    <div class="clip-poster-content">
      <span class="clip-poster-label">BEST MOMENTS</span>
      <div class="clip-poster-number">CLIP <span>#${number}</span></div>
      <div class="clip-poster-line"></div>
      <span class="clip-poster-play">▶ OGLĄDAJ KLIP</span>
    </div>

    <div class="clip-poster-bottom">
      <span>FATALITY CS2 TEAM</span>
      <span>OPEN HIGHLIGHT ↗</span>
    </div>
  `;

  return card;
}

    // Stopka
    const foot = document.createElement('div');
    foot.className = 'clip-card-foot';

    if (validUrl) {
      const open = document.createElement('a');
      open.href = validUrl;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'OTWÓRZ NA MEDAL.TV ↗';
      foot.appendChild(open);
    }

    card.append(head, frame, foot);
    return card;
  }

  async function loadClips() {
    try {
      const response = await fetch('/api/clips', {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('API unavailable');
      }

      const clips = await response.json();

      if (!Array.isArray(clips)) {
        throw new Error('Invalid clips data');
      }

      grid.querySelectorAll('.clip-card').forEach(card => card.remove());

      count.textContent = String(clips.length).padStart(2, '0');
      empty.hidden = clips.length > 0;

      clips.forEach((clip, index) => {
        grid.appendChild(makeClipCard(clip, index));
      });

    } catch (error) {
      count.textContent = '—';
      empty.hidden = false;

      const strong = empty.querySelector('strong');
      const span = empty.querySelector('span:last-child');

      if (strong) strong.textContent = 'GALERIA NIEDOSTĘPNA';

      if (span) {
        span.textContent =
          'Nie udało się pobrać klipów. Spróbuj ponownie za chwilę.';
      }
    }
  }

  await loadClips();

  // Automatyczne odświeżanie galerii co 30 sekund
  window.setInterval(loadClips, 30000);
})();
