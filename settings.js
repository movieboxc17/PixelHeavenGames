// Settings Panel Functionality - Redesigned for v19.4
document.addEventListener('DOMContentLoaded', function() {
    // Create settings button and panel
    createSettingsElements();
    
    // Check if running as installed PWA
    checkPWAMode();
    
    // Load saved settings
    loadSettings();
    
    // Event listeners
    addEventListeners();
    
    // Add click sound event listener
    document.body.addEventListener('click', function(e) {
        // Only trigger for interactive elements
        if (
            e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'A' ||
            e.target.parentElement.tagName === 'BUTTON' ||
            e.target.parentElement.tagName === 'A' ||
            e.target.classList.contains('game-card') ||
            e.target.classList.contains('category-tag') ||
            e.target.classList.contains('settings-button') ||
            e.target.classList.contains('back-to-top')
        ) {
            playClickSound();
        }
    });
    
    // Add additional CSS rules for iOS
    if (isIOS()) {
        const style = document.createElement('style');
        style.textContent = `
            .ios-scrollfix {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-overflow-scrolling: touch !important;
                overflow-y: scroll !important;
            }
            
            /* Ensure content inside is fully scrollable */
            .ios-scrollfix > * {
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }
});

// Initialize HTML5 Audio
let clickSound;

function initAudio() {
    if (!clickSound) {
        try {
            // Create HTML5 audio element
            clickSound = new Audio();
            
            // Set source with error handling
            clickSound.src = './sounds/click.mp3';
            
            // Preload the sound
            clickSound.load();
            
            // Add error handling
            clickSound.onerror = function() {
                console.log('Error loading click sound');
                // Try alternative format
                clickSound.src = './sounds/click.wav';
            };
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    }
}

function canPlayType(type) {
    try {
        const audio = document.createElement('audio');
        return audio.canPlayType(type);
    } catch (e) {
        return false;
    }
}

function playClickSound() {
    // Initialize audio if not already done
    if (!clickSound) initAudio();
    
    // Get sound toggle setting
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    if (soundEnabled && clickSound) {
        try {
            // Clone the sound to allow multiple plays
            const soundClone = clickSound.cloneNode();
            soundClone.volume = 0.3;
            
            // Play with error handling
            const playPromise = soundClone.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Sound play error:", error);
                });
            }
        } catch (error) {
            console.error("Sound error:", error);
        }
    }
}

// Create all settings UI elements
function createSettingsElements() {
    // Only create if not already present
    if (document.querySelector('.settings-button')) return;
    
    // Create settings button
    const settingsButton = document.createElement('div');
    settingsButton.className = 'settings-button';
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    document.body.appendChild(settingsButton);
    
    // Create settings overlay and panel
    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'settings-overlay';
    
    const settingsHTML = `
    <div class="settings-panel">
        <div class="settings-header">
            <div class="settings-title">Settings</div>
            <div class="close-settings">
                <i class="fas fa-times"></i>
            </div>
        </div>
        
        <!-- Appearance Section -->
        <div class="settings-section">
            <div class="settings-section-title"><i class="fas fa-paint-brush"></i> Appearance</div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Dark Mode</div>
                    <div class="option-description">Toggle dark/light color theme</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="dark-mode-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Text Size</div>
                    <div class="option-description">Adjust text size for better readability</div>
                </div>
                <div class="select-wrapper">
                    <select id="text-size-select" class="settings-select">
                        <option value="small">Small</option>
                        <option value="medium" selected>Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Performance Section -->
        <div class="settings-section">
            <div class="settings-section-title"><i class="fas fa-tachometer-alt"></i> Performance</div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Reduce Animations</div>
                    <div class="option-description">Minimize animations for better performance</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="reduce-motion-toggle">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Battery Saver</div>
                    <div class="option-description">Optimize for battery life</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="battery-saver-toggle">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        
        <!-- Audio Section -->
        <div class="settings-section">
            <div class="settings-section-title"><i class="fas fa-volume-up"></i> Audio</div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Sound Effects</div>
                    <div class="option-description">Enable sound effects for interactions</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="sound-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        
        <!-- Advanced Section -->
        <div class="settings-section">
            <div class="settings-section-title"><i class="fas fa-sliders-h"></i> Advanced</div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Developer Mode</div>
                    <div class="option-description">Access developer features</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="developer-toggle">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div id="dev-code-container" class="dev-code-container">
                <div class="option-label">Enter Developer Code</div>
                <input type="text" class="dev-code-input" placeholder="XXXX-XXXX-XXXX">
                <button class="dev-code-submit"><i class="fas fa-check"></i> Submit</button>
                <div class="dev-code-message">Invalid code. Please try again.</div>
            </div>
        </div>
        
        <!-- PWA Section (shown only in PWA mode) -->
        <div class="pwa-only-section settings-section">
            <div class="settings-section-title"><i class="fas fa-mobile-alt"></i> App Options</div>
            
            <div class="dual-button-container">
                <button id="reboot-button" class="reboot-button">
                    <i class="fas fa-redo-alt"></i> Restart App
                </button>
                
                <button id="clear-cache-button" class="clear-cache-button">
                    <i class="fas fa-broom"></i> Clear Cache
                </button>
            </div>
        </div>
        
        <!-- Data Management Section -->
        <div class="settings-section">
            <div class="settings-section-title"><i class="fas fa-database"></i> Data Management</div>
            
            <div class="settings-option">
                <div class="option-info">
                    <div class="option-label">Save Game Progress</div>
                    <div class="option-description">Save your progress across sessions</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="save-progress-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="action-buttons-container">
                <button id="reset-progress-button" class="settings-action-button">
                    <i class="fas fa-trash-alt"></i> Reset All Progress
                </button>
            </div>
        </div>
        
        <!-- Version Info -->
        <div class="version-info">
            <div>PixelHeavenGames</div>
            <div class="version-number">Version 19.6</div>
        </div>
        
        <!-- Developer Section -->
        <div class="developer-section">
            Created by Moviebox C17 & Askansz
        </div>
    </div>
`;

settingsOverlay.innerHTML = settingsHTML;
document.body.appendChild(settingsOverlay);

// Fix touch scrolling after creating elements
fixTouchScrolling();
}

// Function to fix touch scrolling issues
function fixTouchScrolling() {
const settingsPanel = document.querySelector('.settings-panel');

if (!settingsPanel) return;

// Add iOS-specific class if needed
if (isIOS()) {
    settingsPanel.classList.add('ios-scrollfix');
}

// Prevent touch events on the panel from being blocked
settingsPanel.addEventListener('touchstart', function(e) {
    e.stopPropagation(); // Prevent parent elements from capturing touch
}, { passive: true }); // Use passive listener for better performance

// Force recalculation of the scrollable height when opened
document.querySelector('.settings-button').addEventListener('click', function() {
    setTimeout(() => {
        // Force layout recalculation
        settingsPanel.style.maxHeight = '';
        settingsPanel.offsetHeight; // Trigger reflow
        settingsPanel.style.maxHeight = isIOS() ? '65vh' : '75vh';
    }, 10);
});

// Prevent settings overlay from blocking touch events
const settingsOverlay = document.querySelector('.settings-overlay');
if (settingsOverlay) {
    settingsOverlay.addEventListener('touchmove', function(e) {
        if (!settingsPanel.contains(e.target)) {
            e.preventDefault(); // Prevent body scrolling
        }
    }, { passive: false });
}

// Allow scrolling within the panel
settingsPanel.addEventListener('touchmove', function(e) {
    e.stopPropagation(); // Prevent the overlay from capturing this
}, { passive: true });
}

// Check if running as a PWA
function checkPWAMode() {
// Check if app is running in standalone mode (PWA)
const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator.standalone) || 
             document.referrer.includes('android-app://');

if (isPWA) {
    document.body.classList.add('pwa-mode');
}
}

// Load saved settings from localStorage
function loadSettings() {
// Set default settings if not present
if (!localStorage.getItem('settingsInitialized')) {
    // Set defaults
    localStorage.setItem('darkMode', 'true');
    localStorage.setItem('textSize', 'medium');
    localStorage.setItem('reduceMotion', 'false');
    localStorage.setItem('batterySaver', 'false');
    localStorage.setItem('soundEnabled', 'true');
    localStorage.setItem('saveProgress', 'true');
    localStorage.setItem('developerMode', 'false');
    localStorage.setItem('settingsInitialized', 'true');
}

// Apply saved settings
applySettings();
}

// Apply all settings from localStorage to the UI
function applySettings() {
// Get values from localStorage
const darkMode = localStorage.getItem('darkMode') === 'true';
const textSize = localStorage.getItem('textSize') || 'medium';
const reduceMotion = localStorage.getItem('reduceMotion') === 'true';
const batterySaver = localStorage.getItem('batterySaver') === 'true';
const soundEnabled = localStorage.getItem('soundEnabled') === 'true';
const saveProgress = localStorage.getItem('saveProgress') === 'true';
const developerMode = localStorage.getItem('developerMode') === 'true';

// Set toggle states based on saved values
const darkModeToggle = document.getElementById('dark-mode-toggle');
const textSizeSelect = document.getElementById('text-size-select');
const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
const batterySaverToggle = document.getElementById('battery-saver-toggle');
const soundToggle = document.getElementById('sound-toggle');
const saveProgressToggle = document.getElementById('save-progress-toggle');
const developerToggle = document.getElementById('developer-toggle');

// Only set if elements exist (they might not on initial load)
if (darkModeToggle) darkModeToggle.checked = darkMode;
if (textSizeSelect) textSizeSelect.value = textSize;
if (reduceMotionToggle) reduceMotionToggle.checked = reduceMotion;
if (batterySaverToggle) batterySaverToggle.checked = batterySaver;
if (soundToggle) soundToggle.checked = soundEnabled;
if (saveProgressToggle) saveProgressToggle.checked = saveProgress;
if (developerToggle) developerToggle.checked = developerMode;

// Apply classes to body
if (darkMode) document.body.classList.add('dark-mode');
document.body.classList.add(`text-size-${textSize}`);
if (reduceMotion) document.body.classList.add('reduce-motion');
if (batterySaver) document.body.classList.add('battery-saver');

// Show/hide developer section based on developer mode
const devCodeContainer = document.getElementById('dev-code-container');
if (devCodeContainer && developerMode) {
    devCodeContainer.classList.add('active');
}
}

// Add all event listeners for settings functionality
function addEventListeners() {
// Open settings panel
document.querySelector('.settings-button').addEventListener('click', function() {
    document.querySelector('.settings-overlay').classList.add('active');
    playClickSound();
});

// Close settings panel
document.querySelector('.close-settings').addEventListener('click', function() {
    document.querySelector('.settings-overlay').classList.remove('active');
    playClickSound();
});

// Close settings when clicking outside
document.querySelector('.settings-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// Dark Mode toggle
document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
    playClickSound();
});

// Text Size select
document.getElementById('text-size-select').addEventListener('change', function() {
    // Remove all text size classes
    document.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
    // Add selected text size class
    document.body.classList.add(`text-size-${this.value}`);
    // Save setting
    localStorage.setItem('textSize', this.value);
    playClickSound();
});

// Reduce Motion toggle
document.getElementById('reduce-motion-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('reduce-motion');
        localStorage.setItem('reduceMotion', 'true');
    } else {
        document.body.classList.remove('reduce-motion');
        localStorage.setItem('reduceMotion', 'false');
    }
    playClickSound();
});

// Battery Saver toggle
document.getElementById('battery-saver-toggle').addEventListener('change', function() {
    if (this.checked) {
        document.body.classList.add('battery-saver');
        localStorage.setItem('batterySaver', 'true');
    } else {
        document.body.classList.remove('battery-saver');
        localStorage.setItem('batterySaver', 'false');
    }
    playClickSound();
});

// Sound toggle
document.getElementById('sound-toggle').addEventListener('change', function() {
    localStorage.setItem('soundEnabled', this.checked ? 'true' : 'false');
    
    // Test sound when enabled
    if (this.checked) {
        playClickSound();
    }
});

// Save Progress toggle
document.getElementById('save-progress-toggle').addEventListener('change', function() {
    localStorage.setItem('saveProgress', this.checked ? 'true' : 'false');
    playClickSound();
});

    // Developer Mode toggle
    document.getElementById('developer-toggle').addEventListener('change', function() {
        const devCodeContainer = document.getElementById('dev-code-container');
        
        if (this.checked) {
            devCodeContainer.classList.add('active');
            localStorage.setItem('developerMode', 'true');
        } else {
            devCodeContainer.classList.remove('active');
            localStorage.setItem('developerMode', 'false');
            // Clear developer access when disabled
            localStorage.removeItem('fullDeveloperAccess');
        }
        playClickSound();
    });
    
    // Developer Code submission
    document.querySelector('.dev-code-submit').addEventListener('click', function() {
        const codeInput = document.querySelector('.dev-code-input');
        const codeMessage = document.querySelector('.dev-code-message');
        const developerCode = codeInput.value.trim();
        
        // Validate developer code
        if (developerCode === 'PIXEL-HEAVEN-2025') {
            localStorage.setItem('fullDeveloperAccess', 'true');
            codeMessage.textContent = 'Developer mode activated! Refresh to apply changes.';
            codeMessage.style.color = '#4caf50';
            codeMessage.classList.add('active');
            showToast('Developer mode activated', 'check-circle');
        } else {
            codeMessage.textContent = 'Invalid code. Please try again.';
            codeMessage.style.color = '#ff6b6b';
            codeMessage.classList.add('active');
            
            // Shake animation for error
            codeInput.classList.add('shake');
        }
    });
    
    // Reset Progress button
    document.getElementById('reset-progress-button').addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
            // Clear all game-related localStorage items
            const settingsKeys = [
                'darkMode',
                'textSize',
                'reduceMotion',
                'batterySaver',
                'soundEnabled',
                'saveProgress',
                'developerMode',
                'settingsInitialized',
                'fullDeveloperAccess'
            ];
            
            // Keep settings but remove game progress
            for (let key in localStorage) {
                if (!settingsKeys.includes(key)) {
                    localStorage.removeItem(key);
                }
            }
            
            showToast('All progress has been reset', 'check-circle');
        }
        playClickSound();
    });
    
    // PWA-specific: Reboot app button
    const rebootButton = document.getElementById('reboot-button');
    if (rebootButton) {
        rebootButton.addEventListener('click', function() {
            showToast('Restarting application...', 'sync');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            playClickSound();
        });
    }
    
    // PWA-specific: Clear cache button
    const clearCacheButton = document.getElementById('clear-cache-button');
    if (clearCacheButton) {
        clearCacheButton.addEventListener('click', async function() {
            playClickSound();
            const success = await clearCaches();
            
            if (success) {
                showToast('Cache cleared successfully', 'check-circle');
            } else {
                showToast('Failed to clear cache', 'exclamation-triangle');
            }
        });
    }
    
    // Fix for settings panel scrolling on touch devices
    const settingsPanel = document.querySelector('.settings-panel');
    
    // Prevent settings overlay from capturing touch events meant for the panel
    document.querySelector('.settings-overlay').addEventListener('touchmove', function(e) {
        if (!settingsPanel.contains(e.target)) {
            e.preventDefault(); // Prevent body scrolling
        }
    }, { passive: false });
    
    // Allow scrolling within the panel
    settingsPanel.addEventListener('touchmove', function(e) {
        e.stopPropagation(); // Prevent the overlay from capturing this
    }, { passive: true });
}

// Clear cache (for PWA)
async function clearCaches() {
    try {
        // Check if Cache API is available (for PWAs)
        if ('caches' in window) {
            // Get all cache keys
            const cacheKeys = await caches.keys();
            
            // Delete all caches
            await Promise.all(cacheKeys.map(key => caches.delete(key)));
            
            console.log('All caches cleared');
            return true;
        } else {
            // Alternative: clear localStorage except settings
            const settingsKeys = [
                'darkMode',
                'textSize',
                'reduceMotion',
                'batterySaver',
                'soundEnabled',
                'saveProgress',
                'developerMode',
                'settingsInitialized',
                'fullDeveloperAccess'
            ];
            
            // Get all localStorage keys
            const allKeys = Object.keys(localStorage);
            
            // Filter out settings keys and remove everything else
            allKeys.forEach(key => {
                if (!settingsKeys.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            console.log('localStorage cleared (except settings)');
            return true;
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
    }
}

// Show toast notification
function showToast(message, iconName) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-${iconName}"></i> ${message}`;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Show toast (allow browser to process DOM)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle CSS animation end
document.addEventListener('animationend', function(e) {
    if (e.target.classList.contains('dev-code-input') && e.target.classList.contains('shake')) {
        e.target.classList.remove('shake');
    }
});

// Listen for display mode changes (PWA status)
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    checkPWAMode();
});

// Add keydown event listener for closing settings with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const settingsOverlay = document.querySelector('.settings-overlay');
        if (settingsOverlay && settingsOverlay.classList.contains('active')) {
            settingsOverlay.classList.remove('active');
        }
    }
});

// Helper function to detect iOS devices
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Additional PWA install detection for iOS devices
if (isIOS() && window.navigator.standalone) {
    document.body.classList.add('pwa-mode', 'ios-pwa');
}

// Utility function to safely access localStorage with fallback
function getLocalStorageItem(key, defaultValue) {
    try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
    } catch (error) {
        console.error('localStorage access error:', error);
        return defaultValue;
    }
}

// Utility function to safely set localStorage with error handling
function setLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error('localStorage write error:', error);
        
        // Show error to user if storage is full
        if (error.name === 'QuotaExceededError') {
            showToast('Storage full. Try clearing cache.', 'exclamation-triangle');
        }
        return false;
    }
}
