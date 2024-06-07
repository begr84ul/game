const API_URL = 'https://opentdb.com/api.php?amount=20&category=9';

const landingSection = document.getElementById('landing');
const questionSection = document.getElementById('question');
const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const pointsElement = document.getElementById('points');
const progressBarInner = document.getElementById('progress-bar-inner');
const correctCounter = document.getElementById('correct-counter');
const correctAnswersSpan = document.getElementById('correct-answers');
const totalQuestionsSpan = document.getElementById('total-questions');
const errorSection = document.getElementById('error');
const loadingOverlay = document.getElementById('loading-overlay');
let points = 0;
let correctAnswersCount = 0;
let totalQuestions = 21;
let consecutiveCorrectAnswers = 0;

document.getElementById('start-game').addEventListener('click', startGame);

async function startGame() {
    landingSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    questionSection.classList.remove('hidden');
    await getTriviaQuestion();
}

async function getTriviaQuestion() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.response_code !== 0) {
            throw new Error('Failed to fetch question. Please try again later.');
        }
        const question = data.results[0];
        totalQuestions--;
        updateTotalQuestions();
        displayQuestion(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        showError('Failed to fetch question. Please try again later.');
    } finally {
        hideLoading();
    }
}

function displayQuestion(question) {
    questionElement.textContent = question.question;
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);
    answerButtonsElement.innerHTML = '';
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn', 'btn-primary', 'mx-2', 'my-1');
        button.addEventListener('click', () => checkAnswer(answer, question.correct_answer));
        answerButtonsElement.appendChild(button);
    });
}

function checkAnswer(selectedAnswer, correctAnswer) {
    const correct = selectedAnswer === correctAnswer;
    if (correct) {
        points += 10;
        pointsElement.textContent = `Points: ${points}`;
        correctAnswersCount++;
        consecutiveCorrectAnswers++;
        updateCorrectCounter();
        showAnswerMessage("Correct");
    } else {
        consecutiveCorrectAnswers = 0;
        showAnswerMessage("Wrong", correctAnswer);
    }
    updateProgressBar();
    if (correctAnswersCount >= 20) {
        congratulate();
    } else {
        nextQuestion();
    }
}

async function nextQuestion() {
    await sleep(3000);
    await getTriviaQuestion();
}

function updateProgressBar() {
    const progressPercentage = ((21 - totalQuestions) / 20) * 100;
    progressBarInner.style.width = `${progressPercentage}%`;
}

function updateCorrectCounter() {
    const level = Math.ceil(correctAnswersCount / 5);
    correctCounter.innerHTML = `<span class="level">Level ${level}:</span>`;
    const levelBar = document.createElement('div');
    levelBar.classList.add('level-bar');
    levelBar.style.width = `${(consecutiveCorrectAnswers % 5) * 20}%`;
    correctCounter.appendChild(levelBar);
}

function updateTotalQuestions() {
    totalQuestionsSpan.textContent = `/ Questions Left: ${totalQuestions}`;
}

function showAnswerMessage(message, correctAnswer) {
    const messageElement = document.createElement('div');
    if (message === "Wrong") {
        messageElement.textContent = `${message}. The correct answer was: ${correctAnswer}`;
    } else {
        messageElement.textContent = message;
    }
    messageElement.classList.add('answer-message', message.toLowerCase());
    document.getElementById('question').appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

function showError(errorMessage) {
    errorSection.classList.remove('hidden');
    document.getElementById('error-message').textContent = errorMessage;
}

function congratulate() {
    console.log("Congratulations! You've reached Level 2!");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
