$(document).ready(function () {
  // ініціалізація з кастомними стрілками
  $('.receipts-slider').slick({
    dots: true,
    arrows: true,               // показати стрілки
    prevArrow: '<button type="button" class="slick-prev" aria-label="Prev"></button>',
    nextArrow: '<button type="button" class="slick-next" aria-label="Next"></button>',
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
  });

  // Додатково — переконаємося, що після завантаження зображень Slick правильно оновлює розміри
  // (іноді потрібне принуджене оновлення після load)
  $('.receipts-slider img').on('load', function () {
    $('.receipts-slider').slick('setPosition');
  });
});
