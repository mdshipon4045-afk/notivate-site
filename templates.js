/* =========================================================
   templates.js — Filter Logic for Templates Page
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const filterButtons = document.querySelectorAll('.filter-btn');
  const templateCards = document.querySelectorAll('.template-card[data-category]');
  const countEl = document.getElementById('template-count');

  function updateCount(available, comingSoon) {
    if (!countEl) return;
    let text = `Showing <strong>${available}</strong> available template${available !== 1 ? 's' : ''}`;
    if (comingSoon > 0) {
      text += ` <span style="color:var(--text-faint); font-size:0.9em;">(+${comingSoon} coming soon)</span>`;
    }
    countEl.innerHTML = text;
  }

  function filterTemplates(filter) {
    let availableCount = 0;
    let comingSoonCount = 0;
    
    templateCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const price = card.dataset.price;
      const isComingSoon = card.classList.contains('coming-soon');
      let show = false;
      
      if (filter === 'all') {
        show = true;
      } else if (filter === 'free') {
        show = price === 'free';
      } else if (filter === 'paid') {
        show = price === 'paid';
      } else {
        show = categories.includes(filter);
      }
      
      if (show) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease';
        if (isComingSoon) {
          comingSoonCount++;
        } else {
          availableCount++;
        }
      } else {
        card.style.display = 'none';
      }
    });
    updateCount(availableCount, comingSoonCount);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterTemplates(btn.dataset.filter);
    });
  });

  // Init count
  filterTemplates('all');

  // CSS for fadeIn
  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }';
  document.head.appendChild(style);

});
