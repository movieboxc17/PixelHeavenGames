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

// Mobile Navigation for iPhone and other devices
document.querySelector('.mobile-nav-toggle').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const icon = this.querySelector('i');
    
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Change icon based on menu state
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
});

// Close menu when clicking the overlay
document.querySelector('.mobile-menu-overlay').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    const icon = document.querySelector('.mobile-nav-toggle i');
    
    navMenu.classList.remove('active');
    this.classList.remove('active');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    document.body.style.overflow = '';
});

// Close menu when clicking menu items
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const icon = document.querySelector('.mobile-nav-toggle i');
        
        if (window.innerWidth <= 768) { // Only on mobile
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
});

// Add swipe support for closing the menu on iPhones
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.nav-menu').addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

document.querySelector('.nav-menu').addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, {passive: true});

function handleSwipeGesture() {
    if (touchStartX - touchEndX > 50) { // Swipe left to close
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const icon = document.querySelector('.mobile-nav-toggle i');
        
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

// iOS-specific detection and adjustments
function isiOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

if (isiOS()) {
    document.documentElement.classList.add('ios-device');
    
    // Adjust for iOS safe areas (notch)
    if (window.innerHeight >= 812) { // iPhone X or newer with notch
        document.documentElement.classList.add('has-notch');
    }
}

// Handle touch events for game cards
document.querySelectorAll('.game-card').forEach(card => {
    // Add touch events for mobile devices
    card.addEventListener('touchstart', function() {
        this.style.transform = 'translateY(-5px)';
    }, {passive: true});
    
    card.addEventListener('touchend', function() {
        this.style.transform = 'translateY(0)';
    }, {passive: true});
});

// Ensure back-to-top button works on touch devices
document.querySelector('.back-to-top').addEventListener('touchend', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}, {passive: true});

// Improve category tag interactions on mobile
document.querySelectorAll('.category-tag').forEach(tag => {
    tag.addEventListener('touchend', function() {
        // Remove active class from all tags
        document.querySelectorAll('.category-tag').forEach(t => {
            t.classList.remove('active');
        });
        // Add active class to tapped tag
        this.classList.add('active');
    }, {passive: true});
});

// Add this at the end of your script.js file
// Fix for background issues on mobile

// Detect iOS devices
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Apply specific fixes for iOS devices
if (isIOS()) {
  document.addEventListener('DOMContentLoaded', function() {
    // Fix container backgrounds
    document.querySelectorAll('.featured-section, .game-card').forEach(el => {
      el.style.backgroundColor = 'rgba(26, 26, 46, 0.85)';
    });
    
    // Force redraw to fix potential rendering issues
    document.body.style.display = 'none';
    setTimeout(function() {
      document.body.style.display = '';
    }, 10);
  });
}

// General mobile fix to ensure backgrounds render correctly
if (window.innerWidth <= 1024) {
  window.addEventListener('scroll', function() {
    // This minimal operation forces a redraw on many browsers
    document.body.style.minHeight = window.innerHeight + 'px';
    setTimeout(function() {
      document.body.style.minHeight = '';
    }, 10);
  }, {passive: true});
}
