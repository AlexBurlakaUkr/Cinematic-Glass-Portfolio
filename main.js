// Main logic for Cinematic Glass Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Portfolio Data
  initializeHeroSection();

  // 2. Add Premium Interactive Effects
  initParallaxEffect();
});

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
