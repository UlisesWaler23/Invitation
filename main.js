let youtubePlayer;
let isAudioPlaying = false;
let currentVolume = 25;
const customCounter = document.getElementById('customCounter');


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

    initializeAudio();

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
                document.getElementById('audioControls').style.display = 'flex';
            }, 800);

        }, 1500);

    }, 300);
}

function initializeAudio() {
    if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
        youtubePlayer.playVideo();
        youtubePlayer.setVolume(currentVolume);
        isAudioPlaying = true;
        updateAudioButton();
    } else {
        createYouTubePlayer();
    }
}

function createYouTubePlayer() {
    if (document.getElementById('youtubeAudio')) {
        youtubePlayer = document.getElementById('youtubeAudio').contentWindow.YT;
        return;
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'youtubeAudio';
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';

    iframe.src = 'https://www.youtube.com/embed/j8CeOPlJ_Ic?enablejsapi=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&playsinline=1&rel=0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowfullscreen = false;

    document.body.appendChild(iframe);

    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = function () {
            youtubePlayer = new YT.Player('youtubeAudio', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };
    } else {
        setTimeout(() => {
            if (!youtubePlayer && YT.Player) {
                youtubePlayer = new YT.Player('youtubeAudio', {
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        }, 100);
    }
}

function onPlayerReady(event) {
    youtubePlayer = event.target;
    youtubePlayer.setVolume(currentVolume);
    youtubePlayer.playVideo();
    isAudioPlaying = true;
    updateAudioButton();
    updateVolumeDisplay();

    console.log('YouTube Player Ready - Volume:', currentVolume);
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isAudioPlaying = true;
    } else if (event.data === YT.PlayerState.PAUSED) {
        isAudioPlaying = false;
    }
    updateAudioButton();
}

function toggleAudio() {
    console.log('toggleAudio called - youtubePlayer:', youtubePlayer, 'isPlaying:', isAudioPlaying);

    if (!youtubePlayer) {
        console.log('No youtubePlayer, initializing...');
        initializeAudio();
        return;
    }

    if (isAudioPlaying) {
        youtubePlayer.pauseVideo();
        isAudioPlaying = false;
    } else {
        youtubePlayer.playVideo();
        isAudioPlaying = true;
    }
    updateAudioButton();
}

function setVolume(value) {
    currentVolume = parseInt(value);
    console.log('Setting volume to:', currentVolume);

    if (youtubePlayer && typeof youtubePlayer.setVolume === 'function') {
        youtubePlayer.setVolume(currentVolume);
        console.log('Volume set successfully');
    } else {
        console.log('youtubePlayer not ready or setVolume not available');
    }

    const volumePercent = document.querySelector('.volume-percent');
    if (volumePercent) {
        volumePercent.textContent = currentVolume + '%';
    }

    localStorage.setItem('weddingAudioVolume', currentVolume);
}

function updateAudioButton() {
    const audioToggle = document.getElementById('audioToggle');
    if (!audioToggle) return;

    const svg = audioToggle.querySelector('svg');
    if (svg) {
        if (isAudioPlaying) {
            svg.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>';
        } else {
            svg.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path>';
        }
    }
}

function updateVolumeDisplay() {
    const volumePercent = document.querySelector('.volume-percent');
    const volumeSlider = document.querySelector('.volume-slider');

    if (volumePercent) {
        volumePercent.textContent = currentVolume + '%';
    }
    if (volumeSlider) {
        volumeSlider.value = currentVolume;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const savedVolume = localStorage.getItem('weddingAudioVolume');
    if (savedVolume) {
        currentVolume = parseInt(savedVolume);
    }
});


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
    if (customCounter) {
        customCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    }
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




