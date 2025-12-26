// EduAsesor - Main JavaScript File
// Interactive Student Advisory Platform

// Global variables
let currentUser = null;
let appointments = [];
let calendarData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeVantaBackground();
    initializeModals();
    initializeForms();
    initializeCalendar();
    initializeScrollEffects();
    updateDateTime();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    
    console.log('EduAsesor platform initialized successfully');
});

// Initialize Vanta.js background
function initializeVantaBackground() {
    if (typeof VANTA !== 'undefined') {
        VANTA.BIRDS({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xf8fafc,
            color1: 0x667eea,
            color2: 0x764ba2,
            colorMode: 'lerp',
            birdSize: 1.20,
            wingSpan: 25.00,
            speedLimit: 4.00,
            separation: 20.00,
            alignment: 20.00,
            cohesion: 20.00,
            quantity: 3.00
        });
    }
}

// Initialize modal functionality
function initializeModals() {
    // Login modal
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const showRegisterModal = document.getElementById('showRegisterModal');
    
    // Register modal
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const showLoginModal = document.getElementById('showLoginModal');
    
    // Appointment modal
    const addAppointmentBtn = document.getElementById('addAppointmentBtn');
    const appointmentModal = document.getElementById('appointmentModal');
    const closeAppointmentModal = document.getElementById('closeAppointmentModal');
    
    // Event listeners for modals
    loginBtn?.addEventListener('click', () => showModal(loginModal));
    closeLoginModal?.addEventListener('click', () => hideModal(loginModal));
    showRegisterModal?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(loginModal);
        showModal(registerModal);
    });
    
    registerBtn?.addEventListener('click', () => showModal(registerModal));
    closeRegisterModal?.addEventListener('click', () => hideModal(registerModal));
    showLoginModal?.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(registerModal);
        showModal(loginModal);
    });
    
    addAppointmentBtn?.addEventListener('click', () => showModal(appointmentModal));
    closeAppointmentModal?.addEventListener('click', () => hideModal(appointmentModal));
    
    // Close modals when clicking outside
    [loginModal, registerModal, appointmentModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
    
    // Start button functionality
    const startBtn = document.getElementById('startBtn');
    startBtn?.addEventListener('click', () => {
        if (currentUser) {
            showDashboard();
        } else {
            showModal(registerModal);
        }
    });
}

// Show modal function
function showModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal function
function hideModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Initialize form functionality
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', handleLogin);
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', handleRegister);
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', handleContact);
    
    // Appointment form
    const appointmentForm = document.getElementById('appointmentForm');
    appointmentForm?.addEventListener('submit', handleAppointment);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login (in real app, this would be an API call)
    if (email && password) {
        currentUser = {
            name: 'Juan Pérez',
            email: email,
            type: 'student'
        };
        
        hideModal(document.getElementById('loginModal'));
        showDashboard();
        showNotification('¡Bienvenido de vuelta!', 'success');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('userType').value;
    
    if (name && email && password && userType) {
        currentUser = {
            name: name,
            email: email,
            type: userType
        };
        
        hideModal(document.getElementById('registerModal'));
        showDashboard();
        showNotification('¡Cuenta creada exitosamente!', 'success');
    }
}

// Handle contact form
function handleContact(e) {
    e.preventDefault();
    showNotification('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.', 'success');
    e.target.reset();
}

// Handle appointment booking
function handleAppointment(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const sessionType = document.getElementById('sessionType').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    if (subject && date && time && sessionType) {
        const appointment = {
            id: Date.now(),
            subject,
            date,
            time,
            sessionType,
            notes,
            status: 'pending'
        };
        
        appointments.push(appointment);
        updateAppointmentsList();
        hideModal(document.getElementById('appointmentModal'));
        showNotification('¡Cita agendada exitosamente!', 'success');
        e.target.reset();
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('dashboard').classList.remove('hidden');
    
    // Update user info
    if (currentUser) {
        document.getElementById('studentName').textContent = currentUser.name;
    }
    
    // Initialize dashboard components
    initializeProgressRings();
    loadDashboardData();
}

// Initialize calendar
function initializeCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGrid.innerHTML = '';
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day text-center py-2 cursor-pointer rounded-lg transition-colors ${
            date.getMonth() === currentMonth ? 'text-gray-800' : 'text-gray-400'
        } ${
            date.toDateString() === today.toDateString() ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
        }`;
        
        dayElement.textContent = date.getDate();
        dayElement.addEventListener('click', () => selectDate(date));
        
        calendarGrid.appendChild(dayElement);
    }
}

// Select date function
function selectDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    document.getElementById('appointmentDate').value = dateStr;
    showModal(document.getElementById('appointmentModal'));
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    
    const currentDate = document.getElementById('currentDate');
    const currentTime = document.getElementById('currentTime');
    
    if (currentDate) {
        currentDate.textContent = now.toLocaleDateString('es-MX', dateOptions);
    }
    if (currentTime) {
        currentTime.textContent = now.toLocaleTimeString('es-MX', timeOptions);
    }
}

// Initialize progress rings
function initializeProgressRings() {
    // This would typically be used for circular progress indicators
    // For now, we'll use the existing linear progress bars
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading dashboard statistics
    const stats = {
        completedSessions: Math.floor(Math.random() * 20) + 5,
        upcomingAppointments: Math.floor(Math.random() * 5) + 1,
        averageProgress: Math.floor(Math.random() * 30) + 70
    };
    
    document.getElementById('completedSessions').textContent = stats.completedSessions;
    document.getElementById('upcomingAppointments').textContent = stats.upcomingAppointments;
    document.getElementById('averageProgress').textContent = stats.averageProgress + '%';
}

// Update appointments list
function updateAppointmentsList() {
    // This would update the upcoming appointments display
    const upcomingAppointments = document.getElementById('upcomingAppointments');
    if (upcomingAppointments) {
        upcomingAppointments.textContent = appointments.length;
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.hover-lift').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-semibold transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Export functions for global access
window.EduAsesor = {
    showModal,
    hideModal,
    showNotification,
    showDashboard,
    formatDate,
    formatTime
};