document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  
    // Form submission handling with registration check
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        // Check if client is registered
        const isRegistered = clients.some(client => client.regEmail === email);
        
        if (!isRegistered) {
          alert('Por favor regístrese primero antes de agendar una cita.');
          document.getElementById('registerModal').classList.add('show');
          // Pre-fill email in registration form
          document.getElementById('regEmail').value = email;
          return;
        }
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
  
        // Here you would typically send the form data to a server
        alert('¡Cita agendada exitosamente! Te contactaremos pronto.');
        contactForm.reset();
      });
    }
  
    // Animation for service cards on scroll
    const observerOptions = {
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.service-card, .specialty-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      observer.observe(card);
    });
  
    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('header');
  
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
  
      if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
      }
  
      if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
      } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
      }
      lastScroll = currentScroll;
    });
  
    // Enhanced Registration Modal Functionality
    const modal = document.getElementById('registerModal');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtn = document.querySelector('.close');
    const registerForm = document.getElementById('registerForm');
  
    registerBtn.addEventListener('click', () => {
      modal.classList.add('show');
    });
  
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(registerForm);
      const clientData = {};
      formData.forEach((value, key) => {
        clientData[key] = value;
      });
  
      // Check if email already exists
      const clients = JSON.parse(localStorage.getItem('clients') || '[]');
      const emailExists = clients.some(client => client.regEmail === clientData.regEmail);
  
      if (emailExists) {
        alert('Este correo electrónico ya está registrado.');
        return;
      }
  
      // Store in localStorage
      clients.push(clientData);
      localStorage.setItem('clients', JSON.stringify(clients));
  
      // Show success message
      alert('¡Registro exitoso! Ahora puedes agendar tu cita.');
      
      // Reset form and close modal
      registerForm.reset();
      modal.classList.remove('show');
    });
  
    // Service Modal Functionality
    const serviceData = {
      consulta: {
        title: 'Consultas Veterinarias',
        description: 'Atención médica general y preventiva para tu mascota',
        prices: [
          { service: 'Consulta General', price: '$15.000' },
          { service: 'Control de Rutina', price: '$12.000' },
          { service: 'Vacunación', price: '$25.000' },
          { service: 'Desparasitación', price: '$10.000' }
        ]
      },
      cirugia: {
        title: 'Cirugías',
        description: 'Procedimientos quirúrgicos con equipo especializado',
        prices: [
          { service: 'Esterilización Gato', price: '$45.000' },
          { service: 'Esterilización Perro', price: '$65.000' },
          { service: 'Limpieza Dental', price: '$35.000' },
          { service: 'Cirugía General', price: 'Desde $80.000' }
        ]
      },
      examenes: {
        title: 'Exámenes',
        description: 'Laboratorio clínico y diagnóstico por imagen',
        prices: [
          { service: 'Hemograma', price: '$20.000' },
          { service: 'Perfil Bioquímico', price: '$25.000' },
          { service: 'Radiografía', price: '$35.000' },
          { service: 'Ecografía', price: '$40.000' }
        ]
      },
      peluqueria: {
        title: 'Peluquería',
        description: 'Servicios de grooming y estética para mascotas',
        prices: [
          { service: 'Baño y Secado', price: '$15.000' },
          { service: 'Corte de Pelo', price: '$20.000' },
          { service: 'Corte de Uñas', price: '$5.000' },
          { service: 'Limpieza de Oídos', price: '$8.000' }
        ]
      },
      _const: modalTemplate = `
      <div id="serviceModal" class="service-modal">
        <div class="service-modal-content">
          <span class="close">&times;</span>
          <h3 id="modalTitle"></h3>
          <p id="modalDescription"></p>
          <div class="service-details">
            <h4>Precios Referenciales:</h4>
            <ul class="price-list" id="priceList"></ul>
          </div>
        </div>
      </div>
    `,
get const() {
      return this._const;
    },
    /**
     * Set the modal template string. This is a private variable and should not be modified directly.
     * @private
     * @type {string}
     */
set const(value) {
      this._const = value;
    },
    };
    document.body.insertAdjacentHTML('beforeend', modalTemplate);
  
    const serviceModal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const priceList = document.getElementById('priceList');
  
    // Add click handlers to service cards
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', function() {
        const serviceType = this.getAttribute('data-service');
        const data = serviceData[serviceType];
        
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        priceList.innerHTML = data.prices.map(item => `
          <li>
            <span>${item.service}</span>
            <span>${item.price}</span>
          </li>
        `).join('');
        
        serviceModal.classList.add('show');
      });
    });
  
    // Close modal functionality
    document.querySelectorAll('.service-modal .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        serviceModal.classList.remove('show');
      });
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        serviceModal.classList.remove('show');
      }
    });
  
    // Mobile menu toggle
    const createMobileMenuButton = () => {
      const nav = document.querySelector('nav');
      const mobileMenuBtn = document.createElement('button');
      mobileMenuBtn.className = 'mobile-menu-btn';
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      
      mobileMenuBtn.addEventListener('click', () => {
        const ul = nav.querySelector('ul');
        ul.classList.toggle('show');
      });
  
      nav.insertBefore(mobileMenuBtn, nav.firstChild);
    };
  
    if (window.innerWidth <= 768) {
      createMobileMenuButton();
    }
  
    window.addEventListener('resize', () => {
      const existingBtn = document.querySelector('.mobile-menu-btn');
      if (window.innerWidth <= 768 && !existingBtn) {
        createMobileMenuButton();
      } else if (window.innerWidth > 768 && existingBtn) {
        existingBtn.remove();
        document.querySelector('nav ul').classList.remove('show');
      }
    });
  });