/* ========== search.js – ZIP CODE TRAINER SEARCH ========== */

let trainers = [];

// Load trainers.json once when the page loads
fetch('trainers.json')
  .then(response => response.json())
  .then(data => {
    trainers = data;
    console.log(`Loaded ${trainers.length} trainers`);
  })
  .catch(err => {
    console.error('Could not load trainers.json', err);
    alert('Oops! Trainer data failed to load. Please refresh the page.');
  });

// Grab DOM elements
const input   = document.getElementById('zipInput');
const btn     = document.getElementById('searchBtn');
const results = document.getElementById('results');
const noMsg   = document.getElementById('noResults');

// Main search function
function performSearch() {
  const query = input.value.trim();

  // Validate 5-digit ZIP
  if (!/^\d{5}$/.test(query)) {
    alert('Please enter a valid 5-digit ZIP code.');
    return;
  }

  // Find matching trainers
  const matches = trainers.filter(t => t.zip === query);

  // Clear previous results
  results.innerHTML = '';
  results.style.display = 'none';
  noMsg.style.display = 'none';

  if (matches.length === 0) {
    noMsg.textContent = `No trainers found for ZIP ${query}. Try a nearby area!`;
    noMsg.style.display = 'block';
    return;
  }

  // Create a beautiful card for each trainer
  matches.forEach(trainer => {
    const card = document.createElement('div');
    card.className = 'trainer-card';

    card.innerHTML = `
      <img src="${trainer.image}" alt="${trainer.name}" class="trainer-img"
           onerror="this.src='https://via.placeholder.com/300x180/0066cc/white?text=${trainer.name}'">
      <div class="trainer-info">
        <h3 class="trainer-name">${trainer.name}</h3>
        <p class="trainer-region">${trainer.region} • ${trainer.timezone}</p>
        <p class="trainer-price">${trainer.price}/session</p>
        <p class="trainer-blurb">${trainer.blurb}</p>
        <a href="trainer.html?slug=${trainer.slug}" class="book-btn">Book Now</a>
      </div>
    `;

    results.appendChild(card);
  });

  // Show the grid
  results.style.display = 'grid';
}

// Click button OR press Enter
btn.addEventListener('click', performSearch);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') performSearch();
});
