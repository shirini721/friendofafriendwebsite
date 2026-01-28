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
    upcomingContent: document.getElementById('upcoming-content'),
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
    upcoming: null,
    dinners: [],
    currentPhotos: [],
    currentPhotoIndex: 0
  };

  // ================================
  // Data Loading
  // ================================

  async function loadData() {
    try {
      const response = await fetch(CONFIG.dataPath);
      if (!response.ok) throw new Error('Failed to load data');
      const data = await response.json();
      state.upcoming = data.upcoming || null;
      state.dinners = data.dinners || [];
      renderUpcoming();
      renderDinners();
    } catch (error) {
      console.error('Error loading data:', error);
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

  function renderUpcoming() {
    if (!state.upcoming) {
      elements.upcomingContent.innerHTML = `
        <p class="no-upcoming">Next dinner details coming soon. Stay tuned.</p>
      `;
      return;
    }

    const u = state.upcoming;
    elements.upcomingContent.innerHTML = `
      <div class="upcoming-card fade-in">
        <h3 class="upcoming-restaurant">${escapeHtml(u.restaurant)}</h3>
        <div class="upcoming-details">
          <span class="upcoming-detail">
            <span class="upcoming-detail-label">${formatDate(u.date)}</span>
          </span>
          <span class="upcoming-detail">
            ${escapeHtml(u.time)}
          </span>
          <span class="upcoming-detail">
            ${escapeHtml(u.location)}
          </span>
        </div>
        <div class="upcoming-actions">
          <a href="${escapeHtml(u.partifulUrl)}" target="_blank" rel="noopener noreferrer" class="btn-rsvp">
            RSVP on Partiful
          </a>
          <div class="upcoming-divider"></div>
          <div class="invite-section">
            <p class="invite-label">Invite Your +1</p>
            <p class="invite-sublabel">Tap below to text your friend a ready-made invite with the RSVP link. It sends from your phone — personal, not a bot.</p>
            <div class="invite-form">
              <input type="text"
                     id="invite-name"
                     class="invite-input"
                     placeholder="Your first name"
                     autocomplete="given-name">
              <button id="invite-btn" class="btn-invite">
                Send Text Invite to Your +1
              </button>
            </div>
            <p class="invite-hint">Opens your messaging app with a pre-written invite</p>
          </div>
        </div>
      </div>
    `;

    setupInviteHandler();
  }

  function buildSmsUrl(message) {
    var encoded = encodeURIComponent(message);
    // iOS uses sms:&body=, Android uses sms:?body=
    // sms:?&body= works on both in most modern browsers
    var isIOS = /iP(hone|od|ad)/i.test(navigator.userAgent);
    if (isIOS) {
      return 'sms:&body=' + encoded;
    }
    return 'sms:?body=' + encoded;
  }

  function setupInviteHandler() {
    var btn = document.getElementById('invite-btn');
    var nameInput = document.getElementById('invite-name');
    if (!btn || !state.upcoming) return;

    btn.addEventListener('click', function() {
      var name = nameInput.value.trim();
      var u = state.upcoming;
      var message;

      if (name) {
        message = 'Hey! It\u2019s ' + name + '. I\u2019ve been invited to this dinner series called Friend of a Friend \u2014 every month, a group gathers at a great restaurant and everyone brings one new person. I\u2019m bringing you as my +1! It\u2019s at ' + u.restaurant + ' on ' + formatDate(u.date) + ' at ' + u.time + '. RSVP here: ' + u.partifulUrl;
      } else {
        message = u.inviteMessage;
      }

      window.location.href = buildSmsUrl(message);
    });
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
    loadData();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
