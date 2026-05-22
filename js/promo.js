document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.promo-card-wrapper');
    if (!footer) {
        console.log('НЕ знайдено .promo-card-wrapper');
        return;
    }

    const scrollThreshold = 400;

    function checkScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        const distanceToBottom = docHeight - (scrollY + windowHeight);

        // 👉 якщо ширина > 800px
        if (window.innerWidth > 800) {

            // якщо залишилось ≤ 300px до низу → ховаємо
            if (distanceToBottom <= 200) {
                footer.classList.remove('is-visible');
                return;
            }
        }

        // стандартна логіка
        if (scrollY > scrollThreshold) {
            footer.classList.add('is-visible');
        } else {
            footer.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    checkScroll();

    // =========================
    // TIMER
    // =========================

    const STORAGE_KEY = 'promo-card-timer-group';
    const timerEls = footer.querySelectorAll('.promo-card-digit');

    function getEndTime() {
        let end = localStorage.getItem(STORAGE_KEY);

        if (!end) {
            end = Date.now() + 30 * 60 * 1000; // 30 хв
            localStorage.setItem(STORAGE_KEY, end);
        }

        return parseInt(end, 10);
    }

    let endTime = getEndTime();

    function updateTimer() {
        let diff = endTime - Date.now();

        // 👉 якщо таймер закінчився — перезапускаємо
        if (diff <= 0) {
            endTime = Date.now() + 30 * 60 * 1000;
            localStorage.setItem(STORAGE_KEY, endTime);
            diff = endTime - Date.now();
        }

        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

        if (timerEls.length >= 3) {
            timerEls[0].textContent = h;
            timerEls[1].textContent = m;
            timerEls[2].textContent = s;
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
});