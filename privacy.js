document.addEventListener('DOMContentLoaded', function() {
    // Show privacy consent banner after a short delay
    setTimeout(function() {
        const privacyConsent = document.querySelector('.privacy-consent');
        if (privacyConsent && !getCookie('cookiesAccepted')) {
            privacyConsent.classList.add('show');
        }
    }, 1500);
    
    // Privacy consent buttons - add event listeners if elements exist
    const acceptBtn = document.querySelector('.privacy-btn.accept');
    const customizeBtn = document.querySelector('.privacy-btn.customize');
    const declineBtn = document.querySelector('.privacy-btn.decline');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            // Accept all cookies
            setCookie('cookiesAccepted', 'all', 365);
            
            // Hide consent banner
            const banner = document.querySelector('.privacy-consent');
            if (banner) banner.classList.remove('show');
            
            // Show confirmation toast
            showToast('All cookies accepted. Thank you!', 'success');
        });
    }
    
    if (customizeBtn) {
        customizeBtn.addEventListener('click', function() {
            // Show cookie settings modal (if it exists)
            const cookieModal = document.querySelector('.cookie-settings-modal');
            if (cookieModal) cookieModal.classList.add('show');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            // Accept only essential cookies
            setCookie('cookiesAccepted', 'essential', 365);
            
            // Hide consent banner
            const banner = document.querySelector('.privacy-consent');
            if (banner) banner.classList.remove('show');
            
            // Show confirmation toast
            showToast('Non-essential cookies declined', 'info');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            // Close cookie settings modal
            cookieModal.classList.remove('show');
        });
    }
    
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', function() {
            // Save cookie preferences
            const performanceCookies = document.getElementById('performance-cookies').checked;
            const functionalCookies = document.getElementById('functional-cookies').checked;
            const targetingCookies = document.getElementById('targeting-cookies').checked;
            
            setCookie('cookiesAccepted', 'custom', 365);
            setCookie('performanceCookies', performanceCookies.toString(), 365);
            setCookie('functionalCookies', functionalCookies.toString(), 365);
            setCookie('targetingCookies', targetingCookies.toString(), 365);
            
            // Close cookie settings modal
            cookieModal.classList.remove('show');
            
            // Hide consent banner
            document.querySelector('.privacy-consent').classList.remove('show');
            
            // Show confirmation toast
            showToast('Cookie preferences saved successfully', 'success');
        });
    }
    
    // Initialize toggle states based on saved preferences
    updateToggleStates();
    
    // Helper functions
    function updateToggleStates() {
        const performanceToggle = document.getElementById('performance-cookies');
        const functionalToggle = document.getElementById('functional-cookies');
        const targetingToggle = document.getElementById('targeting-cookies');
        
        if (performanceToggle) {
            performanceToggle.checked = getCookie('performanceCookies') === 'true';
        }
        
        if (functionalToggle) {
            functionalToggle.checked = getCookie('functionalCookies') === 'true';
        }
        
        if (targetingToggle) {
            targetingToggle.checked = getCookie('targetingCookies') === 'true';
        }
    }
    
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }
    
    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    function showToast(message, type = 'info') {
        // Create toast if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set message and type
        toast.textContent = message;
        toast.className = 'toast toast-' + type;
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
