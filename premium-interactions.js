/* premium-interactions.js */
document.addEventListener('DOMContentLoaded', () => {
    // Feature flag check
    const isPremiumEnabled = document.body.getAttribute('data-premium') === 'true';
    if (!isPremiumEnabled) return;

    // Apply scroll reveal utility classes to both homepage and templates library cards
    const floatingSections = document.querySelectorAll('#featured, #templates-section');
    floatingSections.forEach(section => {
        section.querySelectorAll('.template-card, .price-card').forEach((el, index) => {
            el.classList.add('scroll-fade-card');
            el.style.setProperty('--card-delay', `${(index % 3) * 0.15 + 0.1}s`);
            el.style.setProperty('--float-delay', `${(index % 4) * 0.18}s`);
        });
    });

    // 1. Scroll-trigger Observer
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                tlObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('#featured .scroll-fade-card, #templates-section .scroll-fade-card').forEach(el => tlObserver.observe(el));

    // 2. Continuous 3D Hover & Glow tracking
    document.addEventListener('mousemove', (e) => {
        const activeCard = Array.from(document.querySelectorAll('#featured .template-card:hover, #templates-section .template-card:hover')).pop();
        if (activeCard) {
            const rect = activeCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            activeCard.style.setProperty('--mouse-x', `${x}px`);
            activeCard.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;

            activeCard.style.setProperty('--rotate-x', `${rotateX}deg`);
            activeCard.style.setProperty('--rotate-y', `${rotateY}deg`);
        }
    });

    // Reset loop
    document.querySelectorAll('#featured .template-card, #templates-section .template-card').forEach(card => {
        card.addEventListener('mouseleave', () => {
             card.style.transform = 'translateY(0) scale(1) perspective(1000px) rotateX(0) rotateY(0)';
             card.style.setProperty('--rotate-x', '0deg');
             card.style.setProperty('--rotate-y', '0deg');
        });
    });
});
