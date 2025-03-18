// Settings Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create settings button and panel
    createSettingsElements();
    
    // Check if running as installed PWA (added to home screen)
    checkPWAMode();
    
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

// Use HTML5 Audio API instead of Web Audio API
let clickSound;

function initAudio() {
    if (!clickSound) {
        try {
            // Create HTML5 audio element
            clickSound = new Audio();
            
            // Try loading several different formats for maximum compatibility
            if (canPlayType('audio/ogg')) {
                clickSound.src = './sounds/click.mp3';
            } else if (canPlayType('audio/mpeg')) {
                fetch('./sounds/click.mp3')  // Use relative path
                    .then(response => response.blob())
                    .then(blob => {
                        clickSound.src = URL.createObjectURL(blob);
                    })
                    .catch(error => {
                        console.error('Error loading sound:', error);
                    });
            } else {
                clickSound.src = './sounds/click.wav';
            }
            
            // Preload the sound
            clickSound.load();
            console.log('Click sound initialized');
        } catch (e) {
            console.error('Audio playback not supported:', e);
        }
    }
}

// Helper function to check if the browser supports a specific audio format
function canPlayType(type) {
    const audio = document.createElement('audio');
    return audio.canPlayType(type) !== '';
}

// Play click sound using HTML5 Audio
function playClickSound() {
    if (!clickSound) return;
    
    // Check if sound is enabled in settings
    if (localStorage.getItem('clickSoundEnabled') === 'true') {
        try {
            // Clone the sound for overlapping playback
            const sound = clickSound.cloneNode();
            sound.volume = 0.5; // Lower volume
            sound.play().catch(e => console.error('Error playing sound:', e));
        } catch (e) {
            console.error('Error playing click sound:', e);
        }
    }
}

// Toggle click sound
function toggleClickSound(enabled) {
    localStorage.setItem('clickSoundEnabled', enabled ? 'true' : 'false');
    
    if (enabled) {
        // Initialize audio if it hasn't been already
        initAudio();
        
        // Play a test sound
        setTimeout(() => {
            playClickSound();
        }, 300);
    }
}

