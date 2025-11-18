document.addEventListener('DOMContentLoaded', () => {
  console.log('Search JS loaded!'); // Debug: Confirms JS runs
  let trainers = [];

  // Load trainers.json
  fetch('trainers.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      trainers = data;
      console.log(`Loaded ${trainers.length} trainers!`); // Debug: Data loaded
    })
    .catch(err => {
      console.error('Failed to load trainers.json:', err);
      const noMsg = document.getElementById('noResults');
      if (noMsg) {
        noMsg.textContent = 'Error loading trainer data. Please refresh the page.';
        noMsg.style.display = 'block';
      }
    });

  // DOM elements
  const input   = document.getElementById('zipInput');
  const btn     = document.getElementById('searchBtn');
  const results = document.getElementById('results');
  const noMsg   = document.getElementById('noResults');

  // ──────────────────────────────────────────────────────────────
  // MAIN SEARCH FUNCTION – NOW WITH 50-MILE + ONLINE SUPPORT
  // ──────────────────────────────────────────────────────────────
  function search() {
    const query = input.value.trim();
    console.log(`Searching for ZIP: ${query}`);

    if (!/^\d{5}$/.test(query)) {
      alert('Please enter a valid 5-digit ZIP code.');
      return;
    }
    if (trainers.length === 0) {
      alert('Trainer data is still loading… Please try again in a moment!');
      return;
    }

    // 1. Get coordinates of the searched ZIP
    fetch(`https://api.zippopotam.us/us/${query}`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid ZIP'))
      .then(data => {
        const searchLat = parseFloat(data.places[0].latitude);
        const searchLng = parseFloat(data.places[0].longitude);

        const nearby = [];      // ≤50 miles
        const online = [];      // online = true, even if far away

        trainers.forEach(t => {
          // Skip if trainer has no coordinates
          if (!t.lat || !t.lng) return;

          const distance = getDistance(searchLat, searchLng, t.lat, t.lng);

          if (distance <= 50) {
            nearby.push({ ...t, distance: Math.round(distance) });
          } else if (t.online === true) {
            online.push(t);
          }
        });

        // Sort nearby by distance (closest first)
        nearby.sort((a, b) => a.distance - b.distance);

        renderResults(nearby, online);
      })
      .catch(err => {
        console.error(err);
        if (noMsg) {
          noMsg.textContent = 'Invalid ZIP code or location service unavailable.';
          noMsg.style.display = 'block';
        }
      });
  }

  // Haversine formula – distance in miles
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const toRad = x => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Render both sections
  function renderResults(nearby, online) {
    results.innerHTML = '';
    if (noMsg) noMsg.style.display = 'none';

    if (nearby.length === 0 && online.length === 0) {
      if (noMsg) {
        noMsg.textContent = 'No trainers found in your area.';
        noMsg.style.display = 'block';
      }
      return;
    }

    // ——— Nearby Trainers (≤50 miles) ———
  if (nearby.length > 0) {
  const header = document.createElement('div');
  header.className = 'col-12 text-center mt-5';
  header.innerHTML = `
    <div class="heading_container heading_center">
      <h2>In-Person <span>Trainers</span></h2>
    </div>
    <hr style="max-width: 300px; margin: 30px auto; border-color: #808f71;">
  `;
  results.appendChild(header);

  nearby.forEach(t => appendCard(t, true));
}

// ——— Online Trainers (any distance) ———
if (online.length > 0) {
  const header = document.createElement('div');
  header.className = 'col-12 text-center mt-5';
  header.innerHTML = `
    <div class="heading_container heading_center">
      <h2>Available for <span>Online Training</span></h2>
    </div>
    <hr style="max-width: 300px; margin: 30px auto; border-color: #808f71;">
  `;
  results.appendChild(header);

  online.forEach(t => appendCard(t, false));
}

  // Reusable card builder
  function appendCard(t, isNearby) {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4 mb-4';

    const badge = isNearby
      ? `<span class="badge bg-success ms-2">${t.distance} miles away</span>`
      : `<span class="badge bg-info ms-2">Online Only</span>`;

    const location = isNearby
      ? `${t.city || 'N/A'}, ${t.state || ''}`
      : `${t.city || 'Remote'}, ${t.state || 'USA'}`;

    col.innerHTML = `
      <div class="trainer-result-card">
        <img src="${t.image || ''}" alt="${t.name}" class="trainer-result-img"
             onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        <div class="trainer-result-info">
          <h3 class="trainer-result-name">${t.name} ${badge}</h3>
          <p class="trainer-result-region">
            ${location} • ${t.timezone || 'N/A'}
            ${t.online ? ' <small class="text-success">(Online Available)</small>' : ''}
          </p>
          <p class="trainer-result-price">${t.price ? `$${t.price}/session` : 'Price on request'}</p>
          <p class="trainer-result-blurb">${t.blurb || 'Certified professional dog trainer'}</p>
          <a href="trainer.html?slug=${t.slug}" class="book-now-btn">Book Now</a>
        </div>
      </div>
    `;
    results.appendChild(col);
  }

  // ──────────────────────────────────────────────────────────────
  // Event listeners (unchanged)
  // ──────────────────────────────────────────────────────────────
  if (btn) btn.addEventListener('click', search);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        search();
      }
    });
  }

  console.log('Search ready!'); // Debug: Setup complete
});
