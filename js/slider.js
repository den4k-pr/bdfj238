document.addEventListener("DOMContentLoaded", () => {
    const galleryEl = document.querySelector(".gallery-swiper");
    if (!galleryEl) return;

    new Swiper(galleryEl, {
        loop: true,
        spaceBetween: 20,
        slidesPerView: 1.2,
        centeredSlides: false,
        // Кнопки навігації видалено згідно з ТЗ
    });
});