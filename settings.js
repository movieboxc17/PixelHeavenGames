// Wrap the initialization in a function we can call regardless of when the script loads
function initializeSettings() {
    // Create settings button and panel
    createSettingsElements();
    
    // Check if running as installed PWA (added to home screen)
    checkPWAMode();
    
    // Event listeners
    addEventListeners();
}

// Call the initialization when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettings);
} else {
    // DOM is already loaded, initialize immediately
    initializeSettings();
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
    
    // Settings panel HTML with new options
    settingsOverlay.innerHTML = `
        <div class="settings-panel">
            <div class="settings-header">
                <div class="settings-title">Settings</div>
                <div class="close-settings"><i class="fas fa-times"></i></div>
            </div>
            
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
                    <div class="option-label">Sound Effects</div>
                    <div class="option-description">Enable game sound effects</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="sound-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="settings-option">
                <div>
                    <div class="option-label">Background Music</div>
                    <div class="option-description">Enable background music in games</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="music-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="settings-option">
                <div>
                    <div class="option-label">Language</div>
                    <div class="option-description">Select your preferred language</div>
                </div>
                <div class="select-wrapper">
                    <select id="language-select" class="settings-select">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>
            </div>
            
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
            
            <!-- PWA-only settings (initially hidden) -->
            <div class="pwa-only-settings">
                <div class="pwa-settings-header">PWA Features</div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Offline Mode</div>
                        <div class="option-description">Enable enhanced offline gameplay</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="offline-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Haptic Feedback</div>
                        <div class="option-description">Enable vibration on supported devices</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="haptic-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Cloud Save</div>
                        <div class="option-description">Sync game progress across devices</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="cloud-toggle">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                
                <div class="settings-option">
                    <div>
                        <div class="option-label">Auto Updates</div>
                        <div class="option-description">Automatically update when new versions are available</div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="autoupdate-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
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
    
    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('change', function() {
        toggleSound(this.checked);
    });
    
    // Music toggle
    document.getElementById('music-toggle').addEventListener('change', function() {
        toggleMusic(this.checked);
    });
    
    // Language select
    document.getElementById('language-select').addEventListener('change', function() {
        changeLanguage(this.value);
    });
    
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
    
    // PWA-only toggles
    const offlineToggle = document.getElementById('offline-toggle');
    if (offlineToggle) {
        offlineToggle.addEventListener('change', function() {
            toggleOfflineMode(this.checked);
        });
    }
    
    const hapticToggle = document.getElementById('haptic-toggle');
    if (hapticToggle) {
        hapticToggle.addEventListener('change', function() {
            toggleHapticFeedback(this.checked);
        });
    }
    
    const cloudToggle = document.getElementById('cloud-toggle');
    if (cloudToggle) {
        cloudToggle.addEventListener('change', function() {
            toggleCloudSave(this.checked);
        });
    }
    
    const autoUpdateToggle = document.getElementById('autoupdate-toggle');
    if (autoUpdateToggle) {
        autoUpdateToggle.addEventListener('change', function() {
            toggleAutoUpdate(this.checked);
        });
    }
    
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
        
        // Show PWA-only settings
        const pwaSettings = document.querySelector('.pwa-only-settings');
        if (pwaSettings) {
            pwaSettings.style.display = 'block';
        }
        
        console.log('Running as installed PWA');
    } else {
        // Hide PWA-only settings
        const pwaSettings = document.querySelector('.pwa-only-settings');
        if (pwaSettings) {
            pwaSettings.style.display = 'none';
        }
        
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

// Toggle sound effects
function toggleSound(enabled) {
    localStorage.setItem('soundEnabled', enabled);
    console.log('Sound effects ' + (enabled ? 'enabled' : 'disabled'));
    
    // If enabled, play a test sound
    if (enabled) {
        playTestSound();
    }
}

// Play a test sound effect
function playTestSound() {
    try {
        const testSound = new Audio('sounds/click.mp3');
        testSound.volume = 0.5;
        testSound.play().catch(error => console.log('Audio play failed:', error));
    } catch (error) {
        console.log('Could not play test sound:', error);
    }
}

// Toggle background music
function toggleMusic(enabled) {
    localStorage.setItem('musicEnabled', enabled);
    console.log('Background music ' + (enabled ? 'enabled' : 'disabled'));
    
    // Control background music if it exists
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        if (enabled) {
            bgMusic.play().catch(error => console.log('Music play failed:', error));
        } else {
            bgMusic.pause();
        }
    }
}

// Change language
function changeLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
    console.log('Language changed to: ' + language);
    
    // In a real implementation, this would trigger a translation function
    // For now, we'll just show a message
    const message = document.createElement('div');
    message.className = 'language-change-message';
    message.textContent = 'Language will change after restart';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
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
            icon: 'icon.png', // Use the same icon as the app
            badge: 'icon.png',
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

// PWA-only functions
function toggleOfflineMode(enabled) {
    if (!document.body.classList.contains('pwa-mode')) return;
    
    localStorage.setItem('offlineMode', enabled);
    console.log('Offline mode ' + (enabled ? 'enabled' : 'disabled'));
    
    // In a real app, this would configure the service worker's caching strategy
    if (enabled) {
        // Show confirmation message
        showToast('Enhanced offline mode enabled. Game content will be available offline.');
    } else {
        showToast('Standard offline mode. Some features may not work without a connection.');
    }
}

function toggleHapticFeedback(enabled) {
    if (!document.body.classList.contains('pwa-mode')) return;
    
    localStorage.setItem('hapticFeedback', enabled);
    console.log('Haptic feedback ' + (enabled ? 'enabled' : 'disabled'));
    
    // Test vibration if enabled and supported
    if (enabled && 'vibrate' in navigator) {
        navigator.vibrate(100);
    }
}

function toggleCloudSave(enabled) {
    if (!document.body.classList.contains('pwa-mode')) return;
    
    localStorage.setItem('cloudSave', enabled);
    console.log('Cloud save ' + (enabled ? 'enabled' : 'disabled'));
    
    // Show sync icon animation
    if (enabled) {
        const syncIcon = document.createElement('div');
        syncIcon.className = 'sync-icon';
        syncIcon.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
        document.body.appendChild(syncIcon);
        
        setTimeout(() => {
            syncIcon.remove();
        }, 2000);
    }
}

function toggleAutoUpdate(enabled) {
    if (!document.body.classList.contains('pwa-mode')) return;
    
    localStorage.setItem('autoUpdate', enabled);
    console.log('Auto updates ' + (enabled ? 'enabled' : 'disabled'));
    
    if (enabled) {
        showToast('Auto updates enabled. New versions will be installed automatically.');
    } else {
        showToast('Auto updates disabled. You will be prompted before installing updates.');
    }
}

// Display toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'settings-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add visible class to trigger animation
    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
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

// Update the loadSettings function to properly check notification permission
function loadSettings() {
    const savedSettings = localStorage.getItem('pixelHeavenSettings');
    
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings to toggles
            document.getElementById('darkmode-toggle').checked = settings.darkMode !== false; // Default to true
            document.getElementById('sound-toggle').checked = settings.sound !== false; // Default to true
            document.getElementById('music-toggle').checked = settings.music !== false; // Default to true
            
            // Set language select
            if (settings.language) {
                document.getElementById('language-select').value = settings.language;
            }
            
            // Check notification permission before setting toggle
            if (Notification.permission === 'granted' && 
                localStorage.getItem('notificationsEnabled') === 'true') {
                document.getElementById('notifications-toggle').checked = true;
            } else {
                document.getElementById('notifications-toggle').checked = false;
            }
            
            // Apply settings to the UI
            toggleDarkMode(settings.darkMode !== false);
            
            // PWA-only settings
            if (document.body.classList.contains('pwa-mode')) {
                const offlineToggle = document.getElementById('offline-toggle');
                const hapticToggle = document.getElementById('haptic-toggle');
                const cloudToggle = document.getElementById('cloud-toggle');
                const autoUpdateToggle = document.getElementById('autoupdate-toggle');
                
                if (offlineToggle) offlineToggle.checked = settings.offlineMode !== false;
                if (hapticToggle) hapticToggle.checked = settings.hapticFeedback === true;
                if (cloudToggle) cloudToggle.checked = settings.cloudSave === true;
                if (autoUpdateToggle) autoUpdateToggle.checked = settings.autoUpdate !== false;
            }
            
            // Check if dev mode was previously verified
            if (localStorage.getItem('devModeVerified') === 'true') {
                // Show animation toggle
                document.getElementById('animation-toggle-container').style.display = "flex";
                document.getElementById('animations-toggle').checked = settings.animations || false;
                toggleAnimations(settings.animations || false);
            }
            
            console.log('Settings loaded');
        } catch (error) {
            console.error('Error loading settings:', error);
            // If settings are corrupted, create new default settings
            saveSettings();
        }
    } else {
        // First time user, set defaults
        const defaultSettings = {
            darkMode: true,
            sound: true,
            music: true,
            language: 'en',
            animations: false,
            notifications: false,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('pixelHeavenSettings', JSON.stringify(defaultSettings));
    }
    
    // Always check notification permission on load
    checkNotificationPermission();
}

// Check and synchronize notification permission with toggle
function checkNotificationPermission() {
    const notificationToggle = document.getElementById('notifications-toggle');
    if (!notificationToggle) return;
    
    if (Notification.permission === 'granted' && 
        localStorage.getItem('notificationsEnabled') === 'true') {
        notificationToggle.checked = true;
    } else {
        notificationToggle.checked = false;
    }
}

// Update the saveSettings function to include notification state
function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkmode-toggle').checked,
        sound: document.getElementById('sound-toggle').checked,
        music: document.getElementById('music-toggle').checked,
        language: document.getElementById('language-select').value,
        animations: document.getElementById('animations-toggle').checked,
        notifications: document.getElementById('notifications-toggle').checked && 
                      Notification.permission === 'granted',
        lastUpdated: new Date().toISOString()
    };
    
    // Add PWA-only settings if in PWA mode
    if (document.body.classList.contains('pwa-mode')) {
        const offlineToggle = document.getElementById('offline-toggle');
        const hapticToggle = document.getElementById('haptic-toggle');
        const cloudToggle = document.getElementById('cloud-toggle');
        const autoUpdateToggle = document.getElementById('autoupdate-toggle');
        
        if (offlineToggle) settings.offlineMode = offlineToggle.checked;
        if (hapticToggle) settings.hapticFeedback = hapticToggle.checked;
        if (cloudToggle) settings.cloudSave = cloudToggle.checked;
        if (autoUpdateToggle) settings.autoUpdate = autoUpdateToggle.checked;
    }
    
    localStorage.setItem('pixelHeavenSettings', JSON.stringify(settings));
    localStorage.setItem('notificationsEnabled', settings.notifications ? 'true' : 'false');
    console.log('Settings saved');
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

// Add styles for the reboot overlay and other effects
const style = document.createElement('style');
style.textContent = `
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
    
    .no-animations * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
`;
document.head.appendChild(style);

// Initialize the settings
window.addEventListener('load', function() {
    // Check for PWA mode when page fully loads
    checkPWAMode();
    
    // Load initial settings
    loadSettings();
    
    // Add version info from the footer if available
    const footerVersion = document.querySelector('.footer-bottom p:nth-child(3)');
    const versionElement = document.querySelector('.version-number');
    
    if (footerVersion && versionElement) {
        versionElement.textContent = footerVersion.textContent.replace('V ', '');
    }
    
    // Initialize notification state
    const notificationEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    const notificationToggle = document.getElementById('notifications-toggle');
    
    if (notificationToggle) {
        if (notificationEnabled && Notification.permission === 'granted') {
            notificationToggle.checked = true;
        } else {
            notificationToggle.checked = false;
        }
    }
});