// Create settings elements
function createSettingsElements() {
    // Settings button
    const settingsButton = document.createElement('div');
    settingsButton.className = 'settings-button';
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    document.body.appendChild(settingsButton);
    
    // Settings overlay
    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'settings-overlay';
    
    // Settings panel HTML
    settingsOverlay.innerHTML = `
        <div class="settings-panel">
            <div class="settings-header">
                <div class="settings-title">Settings</div>
                <div class="close-settings"><i class="fas fa-times"></i></div>
            </div>
            
            <div class="settings-section">
                <div class="settings-section-title">General Settings</div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Dark Mode</div>
                        <div class="option-description">Switch between light and dark theme</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="darkmode-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Click Sound</div>
                        <div class="option-description">Play sound when clicking elements</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="sound-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Notifications</div>
                        <div class="option-description">Enable game event notifications</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="notifications-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Text Size</div>
                        <div class="option-description">Adjust text size throughout the app</div>
                    </div>
                    <div class="select-wrapper">
                        <select id="text-size-select" class="settings-select">
                            <option value="small">Small</option>
                            <option value="medium" selected>Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Reduce Motion</div>
                        <div class="option-description">Minimize animations for accessibility</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="reduce-motion-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="settings-section pwa-only-section">
                <div class="settings-section-title">Mobile App Settings</div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Vibration Feedback</div>
                        <div class="option-description">Enable haptic feedback on interactions</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="vibration-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Offline Mode</div>
                        <div class="option-description">Manage offline content preferences</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="offline-mode-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Screen Orientation</div>
                        <div class="option-description">Lock screen orientation</div>
                    </div>
                    <div class="select-wrapper">
                        <select id="orientation-select" class="settings-select">
                            <option value="auto" selected>Auto</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                        </select>
                    </div>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Battery Saver</div>
                        <div class="option-description">Reduce features to save battery</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="battery-saver-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Cache Management</div>
                        <div class="option-description">Clear cached data to free up space</div>
                    </div>
                    <button id="clear-cache-button" class="settings-action-button">Clear Cache</button>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">App Version</div>
                        <div class="option-description">Check for updates</div>
                    </div>
                    <button id="check-updates-button" class="settings-action-button">Check Updates</button>
                </div>
            </div>
            
            <div class="settings-section">
                <div class="settings-section-title">Developer Options</div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Animations Control</div>
                        <div class="option-description">Developer-only animation settings</div>
                    </div>
                    <button id="dev-code-toggle" class="dev-code-submit">Developer Mode</button>
                </div>
                
                <div id="dev-code-container" class="dev-code-container">
                    <div class="option-description">Enter developer code to control animations</div>
                    <input type="password" id="dev-code-input" class="dev-code-input" placeholder="Enter developer code">
                    <button id="dev-code-submit" class="dev-code-submit">Verify Code</button>
                    <div id="dev-code-message" class="dev-code-message">Invalid developer code</div>
                    
                    <div class="settings-option" style="display: none;" id="animation-toggle-container">
                        <div>
                            <div class="option-label">Disable Animations</div>
                            <div class="option-description">Turn off all site animations</div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="animations-toggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <div class="version-info">
                <div>PixelHeavenGames</div>
                <div>Version: <span class="version-number">19.0</span></div>
            </div>
            
            <button class="reboot-button">
                <i class="fas fa-redo-alt"></i> Restart Application
            </button>
            
            <div class="developer-section">
                <div>Developed by: Moviebox C17 & Askansz</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(settingsOverlay);
}

// Add event listeners
function addEventListeners() {
    // Open settings panel
    document.querySelector('.settings-button').addEventListener('click', function() {
        document.querySelector('.settings-overlay').classList.add('active');
        // Load saved settings
        loadSettings();
    });
    
    // Close settings panel
    document.querySelector('.close-settings').addEventListener('click', function() {
        document.querySelector('.settings-overlay').classList.remove('active');
        // Save settings when closing
        saveSettings();
    });
    
    // Close when clicking outside the panel
    document.querySelector('.settings-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            saveSettings();
        }
    });
    
    // Darkmode toggle
    document.getElementById('darkmode-toggle').addEventListener('change', function() {
        toggleDarkMode(this.checked);
    });
    
    // Click sound toggle
    document.getElementById('sound-toggle').addEventListener('change', function() {
        toggleClickSound(this.checked);
    });
    
    // Text size select
    document.getElementById('text-size-select').addEventListener('change', function() {
        changeTextSize(this.value);
    });
    
    // Reduce motion toggle
    document.getElementById('reduce-motion-toggle').addEventListener('change', function() {
        toggleReduceMotion(this.checked);
    });
    
        // PWA-specific event listeners
        if (document.getElementById('vibration-toggle')) {
            document.getElementById('vibration-toggle').addEventListener('change', function() {
                toggleVibration(this.checked);
            });
        }
        
        if (document.getElementById('offline-mode-toggle')) {
            document.getElementById('offline-mode-toggle').addEventListener('change', function() {
                toggleOfflineMode(this.checked);
            });
        }
        
        if (document.getElementById('orientation-select')) {
            document.getElementById('orientation-select').addEventListener('change', function() {
                changeScreenOrientation(this.value);
            });
        }
        
        if (document.getElementById('battery-saver-toggle')) {
            document.getElementById('battery-saver-toggle').addEventListener('change', function() {
                toggleBatterySaver(this.checked);
            });
        }
        
        if (document.getElementById('clear-cache-button')) {
            document.getElementById('clear-cache-button').addEventListener('click', function() {
                clearCache();
            });
        }
        
        if (document.getElementById('check-updates-button')) {
            document.getElementById('check-updates-button').addEventListener('click', function() {
                checkForUpdates();
            });
        }
        
        // Developer Code toggle
        document.getElementById('dev-code-toggle').addEventListener('click', function() {
            const codeContainer = document.getElementById('dev-code-container');
            codeContainer.classList.toggle('active');
        });
        
        // Developer Code submit
        document.getElementById('dev-code-submit').addEventListener('click', function() {
            verifyDeveloperCode();
        });
        
        // Allow Enter key to submit dev code
        document.getElementById('dev-code-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyDeveloperCode();
            }
        });
        
        // Animations toggle (only works after code verification)
        document.getElementById('animations-toggle').addEventListener('change', function() {
            toggleAnimations(this.checked);
        });
        
        // Notifications toggle
        document.getElementById('notifications-toggle').addEventListener('change', function() {
            toggleNotifications(this.checked);
        });
        
        // Reboot button (only visible in PWA mode)
        document.querySelector('.reboot-button').addEventListener('click', function() {
            rebootApplication();
        });
    }
    
    // Check if running as installed PWA
    function checkPWAMode() {
        // Check if the app is running in standalone mode (PWA installed)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            // Add class to body to show PWA-specific elements
            document.body.classList.add('pwa-mode');
            
            console.log('Running as installed PWA');
        } else {
            console.log('Running in browser mode');
        }
    }
    
    // Verify developer code
    function verifyDeveloperCode() {
        const codeInput = document.getElementById('dev-code-input');
        const message = document.getElementById('dev-code-message');
        const animationToggleContainer = document.getElementById('animation-toggle-container');
        
        // Check if code is correct - using "dev2025" as the code
        // In production, use a more secure mechanism
        if (codeInput.value === "dev2025") {
            // Code is correct
            message.textContent = "Developer access granted";
            message.style.color = "#4caf50";
            message.classList.add('active');
            
            // Show animation toggle
            animationToggleContainer.style.display = "flex";
            
            // Load animation setting
            const savedSettings = localStorage.getItem('pixelHeavenSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                document.getElementById('animations-toggle').checked = settings.animations || false;
            }
            
            // Hide message after 3 seconds
            setTimeout(() => {
                message.classList.remove('active');
            }, 3000);
            
            // Store dev mode state
            localStorage.setItem('devModeVerified', 'true');
        } else {
            // Code is incorrect
            message.textContent = "Invalid developer code";
            message.style.color = "#ff6b6b";
            message.classList.add('active');
            
            // Hide animation toggle
            animationToggleContainer.style.display = "none";
            
            // Clear dev mode state
            localStorage.removeItem('devModeVerified');
            
            // Hide message after 3 seconds
            setTimeout(() => {
                message.classList.remove('active');
            }, 3000);
        }
    }
    
    // Enhanced notification toggle function
    function toggleNotifications(enabled) {
        if (enabled) {
            // Check if browser supports notifications
            if (!("Notification" in window)) {
                alert("This browser does not support notifications");
                document.getElementById('notifications-toggle').checked = false;
                return;
            }
            
            // Request permission if not already granted
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        // Permission was granted, save setting and send test notification
                        localStorage.setItem('notificationsEnabled', 'true');
                        sendTestNotification();
                    } else {
                        // User denied permission, update toggle to reflect this
                        document.getElementById('notifications-toggle').checked = false;
                        alert("Notification permission denied. Please enable notifications in your browser settings.");
                    }
                });
            } else {
                // Permission already granted, just save setting and send test
                localStorage.setItem('notificationsEnabled', 'true');
                sendTestNotification();
            }
        } else {
            // User turned off notifications
            localStorage.setItem('notificationsEnabled', 'false');
            console.log("Notifications disabled");
        }
    }
    
    // Function to send a test notification
    function sendTestNotification() {
        if (Notification.permission === 'granted') {
            const notification = new Notification('PixelHeavenGames', {
                body: 'Notifications are now enabled! You will receive game updates and events.',
                icon: './icon.png', // Use relative path
                badge: './icon.png',
                vibrate: [100, 50, 100],
                tag: 'test-notification'
            });
            
            // Close notification after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
            
            // Optional: Handle notification click
            notification.onclick = function() {
                window.focus();
                this.close();
            };
        }
    }
    
    // Toggle vibration feedback
    function toggleVibration(enabled) {
        localStorage.setItem('vibrationEnabled', enabled ? 'true' : 'false');
        
        // Test vibration if enabled
        if (enabled && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Toggle offline mode
    function toggleOfflineMode(enabled) {
        localStorage.setItem('offlineModeEnabled', enabled ? 'true' : 'false');
        
        if (enabled) {
            // Force cache update when enabling offline mode
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    action: 'updateCache'
                });
                
                showToast('Caching content for offline use...');
            }
        }
    }
    
    // Change screen orientation
    function changeScreenOrientation(orientation) {
        localStorage.setItem('screenOrientation', orientation);
        
        // If screen orientation API is available
        if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
            try {
                if (orientation === 'portrait') {
                    window.screen.orientation.lock('portrait').catch(e => {
                        console.log('Orientation lock not supported:', e);
                    });
                } else if (orientation === 'landscape') {
                    window.screen.orientation.lock('landscape').catch(e => {
                        console.log('Orientation lock not supported:', e);
                    });
                } else {
                    // Auto - unlock
                    window.screen.orientation.unlock();
                }
            } catch (e) {
                console.log('Screen orientation API not supported:', e);
            }
        }
    }
    
    // Toggle battery saver mode
    function toggleBatterySaver(enabled) {
        if (enabled) {
            document.body.classList.add('battery-saver');
        } else {
            document.body.classList.remove('battery-saver');
        }
    }
    
    // Clear cache
    function clearCache() {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        return caches.delete(cacheName);
                    })
                );
            }).then(() => {
                showToast('Cache cleared successfully');
            });
        } else {
            showToast('Cache API not supported in this browser');
        }
    }
    
    // Check for updates
    function checkForUpdates() {
        // In a real app, this would check with a server
        // For now, we'll just simulate it
        showToast('Checking for updates...');
        
        setTimeout(() => {
            showToast('You are using the latest version');
        }, 2000);
    }
    
    // Change text size
    function changeTextSize(size) {
        // Remove any existing text size classes
        document.body.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');
        
        // Add the selected text size class
        document.body.classList.add(`text-size-${size}`);
        
        // Save the setting
        localStorage.setItem('textSize', size);
    }
    
    // Toggle reduce motion
    function toggleReduceMotion(enabled) {
        if (enabled) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    
    // Show toast notification
    function showToast(message) {
        // Remove any existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            darkMode: document.getElementById('darkmode-toggle').checked,
            animations: document.getElementById('animations-toggle').checked,
            clickSound: document.getElementById('sound-toggle').checked,
            notifications: document.getElementById('notifications-toggle').checked && 
                           Notification.permission === 'granted',
            textSize: document.getElementById('text-size-select').value,
            reduceMotion: document.getElementById('reduce-motion-toggle').checked,
            lastUpdated: new Date().toISOString()
        };
        
        // Add PWA-specific settings if available
        if (document.getElementById('vibration-toggle')) {
            settings.vibration = document.getElementById('vibration-toggle').checked;
        }
        
        if (document.getElementById('offline-mode-toggle')) {
            settings.offlineMode = document.getElementById('offline-mode-toggle').checked;
        }
        
        if (document.getElementById('orientation-select')) {
            settings.screenOrientation = document.getElementById('orientation-select').value;
        }
        
        if (document.getElementById('battery-saver-toggle')) {
            settings.batterySaver = document.getElementById('battery-saver-toggle').checked;
        }
        
        localStorage.setItem('pixelHeavenSettings', JSON.stringify(settings));
        localStorage.setItem('notificationsEnabled', settings.notifications ? 'true' : 'false');
        localStorage.setItem('clickSoundEnabled', settings.clickSound ? 'true' : 'false');
        console.log('Settings saved');
    }
    
    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('pixelHeavenSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings to toggles
            document.getElementById('darkmode-toggle').checked = settings.darkMode;
            
            // Load click sound setting
            const clickSoundEnabled = localStorage.getItem('clickSoundEnabled') === 'true';
            document.getElementById('sound-toggle').checked = clickSoundEnabled;
            
            // Check notification permission before setting toggle
            if (Notification.permission === 'granted' && 
                localStorage.getItem('notificationsEnabled') === 'true') {
                document.getElementById('notifications-toggle').checked = true;
            } else {
                document.getElementById('notifications-toggle').checked = false;
            }
            
            // Text size
            if (settings.textSize) {
                document.getElementById('text-size-select').value = settings.textSize;
                changeTextSize(settings.textSize);
            }
            
            // Reduce motion
            if (settings.reduceMotion !== undefined) {
                document.getElementById('reduce-motion-toggle').checked = settings.reduceMotion;
                toggleReduceMotion(settings.reduceMotion);
            }
            
            // Apply settings to the UI
            toggleDarkMode(settings.darkMode);
            
            // Initialize audio if click sound is enabled
            if (clickSoundEnabled) {
                initAudio();
            }
    
            // Check if dev mode was previously verified
            if (localStorage.getItem('devModeVerified') === 'true') {
                // Show animation toggle
                document.getElementById('animation-toggle-container').style.display = "flex";
                document.getElementById('animations-toggle').checked = settings.animations || false;
                toggleAnimations(settings.animations || false);
            }
            
            // PWA-specific settings
            if (document.body.classList.contains('pwa-mode')) {
                // Vibration
                if (settings.vibration !== undefined) {
                    document.getElementById('vibration-toggle').checked = settings.vibration;
                } else {
                    // Default to enabled if not set
                    document.getElementById('vibration-toggle').checked = true;
                }
                
                // Offline mode
                if (settings.offlineMode !== undefined) {
                    document.getElementById('offline-mode-toggle').checked = settings.offlineMode;
                }
                
                // Screen orientation
                if (settings.screenOrientation) {
                    document.getElementById('orientation-select').value = settings.screenOrientation;
                }
                
                // Battery saver
                if (settings.batterySaver !== undefined) {
                    document.getElementById('battery-saver-toggle').checked = settings.batterySaver;
                    toggleBatterySaver(settings.batterySaver);
                }
            }
            
            console.log('Settings loaded');
        }
        
        // Always check notification permission on load
        checkNotificationPermission();
    }
    
    // Check and synchronize notification permission with toggle
    function checkNotificationPermission() {
        const notificationToggle = document.getElementById('notifications-toggle');
        
        if (Notification.permission === 'granted' && 
            localStorage.getItem('notificationsEnabled') === 'true') {
            notificationToggle.checked = true;
        } else {
            notificationToggle.checked = false;
        }
    }
    
    // Toggle dark mode
function toggleDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

// Toggle animations
function toggleAnimations(enabled) {
    if (enabled) {
        document.body.classList.remove('no-animations');
    } else {
        document.body.classList.add('no-animations');
    }
}

// Reboot application (PWA only)
function rebootApplication() {
    if (document.body.classList.contains('pwa-mode')) {
        // Show reboot animation/message
        const rebootOverlay = document.createElement('div');
        rebootOverlay.className = 'reboot-overlay';
        rebootOverlay.innerHTML = `
            <div class="reboot-message">
                <i class="fas fa-sync fa-spin"></i>
                <p>Restarting...</p>
            </div>
        `;
        document.body.appendChild(rebootOverlay);
        
        // Wait a moment for animation, then reload the page
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    // Get the base URL for GitHub Pages
    const scope = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js', {scope: scope})
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

const settingsStyle = document.createElement('style');
settingsStyle.textContent = `
    .settings-section {
        margin-bottom: 25px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 15px;
    }
    
    .settings-section-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 15px;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .pwa-only-section {
        display: none;
    }
    
    .pwa-mode .pwa-only-section {
        display: block;
    }
    
    .reboot-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }
    
    .reboot-message {
        text-align: center;
        color: white;
    }
    
    .reboot-message i {
        font-size: 3rem;
        color: #ff6b6b;
        margin-bottom: 15px;
    }
    
    .reboot-message p {
        font-size: 1.2rem;
        margin-top: 10px;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    /* No animation class */
    .no-animations * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
    
    /* Light mode adjustments */
    .light-mode {
        background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
        color: #333;
    }
    
    .light-mode .header, 
    .light-mode .featured-section,
    .light-mode .game-card {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    .light-mode .logo,
    .light-mode .section-title {
        background: linear-gradient(45deg, #ff6b6b, #fe8c00);
        -webkit-background-clip: text;
        background-clip: text;
    }
    
    .light-mode .nav-menu a {
        color: #333;
    }
    
    .light-mode .game-card h3,
    .light-mode .footer-section h4 {
        color: #333;
    }
    
    .light-mode .category-tag {
        background: rgba(255, 107, 107, 0.2);
        color: #333;
    }
    
    /* Toast notification */
    .toast-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
        font-size: 0.9rem;
    }
    
    .toast-notification.show {
        transform: translateX(-50%) translateY(0);
    }
    
    /* Text size classes */
    .text-size-small {
        --text-scale: 0.9;
    }
    
    .text-size-medium {
        --text-scale: 1;
    }
    
    .text-size-large {
        --text-scale: 1.15;
    }
    
    .text-size-small .option-label,
    .text-size-small .settings-section-title,
    .text-size-small .game-card h3,
    .text-size-small .section-title {
        font-size: calc(1rem * var(--text-scale));
    }
    
    .text-size-small .option-description,
    .text-size-small .footer-section li a,
    .text-size-small .category-tag {
        font-size: calc(0.8rem * var(--text-scale));
    }
    
    .text-size-large .option-label,
    .text-size-large .settings-section-title,
    .text-size-large .game-card h3,
    .text-size-large .section-title {
        font-size: calc(1rem * var(--text-scale));
    }
    
    .text-size-large .option-description,
    .text-size-large .footer-section li a,
    .text-size-large .category-tag {
        font-size: calc(0.8rem * var(--text-scale));
    }
    
    /* Reduce motion */
    .reduce-motion * {
        transition-duration: 0.001s !important;
        animation-duration: 0.001s !important;
    }
    
    .reduce-motion .game-card {
        transform: none !important;
    }
    
    /* Battery saver mode */
    .battery-saver {
        --animation-speed-multiplier: 0.7;
    }
    
    .battery-saver .game-card img,
    .battery-saver .featured-section {
        filter: brightness(0.9);
    }
    
    /* Settings button styling */
    .settings-button {
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 45px;
        height: 45px;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);
        z-index: 150; /* High z-index to ensure visibility on all devices */
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    }

    .settings-button:hover i {
        transform: rotate(90deg);
    }

    /* Only adjust size slightly for smaller screens, not position */
    @media screen and (max-width: 768px) {
        .settings-button {
            width: 42px;
            height: 42px;
            font-size: 1.1rem;
        }
    }

    /* iOS safe area handling without changing position */
    @supports (-webkit-touch-callout: none) {
        .settings-button {
            /* Ensures the button doesn't get hidden by iOS UI elements */
            bottom: 30px !important;
            left: 30px !important;
        }
    }
`;
document.head.appendChild(settingsStyle);

// Initialize the settings
window.addEventListener('load', function() {
    // Check for PWA mode when page fully loads
    checkPWAMode();
    
    // Load initial settings
    loadSettings();
    
    // Initialize click sound if enabled
    if (localStorage.getItem('clickSoundEnabled') === 'true') {
        initAudio();
        document.getElementById('sound-toggle').checked = true;
    }
    
    // Add version info from the footer if available
    const footerVersion = document.querySelector('.footer-bottom p:nth-child(3)');
    const versionElement = document.querySelector('.version-number');
    
    if (footerVersion && versionElement) {
        versionElement.textContent = footerVersion.textContent.replace('V ', '');
    }
});
