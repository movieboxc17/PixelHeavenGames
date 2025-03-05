// Settings Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create settings button and panel
    createSettingsElements();
    
    // Check if running as installed PWA (added to home screen)
    checkPWAMode();
    
    // Event listeners
    addEventListeners();
});

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
                    <div class="option-label">Animations</div>
                    <div class="option-description">Enable or disable animations</div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="animations-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="settings-option">
                <div>
                    <div class="option-label">Game Difficulty</div>
                    <div class="option-description">Set default difficulty level</div>
                </div>
                <div class="select-wrapper">
                    <select class="settings-select" id="difficulty-select">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                    </select>
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
            
            <div class="version-info">
                <div>PixelHeavenGames</div>
                <div>Version: <span class="version-number">18.1</span></div>
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
    
    // Animations toggle
    document.getElementById('animations-toggle').addEventListener('change', function() {
        toggleAnimations(this.checked);
    });
    
    // Difficulty select
    document.getElementById('difficulty-select').addEventListener('change', function() {
        setDifficulty(this.value);
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

// Save settings to localStorage
function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkmode-toggle').checked,
        animations: document.getElementById('animations-toggle').checked,
        difficulty: document.getElementById('difficulty-select').value,
        notifications: document.getElementById('notifications-toggle').checked,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('pixelHeavenSettings', JSON.stringify(settings));
    console.log('Settings saved');
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('pixelHeavenSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved settings to toggles and selects
        document.getElementById('darkmode-toggle').checked = settings.darkMode;
        document.getElementById('animations-toggle').checked = settings.animations;
        document.getElementById('difficulty-select').value = settings.difficulty;
        document.getElementById('notifications-toggle').checked = settings.notifications;
        
        // Apply settings to the UI
        toggleDarkMode(settings.darkMode);
        toggleAnimations(settings.animations);
        setDifficulty(settings.difficulty);
        toggleNotifications(settings.notifications);
        
        console.log('Settings loaded');
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

// Set difficulty
function setDifficulty(level) {
    console.log(`Difficulty set to: ${level}`);
    // Store for games to use when started
    localStorage.setItem('gameDifficulty', level);
}

// Toggle notifications
function toggleNotifications(enabled) {
    if (enabled) {
        // Request notification permission if needed
        if (Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
    localStorage.setItem('notificationsEnabled', enabled);
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

// Add this CSS for the reboot overlay
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
});
