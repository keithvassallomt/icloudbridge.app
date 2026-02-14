// Import background animation
import { initBackgroundAnimation } from './background-animation.js';

// Theme Management
const THEME_KEY = 'icloudbridge-theme-preference';

// Get system preference
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Get the user's preferred theme setting (light, dark, or system)
function getThemePreference() {
  const saved = localStorage.getItem(THEME_KEY);
  // Default to system if nothing saved
  return saved || 'system';
}

// Apply theme to the document
function applyTheme(preference) {
  // Store preference
  localStorage.setItem(THEME_KEY, preference);
  document.documentElement.setAttribute('data-theme-preference', preference);

  // Apply actual theme
  let actualTheme;
  if (preference === 'system') {
    actualTheme = getSystemTheme();
  } else {
    actualTheme = preference;
  }

  document.documentElement.setAttribute('data-theme', actualTheme);
}

// Toggle through theme options: system -> light -> dark -> system
function toggleTheme() {
  const currentPreference = getThemePreference();
  let newPreference;

  if (currentPreference === 'system') {
    newPreference = 'light';
  } else if (currentPreference === 'light') {
    newPreference = 'dark';
  } else {
    newPreference = 'system';
  }

  applyTheme(newPreference);
}

// Initialize theme on page load
function initTheme() {
  const preference = getThemePreference();
  applyTheme(preference);

  // Add theme toggle event listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only apply if user is using system preference
      if (getThemePreference() === 'system') {
        applyTheme('system');
      }
    });
  }

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
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

// Fetch latest release version from GitHub
function fetchLatestVersion() {
  const badge = document.getElementById('version-badge');
  const tag = document.getElementById('version-tag');
  if (!badge || !tag) return;

  fetch('https://api.github.com/repos/keithvassallomt/icloudbridge/releases/latest')
    .then(res => res.json())
    .then(data => {
      if (data.tag_name) {
        tag.textContent = data.tag_name;
        badge.style.display = '';
      }
    })
    .catch(() => {
      // Silently fail - badge stays hidden
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCopyrightYear();
  initBackgroundAnimation();
  fetchLatestVersion();

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Also initialize immediately (for faster theme application)
initTheme();
