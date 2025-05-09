// Hide loader after page load
window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            // After animation completes, remove from DOM for better performance
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }, 1000);
});

// Back to top button functionality 
document.querySelector('.back-to-top').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/Hide back to top button based on scroll position
window.addEventListener('scroll', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

// Category tag click handler
document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        // Remove active class from all tags
        document.querySelectorAll('.category-tag').forEach(t => {
            t.classList.remove('active');
        });
        // Add active class to clicked tag
        this.classList.add('active');
    });
});

// Game card hover effects
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Navigation menu active state
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// Improved Mobile navigation toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            navMenu.classList.toggle('active');
            
            // Toggle body scroll
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            
            // Change icon between bars and times
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Set height for iOS
            if (navMenu.classList.contains('active')) {
                navMenu.style.height = `${window.innerHeight}px`;
            }
        });
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    
    if (navMenu && mobileNavToggle && 
        navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileNavToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Handle orientation change for better mobile experience
window.addEventListener('orientationchange', function() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Reset height after orientation change
        setTimeout(() => {
            setFullHeight();
        }, 100);
    }
});

// Add manifest.json file for PWA capabilities - Fixed for local development
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
} else if (window.location.protocol === 'file:') {
    console.log('Running in local mode. ServiceWorker registration skipped.');
}

// Only load manifest.json when on a proper server
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.protocol === 'file:') {
        // Remove manifest link when on file:// protocol
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            manifestLink.remove();
        }
        console.log('Running in local file mode - PWA features disabled');
    }
});

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// Prevent body scrolling when mobile menu is open
function toggleBodyScroll(disable) {
    document.body.style.overflow = disable ? 'hidden' : 'auto';
}

// Fix iOS 100vh issue for full-screen elements
function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update active nav menu height if open
    const navMenu = document.querySelector('.nav-menu.active');
    if (navMenu) {
        navMenu.style.height = `${window.innerHeight}px`;
    }
}

// Set initial height and update on resize
setFullHeight();
window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);

// Add active touch feedback
document.querySelectorAll('.play-button, .category-tag, .back-to-top').forEach(element => {
    element.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
    });
    
    element.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
    });
});

// Disable pull-to-refresh on mobile browsers for a more app-like feel
document.body.addEventListener('touchmove', function(e) {
    if (e.target.closest('.game-card') || e.target.closest('.featured-section') || e.target.closest('.categories')) {
        // Allow scrolling in these components
        return;
    }
    
    if (window.scrollY === 0 && e.touches[0].screenY > 0) {
        e.preventDefault();
    }
}, { passive: false });

// iOS-specific fixes
document.addEventListener('DOMContentLoaded', function() {
    // Fix for 100vh on iOS
    const setHeight = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    // Set initial height
    setHeight();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setHeight);
    window.addEventListener('orientationchange', setHeight);
    
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
        document.body.classList.add('ios-device');
        
        // Fix for sticky hover states on iOS
        document.addEventListener('touchend', function() {}, false);
        
        // Fix specific iOS Safari issues
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
            document.body.classList.add('ios-safari');
        }
        
        // Special fix for iOS menu
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        if (mobileNavToggle) {
            mobileNavToggle.addEventListener('touchend', function(e) {
                e.preventDefault();
                // Trigger click event after a brief delay to avoid stuck hover states
                setTimeout(() => {
                    this.click();
                }, 10);
            });
        }
    }
});
