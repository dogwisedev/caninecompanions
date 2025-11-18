document.addEventListener('DOMContentLoaded', () => {
  console.log('Search JS loaded!');
  let trainers = [];

  // Load trainers.json
  fetch('trainers.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      trainers = data;
      console.log(`Loaded ${trainers.length} trainers!`);
    })
    .catch(err => {
      console.error('Failed to load trainers.json:', err);
      const noMsg = document.getElementById('noResults');
      if (noMsg) {
        noMsg.textContent = 'Error loading trainer data. Please refresh the page.';
        noMsg.style.display = 'block';
      }
    });

  const input   = document.getElementById('zipInput');
  const btn     = document.getElementById('searchBtn');
  const results = document.getElementById('results');
  const noMsg   = document.getElementById('noResults');

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

    fetch(`https://api.zippopotam.us/us/${query}`)
      .then(r => r.ok ? r.json() : Promise.reject('Invalid ZIP'))
      .then(data => {
        const searchLat = parseFloat(data.places[0].latitude);
        const searchLng = parseFloat(data.places[0].longitude);

        const nearby = [];
        const online = [];

        trainers.forEach(t => {
          if (!t.lat || !t.lng) return;
          const distance = getDistance(searchLat, searchLng, t.lat, t.lng);

          if (distance <= 50) {
            nearby.push({ ...t, distance: Math.round(distance) });
          } else if (t.online === true) {
            online.push(t);
          }
        });

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

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const toRad = x => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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

    // ——— IN-PERSON TRAINERS ———
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

      const row = document.createElement('div');
      row.className = 'row';
      results.appendChild(row);

      nearby.forEach(t => appendCard(t, true, row));
    }

    // ——— ONLINE TRAINERS ———
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

      const row = document.createElement('div');
      row.className = 'row';
      results.appendChild(row);

      online.forEach(t => appendCard(t, false, row));
    }
  }

  // Reusable card builder – now supports custom row target
function appendCard(t, isNearby, targetRow = results) {
  const col = document.createElement('div');
  col.className = 'col-sm-6 col-md-4 col-lg-4';

  const badge = isNearby
    ? `<span style="background:#808f71;color:white;padding:2px 8px;font-size:11px;border-radius:3px;">${t.distance} miles away</span>`
    : `<span style="background:#17a2b8;color:white;padding:2px 8px;font-size:11px;border-radius:3px;">Online Only</span>`;

  col.innerHTML = `
    <div class="box">
      <div class="img-box">
        <img src="${t.image || 'images/p1.png'}" alt="${t.name}">
      </div>
      <div class="detail-box">
        <h5>${t.name} ${badge}</h5>
        <h6>
          $${t.price || '??'}/session<br>
          <small>
            ${t.region || t.city || 'Local Area'}, ${t.state || 'USA'} • ${t.timezone || 'N/A'}
            ${t.online ? ' • Online Available' : ''}
          </small>
        </h6>
      </div>
      <div class="option_container">
        <div class="options">
          <a href="trainer.html?slug=${t.slug}" class="option1">Book Training</a>
          <a href="trainer.html?slug=${t.slug}" class="option2">View Profile</a>
        </div>
      </div>
    </div>
  `;
  targetRow.appendChild(col);
}

  // Event listeners
  if (btn) btn.addEventListener('click', search);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        search();
      }
    });
  }

  console.log('Search ready!');
});
