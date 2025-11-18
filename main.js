// Import background animation
import { initBackgroundAnimation } from './background-animation.js';

// Theme Management
const THEME_KEY = 'icloudbridge-theme';

// Get the user's preferred theme
function getPreferredTheme() {
  // Check localStorage first
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }

  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

// Apply theme to the document
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Toggle between light and dark themes
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Initialize theme on page load
function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  // Add theme toggle event listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Update copyright year
function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightElement = document.getElementById('copyright-year');

  if (copyrightElement) {
    if (currentYear > 2025) {
      copyrightElement.textContent = `2025 - ${currentYear}`;
    } else {
      copyrightElement.textContent = '2025';
    }
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCopyrightYear();
  initBackgroundAnimation();
});

// Also initialize immediately (for faster theme application)
initTheme();
