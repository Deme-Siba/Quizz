const signs = ['+', '-', '*'];
const containerMain = document.querySelector('.main');
const containerStart = document.querySelector('.start');
const containerStartH3 = containerStart.querySelector('h3');
const questionField = document.querySelector('.question');
const answerButtons = document.querySelectorAll('.answer');
const startButton = document.querySelector('.start-btn');
const scoreDisplay = document.querySelector('.score');
const timerDisplay = document.querySelector('.timer');

let correctAnswersGiven = 0;
let totalAnswersGiven = 0;
let currentQuestion = null;
let score = 0;
let timeLeft = 40; // 40- wami (dro)
let questionsLeft = 5; // 5 kitxva
let timerInterval = null;

let cookie = getCookie('numbers_high_score');
if (cookie) {
    const [total, correct] = cookie.split('/');
    containerStartH3.innerHTML = `<h3>Last time you gave ${correct} correct answers out of ${total}. Accuracy: ${Math.round((correct / total) * 100)}%.</h3>`;
}

startButton.addEventListener('click', startGame);

answerButtons.forEach((button) => {
    button.addEventListener('click', () => handleAnswerClick(button));
});

function getCookie(name) {
    const match = document.cookie.split('; ').find(cookie => cookie.startsWith(`${name}=`));
    return match ? match.split('=')[1] : null;
}

function shuffle(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSign() {
    return signs[randint(0, signs.length - 1)];
}

class Question {
    constructor() {
        const a = randint(1, 20);
        const b = randint(1, 20);
        const sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        this.correct = evaluateExpression(a, b, sign);
        this.answers = generateAnswers(this.correct);
    }

    display() {
        questionField.textContent = this.question;
        answerButtons.forEach((button, idx) => {
            button.textContent = this.answers[idx];
        });
    }
}

function evaluateExpression(a, b, sign) {
    switch (sign) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
    }
}

function generateAnswers(correct) {
    const answers = [
        randint(correct - 10, correct - 1),
        randint(correct + 1, correct + 10),
        correct,
        randint(correct + 5, correct + 15),
    ];
    return shuffle(answers);
}

function startGame() {
    containerMain.style.display = 'flex';
    containerStart.style.display = 'none';
    resetStats();
    loadNewQuestion();
    startTimer();
}

function resetStats() {
    correctAnswersGiven = 0;
    totalAnswersGiven = 0;
    score = 0;
    questionsLeft = 5;
    timeLeft = 40;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time left: ${timeLeft}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}`;
        if (timeLeft <= 0 || questionsLeft === 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    saveProgress();
    displayEndStats();
}

function saveProgress() {
    document.cookie = `numbers_high_score=${totalAnswersGiven}/${correctAnswersGiven}; max-age=10000000000`;
}

function displayEndStats() {
    containerMain.style.display = 'none';
    containerStart.style.display = 'flex';
    containerStartH3.innerHTML = `<h3>You answered ${correctAnswersGiven} out of ${totalAnswersGiven} questions correctly. Your final score was ${score}.</h3>`;
}

function loadNewQuestion() {
    if (questionsLeft > 0) {
        currentQuestion = new Question();
        currentQuestion.display();
    }
}

function handleAnswerClick(button) {
    const selectedAnswer = parseInt(button.textContent, 10);
    if (selectedAnswer === currentQuestion.correct) {
        correctAnswersGiven++;
        score += 10;
        button.style.backgroundColor = '#00FF00';
    } else {
        button.style.backgroundColor = '#FF0000';
    }

    button.addEventListener('transitionend', () => {
        button.style.backgroundColor = '';
    });

    totalAnswersGiven++;
    questionsLeft--;

    if (questionsLeft > 0) {
        loadNewQuestion();
    } else {
        endGame();
    }

    scoreDisplay.textContent = `Score: ${score}`;
}
