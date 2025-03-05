// Reliable loader fix
document.addEventListener('DOMContentLoaded', function() {
    // Force hide loader after a short delay
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            // Completely remove from DOM after transition
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// Fix back-to-top button
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Remove any existing event listeners
        const newButton = backToTopButton.cloneNode(true);
        backToTopButton.parentNode.replaceChild(newButton, backToTopButton);
        
        // Add new event listener
        newButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide based on scroll position
        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                newButton.style.opacity = '1';
                newButton.style.visibility = 'visible';
            } else {
                newButton.style.opacity = '0';
                newButton.style.visibility = 'hidden';
            }
        }
        
        toggleBackToTopButton();
        window.addEventListener('scroll', toggleBackToTopButton);
    }
});
// Fix category tags
document.addEventListener('DOMContentLoaded', function() {
    const categoryTags = document.querySelectorAll('.category-tag');
    
    // Remove any existing event listeners
    categoryTags.forEach(tag => {
        const newTag = tag.cloneNode(true);
        tag.parentNode.replaceChild(newTag, tag);
    });
    
    // Add new, reliable event listeners
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            document.querySelectorAll('.category-tag').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Get selected category
            const selectedCategory = this.textContent.toLowerCase();
            
            // Show all games by default
            document.querySelectorAll('.game-card').forEach(card => {
                card.style.display = 'flex';
            });
        });
    });
});
// Fix game card issues
document.addEventListener('DOMContentLoaded', function() {
    // Make sure game cards have proper sizing and layout
    function fixGameCardLayout() {
        const gameCards = document.querySelectorAll('.game-card');
        const gameRows = document.querySelectorAll('.game-row');
        
        // Reset any problematic inline styles
        gameCards.forEach(card => {
            // Keep only necessary inline styles
            card.style.transform = '';
            
            // Fix image sizing
            const img = card.querySelector('.game-image');
            if (img) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.maxHeight = '200px';
            }
        });
        
        // Reset row layout if needed
        gameRows.forEach(row => {
            row.style.display = 'flex';
            row.style.flexWrap = 'wrap';
        });
    }
    
    fixGameCardLayout();
    window.addEventListener('resize', fixGameCardLayout);
    window.addEventListener('orientationchange', function() {
        setTimeout(fixGameCardLayout, 300);
    });
    
    // Fix hover effects on mobile
    const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Remove all hover card animations for touch devices
        const style = document.createElement('style');
        style.textContent = `
            .game-card:hover { 
                transform: none !important; 
            }
            .game-card:hover .game-image {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    } else {
        // Game card hover effects - mobile-friendly version
        document.querySelectorAll('.game-card').forEach(card => {
            // Only apply hover effects on non-touch devices
            if (window.matchMedia("(hover: hover)").matches) {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            }
        });
    }
});

// Navigation menu active state
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});

// Create placeholder image if missing
function createPlaceholderImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    
    const ctx = canvas.getContext('2d');
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Image Coming Soon', canvas.width/2, canvas.height/2);
    
    // Create image URL
    return canvas.toDataURL('image/png');
}

// Handle missing image files
document.addEventListener('DOMContentLoaded', function() {
    // Create a placeholder image
    const placeholderDataUrl = createPlaceholderImage();
    
    // Replace missing image files with placeholders
    const imagesToFix = ['game3.jpg', 'game4.jpg', 'game5.jpg', 'game6.jpg', 'game7.jpg', 'game8.jpg'];
    
    document.querySelectorAll('.game-image').forEach(img => {
        const imgSrc = img.getAttribute('src');
        if (imagesToFix.some(name => imgSrc.includes(name))) {
            img.src = placeholderDataUrl;
        }
        
        // Also add a general error handler
        img.onerror = function() {
            this.src = placeholderDataUrl;
            this.onerror = null; // Prevent infinite loops
        };
    });
    
    // Properly remove the loader after animation completes
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            // Remove from DOM after fade out
            setTimeout(function() {
                loader.style.display = 'none';
            }, 1000);
        }
    }, 2000);
    
    // Add "All" category tag at the beginning
    const categoriesDiv = document.querySelector('.categories');
    if (categoriesDiv) {
        const allTag = document.createElement('div');
        allTag.className = 'category-tag active';
        allTag.textContent = 'All';
        categoriesDiv.insertBefore(allTag, categoriesDiv.firstChild);
        
        // Add event listener to the new tag
        allTag.addEventListener('click', function() {
            document.querySelectorAll('.category-tag').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            document.querySelectorAll('.game-card').forEach(card => {
                card.style.display = 'flex';
            });
        });
    }
    
    // Remove the inline onclick handler to prevent double execution
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        backToTopButton.removeAttribute('onclick');
    }
    // Make sure all links work properly
    document.querySelectorAll('a').forEach(link => {
        // Remove any existing click event listeners that might prevent navigation
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
    });
    // Add form validation for any forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.color = '#ff6b6b';
                        errorMsg.style.fontSize = '0.8em';
                        errorMsg.style.marginTop = '5px';
                        
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    // Remove error message if it exists
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.nextElementSibling.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
});
// Fix mobile menu issues
document.addEventListener('DOMContentLoaded', function() {
    // Clean implementation of mobile menu
    function setupMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const headerContent = document.querySelector('.header-content');
        
        // Remove any existing toggle to prevent duplicates
        const existingToggle = document.querySelector('.menu-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }
        
        // Create new menu toggle for mobile
        if (window.innerWidth <= 768) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            headerContent.appendChild(menuToggle);
            
            // Reset menu state
            navMenu.style.display = 'none';
            navMenu.classList.add('mobile-menu');
            navMenu.classList.remove('active');
            navMenu.style.transform = '';
            navMenu.style.opacity = '';
            
            // Simple toggle without animations first (fixing race conditions)
            menuToggle.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navMenu.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                } else {
                    navMenu.classList.add('active');
                    navMenu.style.display = 'flex';
                    this.innerHTML = '<i class="fas fa-times"></i>';
                }
            });
        } else {
            // Desktop view
            navMenu.style.display = 'flex';
            navMenu.classList.remove('mobile-menu', 'active');
        }
    }
    
    // Run on load and resize
    setupMobileMenu();
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupMobileMenu, 250);
    });
});

// Improve touch experience
document.addEventListener('DOMContentLoaded', function() {
    // Detect device type
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);
    
    // Add appropriate class to body
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // Make game cards touch-friendly
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            // Prevent hover effect sticking on touch
            card.addEventListener('touchstart', function() {
                this.setAttribute('data-touched', 'true');
            }, {passive: true});
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.removeAttribute('data-touched');
                }, 100);
            }, {passive: true});
        });
        
        // Make category tags touch-friendly
        const categoryTags = document.querySelectorAll('.category-tag');
        categoryTags.forEach(tag => {
            tag.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            }, {passive: true});
            
            tag.addEventListener('touchend', function() {
                this.style.transform = 'none';
            }, {passive: true});
        });
    }
    
    // Fix orientation change issues
    window.addEventListener('orientationchange', function() {
        // Small timeout to let the browser adjust
        setTimeout(() => {
            // Force refresh mobile menu
            enhanceMobileMenu();
            
            // Force recalculate game card layout
            const gameRows = document.querySelectorAll('.game-row');
            gameRows.forEach(row => {
                row.style.display = 'none';
                setTimeout(() => {
                    row.style.display = 'flex';
                }, 10);
            });
        }, 200);
    });
});
// Run on page load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// iOS-specific fixes
document.addEventListener('DOMContentLoaded', function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS class to enable specific styling
        document.body.classList.add('ios-device');
        
        // Fix 100vh issue on iOS
        const fixIOSHeight = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        
        // Run on page load
        fixIOSHeight();
        
        // Run on resize and orientation change
        window.addEventListener('resize', fixIOSHeight);
        window.addEventListener('orientationchange', fixIOSHeight);
        
        // Fix double-tap issue
        document.querySelectorAll('a, button, .category-tag').forEach(el => {
            el.addEventListener('touchend', e => {
                e.preventDefault();
                // Trigger click
                setTimeout(() => {
                    if (e.target.tagName === 'A') {
                        window.location.href = e.target.href;
                    } else {
                        e.target.click();
                    }
                }, 10);
            }, {passive: false});
        });
    }
});

// Failsafe to prevent UI glitches
window.addEventListener('load', function() {
    // Force redraw all potentially problematic elements after page fully loads
    setTimeout(function() {
        const elements = [
            '.nav-menu',
            '.game-card',
            '.game-row',
            '.category-tag',
            '.back-to-top'
        ];
        
        elements.forEach(selector => {
            const items = document.querySelectorAll(selector);
            items.forEach(item => {
                // Force a repaint
                item.style.display = 'none';
                item.offsetHeight; // Force reflow
                item.style.display = '';
            });
        });
    }, 1000);
});
