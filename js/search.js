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

  // Main search function
  function search() {
    const query = input.value.trim();
    console.log(`Searching for ZIP: ${query}`);

    // Validate 5-digit ZIP
    if (!/^\d{5}$/.test(query)) {
      alert('Please enter a valid 5-digit ZIP code.');
      return;
    }

    // Wait for data if still loading
    if (trainers.length === 0) {
      alert('Trainer data is still loading… Please try again in a moment!');
      return;
    }

    // Find exact ZIP matches (ZIPs in JSON are strings)
    const matches = trainers.filter(t => t.zip === query);
    console.log(`Found ${matches.length} match(es)`);

    // Clear previous results
    results.innerHTML = '';
    if (noMsg) noMsg.style.display = 'none';

    if (matches.length === 0) {
      if (noMsg) {
        noMsg.textContent = `No trainers found for ZIP ${query}. Try a nearby area!`;
        noMsg.style.display = 'block';
      }
      return;
    }

    // Render each matched trainer
    matches.forEach(t => {
      const col = document.createElement('div');
      // Fixed: now matches the rest of your site (3 cards per row on large screens)
      col.className = 'col-sm-6 col-md-4 col-lg-4';

      col.innerHTML = `
        <div class="trainer-result-card">
          <img src="${t.image || ''}" 
               alt="${t.name}" 
               class="trainer-result-img"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
          <div class="trainer-result-info">
            <h3 class="trainer-result-name">${t.name}</h3>
            <p class="trainer-result-region">${t.region || 'USA'} • ${t.timezone || 'N/A'}</p>
            <p class="trainer-result-price">${t.price ? `$${t.price}/session` : 'Price on request'}</p>
            <p class="trainer-result-blurb">${t.blurb || 'Certified professional dog trainer'}</p>
            <a href="trainer.html?slug=${t.slug}" class="book-now-btn">Book Now</a>
          </div>
        </div>
      `;

      results.appendChild(col);
    });

    console.log('Search complete – results rendered');
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

  console.log('Search ready!'); // Debug: Setup complete
});
