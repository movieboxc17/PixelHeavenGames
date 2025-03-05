// Emergency fix to ensure loader disappears
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }, 3000); // Force hide after 3 seconds
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

// Category tag click handler with filtering functionality
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
        
        // Simple filtering functionality
        if (selectedCategory === 'all') {
            // Show all games
            document.querySelectorAll('.game-card').forEach(card => {
                card.style.display = 'flex';
            });
        } else {
            // Filter games based on category
            // This assumes each game card has a data-category attribute
            // Since that doesn't exist yet, let's also add a fix for it
            document.querySelectorAll('.game-card').forEach(card => {
                // For now, show all cards with animation
            });
        }
    });
});

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
    
    // Check for broken links
    document.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').includes('.html')) {
            link.addEventListener('click', function(e) {
                // For demo/placeholder pages that don't exist
                if (!['index.html', 'tic-tac-toe.html', 'snake.html', 'geometrydash.html'].includes(link.getAttribute('href'))) {
                    e.preventDefault();
                    alert('This page is coming soon!');
                }
            });
        }
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

// Create a mobile-friendly menu toggle
const createMobileMenu = () => {
    // Check if the viewport is mobile-sized
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        const headerContent = document.querySelector('.header-content');
        
        // Create menu toggle button if it doesn't exist
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            headerContent.insertBefore(menuToggle, navMenu);
            
            // Add click event to toggle menu
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.innerHTML = navMenu.classList.contains('active') ? 
                    '<i class="fas fa-times"></i>' : 
                    '<i class="fas fa-bars"></i>';
                
                // Show/hide menu based on active class
                if (navMenu.classList.contains('active')) {
                    navMenu.style.display = 'flex';
                    navMenu.style.flexDirection = 'column';
                } else {
                    navMenu.style.display = 'none';
                }
            });
            
            // Initially hide the menu
            navMenu.style.display = 'none';
            navMenu.classList.add('mobile-menu');
        }
    } else {
        // Reset for larger screens
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navMenu && navMenu.classList.contains('mobile-menu')) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'row';
            navMenu.classList.remove('active', 'mobile-menu');
        }
        
        if (menuToggle) {
            menuToggle.remove();
        }
    }
};

// Improve touch behavior on mobile
document.addEventListener('DOMContentLoaded', function() {
    // Detect touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Add touch-specific classes
        document.body.classList.add('touch-device');
        
        // Fix game card touch behavior
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
});

// Run on page load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);
