// Intersection Observer for scroll animations
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  return observer;
};

// Smooth scroll to element
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Parallax effect for hero sections
export const initParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
};

// Typing animation effect
export const typeWriter = (element, text, speed = 100) => {
  let i = 0;
  element.innerHTML = '';
  
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
};

// Counter animation
export const animateCounter = (element, target, duration = 2000) => {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
};

// Fade in elements on load
export const fadeInOnLoad = () => {
  const elements = document.querySelectorAll('.fade-in-on-load');
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('opacity-100');
    }, index * 100);
  });
};

// Initialize all animations
export const initAnimations = () => {
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize parallax effects
  initParallax();
  
  // Fade in elements on page load
  fadeInOnLoad();
  
  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToElement(targetId, 80); // 80px offset for fixed header
    });
  });
};

// Utility function to add loading states
export const addLoadingState = (button, loadingText = 'Loading...') => {
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = `
    <div class="flex items-center">
      <div class="loading-spinner w-4 h-4 mr-2"></div>
      ${loadingText}
    </div>
  `;
  
  return () => {
    button.disabled = false;
    button.textContent = originalText;
  };
};

// Utility function to show toast notifications
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
    type === 'success' ? 'bg-success-500 text-white' :
    type === 'error' ? 'bg-error-500 text-white' :
    type === 'warning' ? 'bg-warning-500 text-white' :
    'bg-primary-500 text-white'
  }`;
  
  toast.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, 5000);
};

// Utility function to handle form validation
export const validateForm = (formData) => {
  const errors = {};
  
  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (formData.password) {
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
  }
  
  // Required field validation
  Object.keys(formData).forEach(key => {
    if (formData[key] === '' || formData[key] === null || formData[key] === undefined) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  });
  
  return errors;
};

// Utility function to format dates
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Utility function to format numbers with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Utility function to truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Export default function to initialize everything
export default initAnimations; 