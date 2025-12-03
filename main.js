function openInvitation() {
    const loader = document.getElementById("loadingScreen");
    const wrapper = document.querySelector(".envelope-wrapper");
    const envelopeImg = document.querySelector(".envelope-img");
    const clickHint = document.querySelector(".click-hint");
    const sparkles = document.querySelector(".envelope-sparkles");
    const touchText = document.querySelector(".touch-text");

    wrapper.classList.add("opening");

    if (envelopeImg) envelopeImg.classList.add("disappear-instantly");
    if (clickHint) clickHint.classList.add("disappear-instantly");
    if (sparkles) sparkles.classList.add("disappear-instantly");
    if (touchText) touchText.classList.add("disappear-instantly");

    setTimeout(() => {
        wrapper.classList.add("open-envelope");
        loader.classList.add("open-envelope");

        setTimeout(() => {
            loader.classList.add("fade-out-loading");

            setTimeout(() => {
                loader.style.display = "none";
                document.getElementById("mainContent").style.display = "block";

                startCountdown();
                if (typeof initCarousel === 'function') {
                    initCarousel();
                }
            }, 800);

        }, 1500); 

    }, 300); 
}


function startCountdown() {
    const currentYear = new Date().getFullYear();
    const weddingDate = new Date(`${currentYear}-12-27T16:00:00`).getTime();

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

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

function openMaps(location) {
    let url = "";

    if (location === "catedral") {
        url = "https://www.google.com/maps/place/Parroquia+De+Cristo+Redentor/data=!4m2!3m1!1s0x0:0x524a479eecd7a7c6?hl=es-US";
    } 
    else if (location === "hacienda") {
        url = "https://www.google.com/maps/place/Salon+quinta+castilla/data=!4m2!3m1!1s0x0:0x1f83b98681499cbe?hl=es-US";
    }

    // Abrir en Google Maps
    window.open(url, "_blank");
}

document.getElementById('rsvpForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const loadingDiv = document.getElementById('rsvpLoading');
    loadingDiv.style.display = 'block'; 

    const form = e.target;
    const name = form.querySelector('input[name="name"]').value;
    const attending = form.querySelector('select[name="attending"]').value;
    const people = form.querySelector('select[name="people"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    const ip = await fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(data => data.ip);

    const payload = { name, attending, people, message, ip };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbx_xIMOyp9XRRgi90AZ-j5m4vi7Tz_HYHiOekCbF8WuaMXzNipPs3uhCODUrRYsnu70cQ/exec", {
            method: "POST",
            body: JSON.stringify(payload)
        }).then(res => res.json());

        if (response.status === "duplicate") {
            alert("Ya has confirmado tu asistencia antes ❤️");
            return;
        }

        if (response.status === "success") {
            alert("¡Gracias por confirmar tu asistencia! 🥰");
            form.reset();
        }
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al enviar tu RSVP. Intenta nuevamente.");
    } finally {
        loadingDiv.style.display = 'none'; 
    }
});




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

document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
let autoSlideInterval;
let isAnimating = false;

function initCarousel() {
    createDots();
    updateCarousel();
    startAutoSlide();
}

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

function goToSlide(slideIndex) {
    if (isAnimating || slideIndex === currentSlide) return;

    isAnimating = true;

    slides.forEach(slide => {
        slide.classList.remove('prev', 'next');
    });

    const direction = slideIndex > currentSlide ? 'next' : 'prev';
    slides[slideIndex].classList.add(direction);

    slides[currentSlide].classList.remove('active');

    setTimeout(() => {
        slides[slideIndex].classList.add('active');
        slides[slideIndex].classList.remove('prev', 'next');
        currentSlide = slideIndex;
        updateCarousel();
        isAnimating = false;
    }, 400);
}

function prevSlide() {
    if (isAnimating) return;
    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
    resetAutoSlide();
}

function nextSlide() {
    if (isAnimating) return;
    const nextIndex = (currentSlide + 1) % totalSlides;
    goToSlide(nextIndex);
    resetAutoSlide();
}

function updateCarousel() {
    const dots = document.querySelectorAll('.carousel-dot');
    const counter = document.getElementById('carouselCounter');

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

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

document.addEventListener('DOMContentLoaded', function () {
    setupTouchEvents();
});
function updateCountdown() {
    const weddingDate = new Date("2024-12-27T13:15:00"); 
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").innerHTML = `
        <div class="count-box">
            <span class="count-number">${days}</span>
            <span class="count-label">Días</span>
        </div>
        <div class="count-box">
            <span class="count-number">${hours}</span>
            <span class="count-label">Hrs</span>
        </div>
        <div class="count-box">
            <span class="count-number">${mins}</span>
            <span class="count-label">Mins</span>
        </div>
        <div class="count-box">
            <span class="count-number">${secs}</span>
            <span class="count-label">Segs</span>
        </div>
    `;
}

setInterval(updateCountdown, 1000);
updateCountdown();
function addToCalendar() {
    const title = "Boda de Paulino y Valentina";
    const description = "¡Acompáñanos a celebrar este día tan especial!";
    const location = "Parroquia Cristo RedentorAv. Aguascalientes Pte. 101B, Residencial del Valle I, 20070 Aguascalientes, Ags.";
    
    const start = new Date("2025-12-27T13:15:00");
    const end = new Date("2025-12-27T18:00:00");

    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startUTC = formatDate(start);
    const endUTC = formatDate(end);

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startUTC}
DTEND:${endUTC}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const icsURL = URL.createObjectURL(blob);

    const googleURL =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(title)}` +
        `&dates=${startUTC}/${endUTC}` +
        `&details=${encodeURIComponent(description)}` +
        `&location=${encodeURIComponent(location)}`;

    if (/iphone|ipad|macintosh/i.test(navigator.userAgent)) {
        window.location.href = icsURL;
    } else {
        window.open(googleURL, "_blank");
    }
}


