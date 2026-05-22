document.addEventListener('DOMContentLoaded', () => {

    const AUTOPLAY_THRESHOLD = 0.5;

    // ==============================================================
    // УТИЛІТА: заморозити src відео до потрібного моменту
    // ==============================================================
    const freezeVideo = (video) => {
        // Переносимо src → data-src якщо ще не перенесено
        if (video.src && !video.dataset.src) {
            video.dataset.src = video.src;
            video.removeAttribute('src');
            // Забираємо source-діти якщо є
            video.querySelectorAll('source').forEach(s => {
                if (!s.dataset.src) s.dataset.src = s.src;
                s.removeAttribute('src');
            });
            video.load(); // скидаємо буфер
        }
    };

    const loadVideo = (video) => {
        if (video.src) return; // вже завантажено
        if (video.dataset.src) {
            video.src = video.dataset.src;
        }
        video.querySelectorAll('source[data-src]').forEach(s => {
            s.src = s.dataset.src;
        });
        video.preload = 'metadata';
        video.load();
    };

    // ==============================================================
    // GALLERY GRID — автоплей відео як GIF при скролі
    // ==============================================================
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                loadVideo(video);
                const tryPlay = () => video.play().catch(() => {});
                video.readyState >= 2
                    ? tryPlay()
                    : video.addEventListener('canplay', tryPlay, { once: true });
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, { threshold: 0.3, rootMargin: '100px 0px' });

    document.querySelectorAll('.gallery-img video').forEach(video => {
        video.muted = true;
        video.loop = true;
        video.controls = false;
        video.removeAttribute('controls');
        video.setAttribute('playsinline', '');
        freezeVideo(video);
        galleryObserver.observe(video);
    });

    // ==============================================================
    // 1. LAZY LOADING — для .s7 та .s11
    // rootMargin '400px' = починаємо вантажити коли до відео ще ~400px
    // ==============================================================
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            loadVideo(entry.target);
            lazyObserver.unobserve(entry.target);
        });
    }, { threshold: 0, rootMargin: '400px 0px' });

    // ==============================================================
    // 2. АВТОПЛЕЙ — для .s7 та .s11
    // ==============================================================
    const autoplayObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (video.closest('.swiper-slide')) return;
            if (entry.isIntersecting) {
                const tryPlay = () => video.play().catch(() => {});
                video.readyState >= 2
                    ? tryPlay()
                    : video.addEventListener('canplay', tryPlay, { once: true });
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, { threshold: AUTOPLAY_THRESHOLD });

    document.querySelectorAll('.s7 video, .s11 video').forEach(video => {
        freezeVideo(video);
        lazyObserver.observe(video);
        autoplayObserver.observe(video);
    });

    // ==============================================================
    // 3. СЛАЙДЕР — lazy load тільки активного + сусідніх слайдів
    // ==============================================================

    // Lazy для слайдерних відео — вантажимо тільки коли сам слайдер видно
    const sliderLazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const slider = entry.target;
            // Завантажуємо відео лише в активному та сусідніх слайдах
            loadVisibleSlideVideos(slider);
            sliderLazyObserver.unobserve(slider);
        });
    }, { threshold: 0, rootMargin: '300px 0px' });

    const loadVisibleSlideVideos = (swiperEl) => {
        const swiper = swiperEl.swiper;
        const activeIndex = swiper ? swiper.activeIndex : 0;
        const slides = swiperEl.querySelectorAll('.swiper-slide');
        slides.forEach((slide, i) => {
            // Завантажуємо активний + 1 сусідній з кожного боку
            if (Math.abs(i - activeIndex) <= 1) {
                const video = slide.querySelector('video');
                if (video) loadVideo(video);
            }
        });
    };

    document.querySelectorAll('.swiper-slide video').forEach(video => {
        video.controls = false;
        video.removeAttribute('controls');
        freezeVideo(video);
    });

    document.querySelectorAll('.swiper').forEach(swiperEl => {
        sliderLazyObserver.observe(swiperEl);
    });

    // ==============================================================
    // 4. КАСТОМНИЙ ПЛЕЄР ДЛЯ СЛАЙДЕРА
    // ==============================================================
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        const video = slide.querySelector('video');
        if (!video) return;

        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.innerHTML = `
            <div class="video-play-btn" aria-label="Play">
                <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="38" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
                    <polygon class="icon-play" points="32,24 58,40 32,56" fill="white"/>
                    <g class="icon-pause" style="display:none">
                        <rect x="26" y="24" width="10" height="32" rx="2" fill="white"/>
                        <rect x="44" y="24" width="10" height="32" rx="2" fill="white"/>
                    </g>
                </svg>
            </div>
        `;

        slide.style.position = 'relative';
        slide.appendChild(overlay);

        const btn = overlay.querySelector('.video-play-btn');
        const iconPlay = overlay.querySelector('.icon-play');
        const iconPause = overlay.querySelector('.icon-pause');

        let isHandling = false;

        const setIcon = (playing) => {
            iconPlay.style.display = playing ? 'none' : '';
            iconPause.style.display = playing ? '' : 'none';
        };

        const stopAllOthers = () => {
            document.querySelectorAll('.swiper-slide video').forEach(v => {
                if (v !== video && !v.paused) {
                    v.pause();
                    const otherOverlay = v.closest('.swiper-slide')?.querySelector('.video-overlay');
                    if (otherOverlay) {
                        otherOverlay.querySelector('.icon-play').style.display = '';
                        otherOverlay.querySelector('.icon-pause').style.display = 'none';
                    }
                }
            });
        };

        const togglePlay = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (isHandling) return;
            isHandling = true;
            setTimeout(() => { isHandling = false; }, 300);

            // Завантажуємо відео тільки при першому кліку якщо ще не завантажено
            loadVideo(video);

            video.muted = false;

            if (video.paused) {
                stopAllOthers();
                const tryPlay = () => {
                    video.play()
                        .then(() => setIcon(true))
                        .catch(err => {
                            console.error('Помилка:', err);
                            isHandling = false;
                        });
                };
                video.readyState >= 2 ? tryPlay() : video.addEventListener('canplay', tryPlay, { once: true });
            } else {
                video.pause();
                setIcon(false);
            }
        };

        overlay.addEventListener('click', togglePlay, true);
        overlay.addEventListener('touchstart', () => {
            if (overlay.classList.contains('is-playing')) {
                overlay.classList.add('touched');
                setTimeout(() => overlay.classList.remove('touched'), 800);
            }
        }, { passive: true });

        video.addEventListener('play', () => {
            setIcon(true);
            overlay.classList.add('is-playing');
        });
        video.addEventListener('pause', () => {
            setIcon(false);
            overlay.classList.remove('is-playing');
        });
        video.addEventListener('ended', () => {
            setIcon(false);
            overlay.classList.remove('is-playing');
        });
    });

    // CSS для overlay
    const style = document.createElement('style');
    style.textContent = `
        .video-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            -webkit-tap-highlight-color: transparent;
            transition: opacity 0.2s ease;
        }
        .video-overlay.is-playing {
            opacity: 0;
        }
        .video-overlay.is-playing:active,
        .video-overlay.is-playing.touched {
            opacity: 1;
        }
        .video-play-btn {
            width: 20%;
            transition: transform 0.15s ease, opacity 0.15s ease;
            pointer-events: none;
        }
        .video-overlay:active .video-play-btn {
            transform: scale(0.9);
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);

    // ==============================================================
    // 5. ЗУПИНКА ПРИ СВАЙПІ + lazy load сусідніх слайдів
    // ==============================================================
    const initSwiperListeners = () => {
        document.querySelectorAll('.swiper').forEach(sliderElement => {
            if (sliderElement.swiper && !sliderElement._videoHandlerAttached) {
                sliderElement._videoHandlerAttached = true;

                sliderElement.swiper.on('slideChangeTransitionStart', () => {
                    // Зупиняємо всі відео
                    document.querySelectorAll('.swiper-slide video').forEach(v => {
                        if (!v.paused) v.pause();
                        const ov = v.closest('.swiper-slide')?.querySelector('.video-overlay');
                        if (ov) {
                            ov.querySelector('.icon-play').style.display = '';
                            ov.querySelector('.icon-pause').style.display = 'none';
                        }
                    });
                });

                sliderElement.swiper.on('slideChangeTransitionEnd', () => {
                    // Завантажуємо відео в активному та сусідніх слайдах після свайпу
                    loadVisibleSlideVideos(sliderElement);
                });
            }
        });
    };

    initSwiperListeners();
    setTimeout(initSwiperListeners, 500);
    setTimeout(initSwiperListeners, 1500);
});