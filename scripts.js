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

// Mobile Navigation Toggle
document.querySelector('.mobile-nav-toggle').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
    
    // Change icon based on menu state
    const icon = this.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(event.target) && 
        !mobileNavToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

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
