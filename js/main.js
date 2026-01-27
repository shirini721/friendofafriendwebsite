/**
 * Friend of a Friend Dinner
 * Main JavaScript - handles dynamic content and interactions
 */

(function() {
  'use strict';

  // ================================
  // Configuration
  // ================================

  const CONFIG = {
    dataPath: 'data/dinners.json',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric' }
  };

  // ================================
  // DOM Elements
  // ================================

  const elements = {
    dinnersGrid: document.getElementById('dinners-grid'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.querySelector('.lightbox-img'),
    lightboxCaption: document.querySelector('.lightbox-caption'),
    lightboxClose: document.querySelector('.lightbox-close'),
    lightboxPrev: document.querySelector('.lightbox-prev'),
    lightboxNext: document.querySelector('.lightbox-next')
  };

  // ================================
  // State
  // ================================

  let state = {
    dinners: [],
    currentPhotos: [],
    currentPhotoIndex: 0
  };

  // ================================
  // Data Loading
  // ================================

  async function loadDinners() {
    try {
      const response = await fetch(CONFIG.dataPath);
      if (!response.ok) throw new Error('Failed to load dinners');
      const data = await response.json();
      state.dinners = data.dinners || [];
      renderDinners();
    } catch (error) {
      console.error('Error loading dinners:', error);
      renderEmptyState();
    }
  }

  // ================================
  // Rendering
  // ================================

  function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', CONFIG.dateFormat);
  }

  function renderDinners() {
    if (!state.dinners.length) {
      renderEmptyState();
      return;
    }

    // Sort dinners by date (newest first)
    const sortedDinners = [...state.dinners].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    elements.dinnersGrid.innerHTML = sortedDinners.map(dinner => `
      <article class="dinner-entry fade-in" data-dinner-id="${dinner.id}">
        <header class="dinner-header">
          <h3 class="dinner-restaurant">${escapeHtml(dinner.restaurant)}</h3>
          <span class="dinner-meta">${formatDate(dinner.date)} · ${escapeHtml(dinner.location)}</span>
        </header>
        <p class="dinner-description">${escapeHtml(dinner.description)}</p>
        <div class="dinner-photos">
          ${renderPhotos(dinner.photos, dinner.id)}
        </div>
      </article>
    `).join('');

    // Add click handlers to photos
    attachPhotoHandlers();
  }

  function renderPhotos(photos, dinnerId) {
    if (!photos || !photos.length) {
      return '<p class="photo-placeholder">Photos coming soon</p>';
    }

    return photos.map((photo, index) => `
      <div class="photo-item"
           data-dinner-id="${dinnerId}"
           data-photo-index="${index}"
           role="button"
           tabindex="0"
           aria-label="View ${escapeHtml(photo.alt)}">
        <img src="${escapeHtml(photo.src)}"
             alt="${escapeHtml(photo.alt)}"
             loading="lazy"
             onerror="this.parentElement.innerHTML='<div class=\\'photo-placeholder\\'>Photo unavailable</div>'">
      </div>
    `).join('');
  }

  function renderEmptyState() {
    elements.dinnersGrid.innerHTML = `
      <div class="empty-state">
        <p>No dinners yet. The first gathering is coming soon.</p>
      </div>
    `;
  }

  // ================================
  // Lightbox
  // ================================

  function openLightbox(dinnerId, photoIndex) {
    const dinner = state.dinners.find(d => d.id === dinnerId);
    if (!dinner || !dinner.photos) return;

    state.currentPhotos = dinner.photos;
    state.currentPhotoIndex = photoIndex;

    updateLightboxImage();
    elements.lightbox.classList.add('active');
    elements.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    elements.lightbox.classList.remove('active');
    elements.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const photo = state.currentPhotos[state.currentPhotoIndex];
    if (!photo) return;

    elements.lightboxImg.src = photo.src;
    elements.lightboxImg.alt = photo.alt;
    elements.lightboxCaption.textContent = photo.alt;

    // Update navigation visibility
    elements.lightboxPrev.style.display = state.currentPhotos.length > 1 ? 'block' : 'none';
    elements.lightboxNext.style.display = state.currentPhotos.length > 1 ? 'block' : 'none';
  }

  function navigateLightbox(direction) {
    const total = state.currentPhotos.length;
    state.currentPhotoIndex = (state.currentPhotoIndex + direction + total) % total;
    updateLightboxImage();
  }

  // ================================
  // Event Handlers
  // ================================

  function attachPhotoHandlers() {
    const photoItems = document.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
      const handler = () => {
        const dinnerId = item.dataset.dinnerId;
        const photoIndex = parseInt(item.dataset.photoIndex, 10);
        openLightbox(dinnerId, photoIndex);
      };

      item.addEventListener('click', handler);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  function setupLightboxEvents() {
    // Close button
    elements.lightboxClose.addEventListener('click', closeLightbox);

    // Navigation
    elements.lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    elements.lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on background click
    elements.lightbox.addEventListener('click', (e) => {
      if (e.target === elements.lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!elements.lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox(-1);
          break;
        case 'ArrowRight':
          navigateLightbox(1);
          break;
      }
    });
  }

  // ================================
  // Utilities
  // ================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ================================
  // Smooth scroll for navigation
  // ================================

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ================================
  // Initialize
  // ================================

  function init() {
    setupLightboxEvents();
    setupSmoothScroll();
    loadDinners();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
