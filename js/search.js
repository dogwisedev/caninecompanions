document.addEventListener('DOMContentLoaded', () => {
  console.log('Search JS loaded!');  // ← Debug: Confirms JS runs

  let trainers = [];

  // Load trainers with debug
  fetch('trainers.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      trainers = data;
      console.log(`✅ Loaded ${trainers.length} trainers!`);  // ← Debug: Shows count
    })
    .catch(err => {
      console.error('❌ Failed to load trainers.json:', err);  // ← Debug: Shows exact error
      // Optional: Show user-friendly message
      document.getElementById('noResults').textContent = 'Error loading trainer data. Please refresh.';
      document.getElementById('noResults').style.display = 'block';
    });

  const input = document.getElementById('zipInput');
  const btn = document.getElementById('searchBtn');
  const results = document.getElementById('results');
  const noMsg = document.getElementById('noResults');

  function search() {
    const query = input.value.trim();
    console.log(`🔍 Searching for ZIP: ${query}`);  // ← Debug: Confirms search triggers

    if (!/^\d{5}$/.test(query)) {
      alert('Please enter a valid 5-digit ZIP code.');
      return;
    }

    if (trainers.length === 0) {
      alert('Trainer data still loading... Try again in a sec!');
      return;
    }

    const matches = trainers.filter(t => t.zip === query);
    console.log(`📊 Found ${matches.length} matches`);  // ← Debug: Shows results count

    results.innerHTML = '';
    noMsg.style.display = 'none';

    if (matches.length === 0) {
      noMsg.textContent = `No trainers found for ZIP ${query}. Try a nearby area!`;
      noMsg.style.display = 'block';
      return;
    }

    matches.forEach(t => {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3';

      col.innerHTML = `
        <div class="trainer-result-card">
          <img src="${t.image}" alt="${t.name}" class="trainer-result-img" 
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="trainer-result-info">
            <h3 class="trainer-result-name">${t.name}</h3>
            <p class="trainer-result-region">${t.region} • ${t.timezone}</p>
            <p class="trainer-result-price">${t.price}/session</p>
            <p class="trainer-result-blurb">${t.blurb}</p>
            <a href="trainer.html?slug=${t.slug}" class="book-now-btn">Book Now</a>
          </div>
        </div>
      `;

      results.appendChild(col);
    });
  }

  // Event listeners
  if (btn) btn.addEventListener('click', search);
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter') search();
  });

  console.log('🎯 Search ready!');  // ← Debug: Confirms setup
});
