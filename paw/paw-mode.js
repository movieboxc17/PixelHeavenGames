// Paw Mode Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add paw mode toggle to settings panel
    addPawModeToggle();
    
    // Check if paw mode was previously enabled
    checkPawModeStatus();
    
    // Add paw trail effect when mouse moves
    document.addEventListener('mousemove', createPawTrail);
});

// Add paw mode toggle to settings panel
function addPawModeToggle() {
    // Create the toggle option HTML
    const pawModeToggle = document.createElement('div');
    pawModeToggle.className = 'settings-option';
    pawModeToggle.innerHTML = `
        <div>
            <div class="option-label">Paw Mode</div>
            <div class="option-description">Enable fun paw-themed effects</div>
        </div>
        <label class="toggle-switch">
            <input type="checkbox" id="paw-mode-toggle">
            <span class="toggle-slider"></span>
        </label>
    `;
    
    // Find where to insert the toggle in settings panel
    const notificationsOption = document.querySelector('.settings-option:last-of-type');
    if (notificationsOption) {
        notificationsOption.parentNode.insertBefore(pawModeToggle, notificationsOption);
    }
    
    // Add event listener for the toggle
    document.getElementById('paw-mode-toggle').addEventListener('change', function() {
        togglePawMode(this.checked);
    });
    
    // Modify the saveSettings function to include paw mode
    const originalSaveSettings = window.saveSettings;
    window.saveSettings = function() {
        // Call the original function first
        if (originalSaveSettings) {
            originalSaveSettings();
        }
        
        // Save paw mode setting
        const pawModeEnabled = document.getElementById('paw-mode-toggle').checked;
        localStorage.setItem('pawModeEnabled', pawModeEnabled ? 'true' : 'false');
        console.log('Paw mode setting saved:', pawModeEnabled);
    };
    
    // Modify the loadSettings function to load paw mode state
    const originalLoadSettings = window.loadSettings;
    window.loadSettings = function() {
        // Call the original function first
        if (originalLoadSettings) {
            originalLoadSettings();
        }
        
        // Load paw mode setting
        const pawModeEnabled = localStorage.getItem('pawModeEnabled') === 'true';
        document.getElementById('paw-mode-toggle').checked = pawModeEnabled;
        togglePawMode(pawModeEnabled);
        console.log('Paw mode setting loaded:', pawModeEnabled);
    };
}

// Toggle paw mode on/off
function togglePawMode(enabled) {
    if (enabled) {
        document.body.classList.add('paw-mode');
        playPawSound();
        showPawNotification();
    } else {
        document.body.classList.remove('paw-mode');
        document.querySelectorAll('.paw-trail').forEach(el => el.remove());
    }
    
    localStorage.setItem('pawModeEnabled', enabled ? 'true' : 'false');
}

// Check if paw mode was previously enabled
function checkPawModeStatus() {
    const pawModeEnabled = localStorage.getItem('pawModeEnabled') === 'true';
    if (pawModeEnabled) {
        document.body.classList.add('paw-mode');
        
        // Make sure the toggle is updated when available
        const pawToggle = document.getElementById('paw-mode-toggle');
        if (pawToggle) {
            pawToggle.checked = true;
        }
    }
}

// Create paw trail effect when mouse moves
function createPawTrail(e) {
    // Only create trail if paw mode is active
    if (!document.body.classList.contains('paw-mode')) return;
    
    // Limit the frequency of paw prints
    if (Math.random() > 0.1) return;
    
    // Create paw print element
    const pawPrint = document.createElement('div');
    pawPrint.className = 'paw-trail';
    
    // Position where mouse is
    pawPrint.style.left = (e.clientX - 15) + 'px';
    pawPrint.style.top = (e.clientY - 15) + 'px';
    
    // Random rotation for variety
    const rotation = Math.random() * 360;
    pawPrint.style.transform = `rotate(${rotation}deg)`;
    
    // Add to body
    document.body.appendChild(pawPrint);
    
    // Remove after animation completes
    setTimeout(() => {
        if (pawPrint && pawPrint.parentNode) {
            pawPrint.parentNode.removeChild(pawPrint);
        }
    }, 1000);
}

// Play a cute paw sound when mode is enabled
function playPawSound() {
    // Check if click sound is enabled (reuse existing sound logic)
    if (localStorage.getItem('clickSoundEnabled') === 'true') {
        const pawSound = new Audio('paw/paw-sound.mp3');
        pawSound.volume = 0.5;
        pawSound.play().catch(e => console.error('Error playing paw sound:', e));
    }
}

// Show notification when paw mode is enabled
function showPawNotification() {
    // Check if notifications are permitted
    if (Notification.permission === 'granted' && 
        localStorage.getItem('notificationsEnabled') === 'true') {
        const notification = new Notification('Paw Mode Activated!', {
            body: 'Your PixelHeavenGames experience just got more pawsome!',
            icon: 'paw/paw-notification.png',
            badge: 'paw/paw-badge.png',
            vibrate: [100, 50, 100],
            tag: 'paw-mode-notification'
        });
        
        // Close notification after 3 seconds
        setTimeout(() => {
            notification.close();
        }, 3000);
    }
}

// Add Easter Egg - typing "pawsome" anywhere triggers temporary paw explosion
document.addEventListener('keydown', function(e) {
    // Track keystrokes to detect "pawsome"
    window.keystrokeBuffer = window.keystrokeBuffer || '';
    window.keystrokeBuffer += e.key.toLowerCase();
    
    // Keep only last 7 characters
    if (window.keystrokeBuffer.length > 7) {
        window.keystrokeBuffer = window.keystrokeBuffer.substring(
            window.keystrokeBuffer.length - 7
        );
    }
    
    // Check if "pawsome" was typed
    if (window.keystrokeBuffer === "pawsome") {
        createPawExplosion();
        window.keystrokeBuffer = '';
    }
});

// Create a burst of paw prints on screen
function createPawExplosion() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const pawPrint = document.createElement('div');
            pawPrint.className = 'paw-trail';
            
            // Random position
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            pawPrint.style.left = x + 'px';
            pawPrint.style.top = y + 'px';
            
            // Random rotation
            const rotation = Math.random() * 360;
            pawPrint.style.transform = `rotate(${rotation}deg)`;
            
            // Random size
            const size = 20 + Math.random() * 40;
            pawPrint.style.width = size + 'px';
            pawPrint.style.height = size + 'px';
            
            // Add to body
            document.body.appendChild(pawPrint);
            
            // Play sound if enabled
            if (i === 0) {
                playPawSound();
            }
            
            // Remove after animation
            setTimeout(() => {
                if (pawPrint && pawPrint.parentNode) {
                    pawPrint.parentNode.removeChild(pawPrint);
                }
            }, 1500);
        }, i * 50); // Stagger the appearance
    }
}
