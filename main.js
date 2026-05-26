// Main logic for Cinematic Glass Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Portfolio Data
  initializeHeroSection();
  initializeProjectsSection();
  initializeSkillsSection();

  // 2. Add Premium Interactive Effects
  initParallaxEffect();
  initSmoothScroll();
  initCardTiltEffect();
});

/**
 * Creates an interactive 3D tilt effect on the dynamically rendered game cards
 */
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    // Smoothly transition into the initial tilt state on entry (increased duration for 30% smoother ease)
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      
      // Clear any pending transition-clear timeouts
      if (card.dataset.tiltTimeout) {
        clearTimeout(Number(card.dataset.tiltTimeout));
      }
      
      // After the entry transition completes, remove it to enable lag-free real-time tracking
      card.dataset.tiltTimeout = setTimeout(() => {
        card.style.transition = 'none';
        card.dataset.tiltTimeout = '';
      }, 400);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // cursor X relative to card bounds
      const y = e.clientY - rect.top;  // cursor Y relative to card bounds

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Delta off-center
      const deltaX = x - centerX;
      const deltaY = y - centerY;

      // Normalized coordinates (-1 to 1)
      const percentX = deltaX / centerX;
      const percentY = deltaY / centerY;

      // Tilt intensity mapping (range of -10 to +10 degrees)
      const maxTilt = 10;
      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      // Clear the enter timeout if it hasn't fired yet
      if (card.dataset.tiltTimeout) {
        clearTimeout(Number(card.dataset.tiltTimeout));
        card.dataset.tiltTimeout = '';
      }

      // Apply transition for smooth return animation back to center
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}


/**
 * Dynamically builds skill badges from the config portfolioData.skills array
 */
function initializeSkillsSection() {
  if (typeof portfolioData === 'undefined' || !portfolioData.skills) {
    console.error('Skills data is missing from portfolio configuration!');
    return;
  }

  const containerEl = document.getElementById('skills-container');
  if (!containerEl) return;

  containerEl.innerHTML = ''; // Clear initial placeholder

  portfolioData.skills.forEach((skill) => {
    // 1. Create a parent wrapper that handles floating keyframes asynchronously
    const wrapper = document.createElement('div');
    wrapper.className = 'skill-badge-wrapper';
    
    // Stagger float start times using a random delay between 0 and 2.5 seconds
    wrapper.style.animationDelay = `${Math.random() * 2.5}s`;

    // 2. Create the inner badge node that holds glass layout & hover scale mechanics
    const badge = document.createElement('span');
    badge.className = 'skill-badge';
    badge.textContent = skill;

    wrapper.appendChild(badge);
    containerEl.appendChild(wrapper);
  });
}


/**
 * Dynamically builds project cards from the config portfolioData.games array
 */
function initializeProjectsSection() {
  if (typeof portfolioData === 'undefined' || !portfolioData.games) {
    console.error('Games data is missing from portfolio configuration!');
    return;
  }

  const gridEl = document.getElementById('projects-grid');
  if (!gridEl) return;

  gridEl.innerHTML = ''; // Clear initial placeholder

  portfolioData.games.forEach((game) => {
    // Create card container
    const card = document.createElement('div');
    card.className = 'project-card glass-panel';

    // Fallback backdrop (shown while image loads or if loading fails)
    const fallback = document.createElement('div');
    fallback.className = 'card-fallback';
    fallback.innerHTML = `
      <div class="fallback-icon">🎮</div>
      <div class="fallback-title">${game.title}</div>
    `;
    card.appendChild(fallback);

    // Main Cover Image
    const img = document.createElement('img');
    img.src = game.imagePath;
    img.alt = `${game.title} Cover`;
    img.onload = () => img.classList.add('loaded');
    img.onerror = () => {
      img.style.display = 'none'; // Cleanly hide broken image to display the styled fallback
    };
    card.appendChild(img);

    // Text & Button Overlay Wrapper
    const content = document.createElement('div');
    content.className = 'project-card-content';

    const title = document.createElement('h3');
    title.className = 'project-card-title';
    title.textContent = game.title;
    content.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'project-card-description';
    desc.textContent = game.description;
    content.appendChild(desc);

    const btn = document.createElement('a');
    btn.className = 'btn-play-game';
    btn.href = game.playLink;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.innerHTML = `
      <span>Play Game</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    content.appendChild(btn);

    card.appendChild(content);
    gridEl.appendChild(card);
  });
}

/**
 * Wires up smooth scroll behavior for header and navigation buttons
 */
function initSmoothScroll() {
  const exploreBtn = document.getElementById('btn-explore-projects');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}


/**
 * Injects Developer details dynamically from config.js (portfolioData)
 */
function initializeHeroSection() {
  if (typeof portfolioData === 'undefined') {
    console.error('Portfolio configuration data is missing!');
    return;
  }

  const nameEl = document.getElementById('hero-name');
  const specEl = document.getElementById('hero-specialization');
  const subtitleEl = document.getElementById('hero-subtitle');

  if (nameEl && portfolioData.developerName) {
    nameEl.textContent = portfolioData.developerName;
  }
  if (specEl && portfolioData.specialization) {
    specEl.textContent = portfolioData.specialization;
  }
  if (subtitleEl && portfolioData.heroSubtitle) {
    subtitleEl.textContent = portfolioData.heroSubtitle;
  }
}

/**
 * Creates a subtle premium mouse-move interactive parallax/tilt on the hero panel
 */
function initParallaxEffect() {
  const heroContainer = document.querySelector('.hero-container');
  const ambientBackground = document.querySelector('.bg-ambient');
  if (!heroContainer) return;

  // Add event listener for mouse movement on the viewport
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate normalized coordinates (-1 to 1)
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    // Subtle tilt for the main card (max tilt: 3 degrees)
    const maxTilt = 3;
    const tiltX = -y * maxTilt;
    const tiltY = x * maxTilt;

    // Apply smooth styles
    heroContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    
    // Subtle translation for the ambient blobs to enhance depth perception
    if (ambientBackground) {
      const blobs = ambientBackground.querySelectorAll('.bg-glow-blob');
      blobs.forEach((blob, index) => {
        const factor = (index + 1) * 15; // Different factors for depth separation
        const moveX = x * factor;
        const moveY = y * factor;
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }
  });

  // Reset transforms when the mouse leaves the screen
  window.addEventListener('mouseleave', () => {
    heroContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    
    if (ambientBackground) {
      const blobs = ambientBackground.querySelectorAll('.bg-glow-blob');
      blobs.forEach((blob) => {
        blob.style.transform = 'translate(0px, 0px)';
      });
    }
  });
}
