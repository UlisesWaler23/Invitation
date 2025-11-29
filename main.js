// Función para abrir la invitación
function openInvitation() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');

    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';

        // Iniciar contador
        startCountdown();
    }, 1000);
}

// Contador regresivo
function startCountdown() {
    const weddingDate = new Date('December 15, 2024 16:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">Días</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">Horas</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${minutes}</span>
                        <span class="countdown-label">Minutos</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${seconds}</span>
                        <span class="countdown-label">Segundos</span>
                    </div>
                `;

        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">¡Hoy es el día!</span></div>';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Navegación suave
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Simular apertura de maps
function openMaps(location) {
    alert(`Aquí se abriría Google Maps para la ubicación: ${location}`);
    // En una implementación real, usarías:
    // window.open(`https://maps.google.com/?q=${encodeURIComponent(direccion)}`, '_blank');
}

// Manejar el formulario RSVP
document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('¡Gracias por confirmar tu asistencia! Te esperamos en nuestro día especial.');
    this.reset();
});

// Efectos de scroll para animaciones
window.addEventListener('scroll', function () {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Inicializar estilos para animaciones
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});
function openInvitation() {
    const loader = document.getElementById("loadingScreen");
    const wrapper = document.querySelector(".envelope-wrapper");

    // Activa la animación del sobre y las líneas
    wrapper.classList.add("open-envelope");
    loader.classList.add("open-envelope");

    // Espera a que termine la animación y muestra el contenido
    setTimeout(() => {
        loader.classList.add("fade-out-loading");

        // Mostrar el contenido principal
        setTimeout(() => {
            loader.style.display = "none";
            document.getElementById("mainContent").style.display = "block";
            
            // Iniciar contador
            startCountdown();
            // Iniciar carrusel
            initCarousel(); // ¡IMPORTANTE! Agregar esta línea
        }, 800);

    }, 1800);
}

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let autoSlideInterval;
let isAnimating = false;

// Inicializar carrusel cuando se carga la página
function initCarousel() {
    createDots();
    updateCarousel();
    startAutoSlide();
}

// Crear indicadores de puntos
function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// Ir a slide específico
function goToSlide(slideIndex) {
    if (isAnimating || slideIndex === currentSlide) return;
    
    isAnimating = true;
    
    // Remover clases de animación anteriores
    slides.forEach(slide => {
        slide.classList.remove('prev', 'next');
    });
    
    // Determinar dirección
    const direction = slideIndex > currentSlide ? 'next' : 'prev';
    slides[slideIndex].classList.add(direction);
    
    // Ocultar slide actual
    slides[currentSlide].classList.remove('active');
    
    // Mostrar nuevo slide después de un pequeño delay
    setTimeout(() => {
        slides[slideIndex].classList.add('active');
        slides[slideIndex].classList.remove('prev', 'next');
        currentSlide = slideIndex;
        updateCarousel();
        isAnimating = false;
    }, 400);
}

// Slide anterior
function prevSlide() {
    if (isAnimating) return;
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
    resetAutoSlide();
}

// Slide siguiente
function nextSlide() {
    if (isAnimating) return;
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
    resetAutoSlide();
}

// Actualizar carrusel
function updateCarousel() {
    const dots = document.querySelectorAll('.carousel-dot');
    const counter = document.getElementById('carouselCounter');
    
    // Actualizar dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Actualizar contador
    counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// Auto slide cada 5 segundos
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

// Reset auto slide cuando el usuario interactúa
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Soporte para gestos táctiles
function setupTouchEvents() {
    const container = document.querySelector('.carousel-container');
    let startX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        isDragging = false;
        resetAutoSlide();
    });
}

// Inicializar eventos táctiles cuando se carga
document.addEventListener('DOMContentLoaded', function() {
    setupTouchEvents();
});
