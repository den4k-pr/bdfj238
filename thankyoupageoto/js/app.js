document.addEventListener("DOMContentLoaded", () => {
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Ключ для localStorage
  const STORAGE_KEY = "countdown_end_time";

  // Перевіряємо, чи вже є кінець таймера у сховищі
  let endTime = localStorage.getItem(STORAGE_KEY);

  if (!endTime) {
    // Якщо вперше запускаємо — додаємо 24 години від поточного моменту
    endTime = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, endTime);
  } else {
    // Перетворюємо у число
    endTime = parseInt(endTime, 10);
  }

  function updateTimer() {
    const now = Date.now();
    const distance = endTime - now;

    if (distance <= 0) {
      // Якщо час вийшов — обнуляємо і можна заново почати
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      localStorage.removeItem(STORAGE_KEY); // очищаємо
      clearInterval(interval);
      return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  // Оновлюємо щосекунди
  updateTimer();
  const interval = setInterval(updateTimer, 1000);
});



const timeContainer = document.getElementById("timeContainer");
const scrollThreshold = 200; // Поріг прокрутки

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > scrollThreshold) {
        // Якщо прокрутили більше 200px:
        // Додаємо клас, який плавно "виштовхує" блок на екран
        timeContainer.classList.add("fixed-bottom");
    } else {
        // Якщо прокрутили менше 200px:
        // Видаляємо клас, який плавно "ховає" блок за нижній край
        timeContainer.classList.remove("fixed-bottom");
    }
});