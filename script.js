
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
    const card = document.createElement('article');
    card.className = 'clip-card';

    // Nagłówek
    const head = document.createElement('div');
    head.className = 'clip-card-head';

    const label = document.createElement('span');
    label.textContent = 'FATALITY // HIGHLIGHT';

    const number = document.createElement('span');
    number.textContent = `CLIP ${String(index + 1).padStart(2, '0')}`;

    head.append(label, number);

    // Panel zamiast blokowanego iframe
    const frame = document.createElement('div');
    frame.className = 'clip-frame clip-external';

    const content = document.createElement('div');
    content.className = 'clip-external-content';

    const logo = document.createElement('div');
    logo.className = 'clip-external-logo';
    logo.textContent = 'F';

    const title = document.createElement('h3');
    title.textContent = 'FATALITY HIGHLIGHT';

    const description = document.createElement('p');
    description.textContent =
      'Zobacz akcję naszej drużyny na Medal.tv';

    content.append(logo, title, description);

    // Bezpieczny link do Medal.tv
    const clipUrl = clip.url || '';
    let validUrl = '';

    try {
      const parsed = new URL(clipUrl);
      if (
        parsed.protocol === 'https:' &&
        (parsed.hostname === 'medal.tv' ||
         parsed.hostname.endsWith('.medal.tv'))
      ) {
        validUrl = parsed.href;
      }
    } catch (error) {
      validUrl = '';
    }

    if (validUrl) {
      const play = document.createElement('a');
      play.className = 'clip-play-button';
      play.href = validUrl;
      play.target = '_blank';
      play.rel = 'noopener noreferrer';
      play.textContent = '▶ ODTWÓRZ KLIP';

      content.appendChild(play);
    } else {
      const unavailable = document.createElement('p');
      unavailable.textContent = 'Link do klipu jest niedostępny.';
      content.appendChild(unavailable);
    }

    frame.appendChild(content);

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
