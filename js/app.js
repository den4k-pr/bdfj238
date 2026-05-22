document.addEventListener("DOMContentLoaded", () => {

  function start24hTimer(containerSelector, itemSelector, storageKey) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Отримуємо тільки блоки з цифрами (ігноруючи розділові двокрапки)
    const values = container.querySelectorAll(itemSelector);
    if (values.length < 3) return;

    const TOTAL_TIME = 24 * 60 * 60 * 1000;

    let startTime = localStorage.getItem(storageKey);

    // Якщо немає старту — задаємо
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(storageKey, startTime);
    } else {
      startTime = parseInt(startTime, 10);
    }

    function updateTimer() {
      const now = Date.now();
      let elapsed = now - startTime;

      // Ресет після 24 годин або якщо щось пішло не так
      if (elapsed >= TOTAL_TIME || elapsed < 0) {
        startTime = now;
        localStorage.setItem(storageKey, startTime);
        elapsed = 0;
      }

      const remaining = TOTAL_TIME - elapsed;

      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      values[0].textContent = String(hours).padStart(2, "0");
      values[1].textContent = String(minutes).padStart(2, "0");
      values[2].textContent = String(seconds).padStart(2, "0");
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ОНОВЛЕНИЙ ТАЙМЕР ФУТЕРА: тепер шукає класи .timer-box всередині .footer-timer
  start24hTimer(".footer-timer", ".timer-box", "timerStartTime");
  
  // Інші таймери (залишаються без змін, якщо вони використовуються на сторінці)
  start24hTimer(".what-content-time", ".what-content-time-item-title", "whatContentTimerStartTime");
  start24hTimer(".timer-display", ".timer-box", "displayTimerStartTime");

});