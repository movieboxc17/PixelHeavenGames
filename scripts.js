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

// Mobile Menu Implementation - iOS Compatible
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.menu-overlay');
    
    function toggleMenu() {
        menuButton.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }
    
    // Toggle menu on button click
    menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        toggleMenu();
    });
    
    // Close menu when clicking menu items
    document.querySelectorAll('.nav-menu a').forEach(item => {
        item.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Handle touch events for iOS
    let touchStartX = 0;
    let touchEndX = 0;
    
    navMenu.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    navMenu.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            toggleMenu();
        }
    }, {passive: true});
});

// Fix for various iOS interaction issues
if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Fix for sticky hover effects on iOS
    document.addEventListener('touchend', function() {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A')) {
            activeElement.blur();
        }
    }, {passive: true});
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
