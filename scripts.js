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

// Simple Mobile Menu Implementation
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    // Function to toggle menu
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }
    
    // Toggle menu when clicking the hamburger icon
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });
    }
    
    // Close menu when clicking the overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleMenu();
        });
    }
    
    // Close menu when clicking menu items
    document.querySelectorAll('.nav-menu a').forEach(item => {
        item.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
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

// Reliable mobile device detection
document.addEventListener('DOMContentLoaded', function() {
  // Function to detect mobile devices
  function isMobileDevice() {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        
      // Check multiple properties for better detection
      return (
          // Check user agent
          mobileRegex.test(navigator.userAgent) ||
          // Check if touch points > 0
          (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
          // Check CSS media query through JavaScript
          window.matchMedia("(max-width: 768px)").matches
      );
  }
    
  // Function specifically for iOS detection
  function isIOSDevice() {
      // iOS detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.userAgent.includes("Mac") && "ontouchend" in document);
        
      if (isIOS) {
          console.log("iOS device detected");
      }
      return isIOS;
  }
    
  // Apply appropriate classes to HTML element
  if (isMobileDevice()) {
      document.documentElement.classList.add('mobile-device');
      console.log("Mobile device detected");
        
      if (isIOSDevice()) {
          document.documentElement.classList.add('ios-device');
            
          // Check for notched iPhones
          if (window.screen.height >= 812 || window.screen.width >= 812) {
              document.documentElement.classList.add('has-notch');
              console.log("Device with notch detected");
          }
      }
  }

  // Debug device detection (remove in production)
  function updateDebugInfo() {
      const debugElement = document.getElementById('device-debug');
      if (debugElement) {
          debugElement.innerHTML = 
              `Device: ${navigator.userAgent.substring(0, 50)}...<br>` +
              `Screen: ${window.screen.width}x${window.screen.height}<br>` +
              `Classes: ${document.documentElement.className}`;
      }
  }
  updateDebugInfo();
});

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
