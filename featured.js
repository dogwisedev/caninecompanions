document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('featured-trainers-grid');

    fetch('trainers.json')
        .then(response => response.json())
        .then(trainers => {
            // This takes the first 9 trainers from your JSON
            const featured = trainers.slice(0, 9);

            featured.forEach(trainer => {
                const col = document.createElement('div');
                // These are YOUR exact classes for sizing
                col.className = 'col-sm-6 col-md-4 col-lg-4';
                
                col.innerHTML = `
                    <div class="box">
                       <div class="option_container">
                          <div class="options">
                             <a href="trainers/${trainer.slug}/" class="option1">
                                Book Training
                             </a>
                             <a href="trainers/${trainer.slug}/" class="option2">
                                View Profile
                             </a>
                          </div>
                       </div>
                       <div class="img-box">
                          <img src="${trainer.image}" alt="${trainer.name}">
                       </div>
                       <div class="detail-box">
                          <h5>${trainer.name}</h5>
                          <h6>$${trainer.price || '75'}</h6>
                       </div>
                    </div>
                `;
                grid.appendChild(col);
            });
        })
        .catch(err => console.error("Error feeding the trainer quad:", err));
});
