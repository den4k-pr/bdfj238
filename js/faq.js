document.querySelectorAll('.s7__question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;

        // Закриваємо інші відкриті питання (опціонально, як акордеон)
        document.querySelectorAll('.s7__item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.s7__answer').style.maxHeight = null;
            }
        });

        // Перемикаємо поточне
        item.classList.toggle('active');

        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});