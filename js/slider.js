document.addEventListener("DOMContentLoaded", () => {
    const galleryEl = document.querySelector(".gallery-swiper");
    if (!galleryEl) return;

    new Swiper(galleryEl, {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 'auto', // Слайд бере ширину своєї картинки
        centeredSlides: false,
        navigation: {
            nextEl: '.s9__arrow-next',
            prevEl: '.s9__arrow-prev',
        },
        breakpoints: {
            700: {
                slidesPerView: 'auto', // На десктопі теж авто-ширина
                spaceBetween: 24
            }
        }
    });
});