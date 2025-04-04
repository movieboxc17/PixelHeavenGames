// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const dismissWarning = document.getElementById('dismiss-warning');
const warningAlert = document.getElementById('warning-alert');
const dismissMaintenance = document.getElementById('dismiss-maintenance');
const maintenanceAlert = document.getElementById('maintenance-alert');
const bugReportForm = document.getElementById('bug-report-form');

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeToggleText();

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
        
  updateThemeToggleText();
});

// Update theme toggle button text based on current theme
function updateThemeToggleText() {
  const currentTheme = htmlElement.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
}

// Mobile menu toggle functionality
mobileMenuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  mobileMenuToggle.innerHTML = mobileMenu.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('#mobile-menu') && 
      !event.target.closest('#mobile-menu-toggle') && 
      mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }
});

// Notification dismissal functionality
if (dismissWarning) {
  dismissWarning.addEventListener('click', () => {
    warningAlert.style.display = 'none';
    sessionStorage.setItem('warningDismissed', 'true');
  });
}

if (dismissMaintenance) {
  dismissMaintenance.addEventListener('click', () => {
    maintenanceAlert.style.display = 'none';
    sessionStorage.setItem('maintenanceDismissed', 'true');
  });
}

// Check if notifications were previously dismissed in this session
if (sessionStorage.getItem('warningDismissed') === 'true' && warningAlert) {
  warningAlert.style.display = 'none';
}

if (sessionStorage.getItem('maintenanceDismissed') === 'true' && maintenanceAlert) {
  maintenanceAlert.style.display = 'none';
}

// Bug report form submission
if (bugReportForm) {
  bugReportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const bugTitle = document.getElementById('bug-title').value;
    const bugDescription = document.getElementById('bug-description').value;
    const deviceType = document.getElementById('device-type').value;
    const browser = document.getElementById('browser').value;
    const email = document.getElementById('email').value;
    
    // In a real app, you would send this data to a server
    console.log('Bug report submitted:', {
      title: bugTitle,
      description: bugDescription,
      deviceType,
      browser,
      email
    });
    
    // Show success message
    const formContainer = bugReportForm.parentElement;
    bugReportForm.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>Thank you for your report!</h3>
        <p>We've received your bug report and will investigate the issue. If we need additional information, we'll contact you at ${email}.</p>
        <button type="button" class="btn" onclick="location.reload()">Submit Another Report</button>
      </div>
    `;
    
    // Add success styles
    formContainer.querySelector('.success-message').style.textAlign = 'center';
    formContainer.querySelector('.success-message i').style.fontSize = '3rem';
    formContainer.querySelector('.success-message i').style.color = 'var(--success)';
    formContainer.querySelector('.success-message i').style.marginBottom = '15px';
  });
}

// Add fade-in animation to elements as they enter viewport
document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = document.querySelectorAll('.bug-card, .notification, .bug-submission-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
});
