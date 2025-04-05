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
                <div class="close-settings"><i class="fas fa-times"></i></div>
            </div>
            
            <!-- Appearance Section -->
            <div class="settings-section">
                <div class="settings-section-title"><i class="fas fa-paint-brush"></i> Appearance</div>
                
                <div class="settings-option">
                    <div class="option-info">
                        <div class="option-label">Dark Mode</div>
                        <div class="option-description">Use dark mode for lower eye strain</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div class="option-info">
                        <div class="option-label">Text Size</div>
                        <div class="option-description">Adjust the size of text</div>
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
                <div class="settings-section-title"><i class="fas fa-bolt"></i> Performance</div>
                
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
                <div class="version-number">Version 19.4</div>
            </div>
            
            <!-- Developer Section -->
            <div class="developer-section">
                Created by Moviebox C17 & Askansz
            </div>
        </div>
    `;
    
    settingsOverlay.innerHTML = settingsHTML;
    document.body.appendChild(settingsOverlay);
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
    document.getElementById('dark-mode-toggle').checked = darkMode;
    document.getElementById('text-size-select').value = textSize;
    document.getElementById('reduce-motion-toggle').checked = reduceMotion;
    document.getElementById('battery-saver-toggle').checked = batterySaver;
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('save-progress-toggle').checked = saveProgress;
    document.getElementById('developer-toggle').checked = developerMode;
    
    // Apply classes to body
    if (darkMode) document.body.classList.add('dark-mode');
    document.body.classList.add(`text-size-${textSize}`);
    if (reduceMotion) document.body.classList.add('reduce-motion');
    if (batterySaver) document.body.classList.add('battery-saver');
    
    // Show/hide developer section based on developer mode
    if (developerMode) {
        document.getElementById('dev-code-container').classList.add('active');
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
        }
        playClickSound();
    });
    
    // Dev Code Submit button
    const devCodeSubmit = document.querySelector('.dev-code-submit');
    if (devCodeSubmit) {
        devCodeSubmit.addEventListener('click', function() {
            const codeInput = document.querySelector('.dev-code-input');
            const codeMessage = document.querySelector('.dev-code-message');
            
            // Validate developer code (example: PIXEL-HEAVEN-2025)
            if (codeInput.value === 'PIXEL-HEAVEN-2025') {
                codeMessage.textContent = 'Developer mode activated!';
                codeMessage.style.color = '#4CAF50';
                codeMessage.classList.add('active');
                
                // Enable secret developer features here
                localStorage.setItem('fullDeveloperAccess', 'true');
                
                // Show toast notification
                showToast('Developer mode activated!', 'check-circle');
            } else {
                codeMessage.textContent = 'Invalid code. Please try again.';
                codeMessage.style.color = '#ff6b6b';
                codeMessage.classList.add('active');
                
                // Shake animation for error
                codeInput.classList.add('shake');
                setTimeout(() => {
                    codeInput.classList.remove('shake');
                }, 500);
            }
            
            playClickSound();
        });
    }
    
    // Reset Progress button
    document.getElementById('reset-progress-button').addEventListener('click', function() {
        // Confirm before resetting
        if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
            // Clear game progress data
            clearGameProgress();
            
            // Show confirmation
            showToast('All game progress has been reset', 'check-circle');
        }
        
        playClickSound();
    });
    
    // Reboot button (PWA only)
    const rebootButton = document.getElementById('reboot-button');
    if (rebootButton) {
        rebootButton.addEventListener('click', function() {
            showToast('Restarting application...', 'redo-alt');
            
            // Small delay to show the toast before reloading
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
            playClickSound();
        });
    }
    
    // Clear Cache button (new functionality)
    const clearCacheButton = document.getElementById('clear-cache-button');
    if (clearCacheButton) {
        clearCacheButton.addEventListener('click', function() {
            clearCaches().then(success => {
                if (success) {
                    showToast('Cache cleared successfully', 'check-circle');
                } else {
                    showToast('Failed to clear cache', 'exclamation-circle');
                }
            });
            
            playClickSound();
        });
    }
}

// Clear game progress from localStorage
function clearGameProgress() {
    // Game-specific progress keys to clear
    const progressKeys = [
        'snakeHighScore',
        'ticTacToeStats',
        'memoryGameStats',
        'colorClashHighScore',
        'minigolfScore'
    ];
    
    // Clear each key
    progressKeys.forEach(key => {
        localStorage.removeItem(key);
    });
    
    console.log('All game progress has been reset');
}

// Clear browser caches (for PWA)
async function clearCaches() {
    try {
        // Check if Cache API is available
        if ('caches' in window) {
            // Get all cache names
            const cacheNames = await caches.keys();
            
            // Delete each cache
            const deletionPromises = cacheNames.map(cacheName => {
                return caches.delete(cacheName);
            });
            
            // Wait for all caches to be deleted
            await Promise.all(deletionPromises);
            
            console.log('All caches cleared successfully');
            return true;
        } else {
            console.log('Cache API not available');
            
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
