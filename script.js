const allQuestions = [
    { q: 'What is 2 + 2?', options: ['3', '4', '5'], correctIndex: 1, type: 'math' },
    { q: 'What is 7 × 6?', options: ['42', '36', '48'], correctIndex: 0, type: 'math' },
    { q: 'Which planet is known as the Red Planet?', options: ['Mars', 'Venus', 'Jupiter'], correctIndex: 0, type: 'science' },
    { q: 'What gas do plants breathe in?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen'], correctIndex: 1, type: 'science' },
    { q: 'Which language runs in the browser?', options: ['Python', 'C#', 'JavaScript'], correctIndex: 2, type: 'programming' },
    { q: 'Which company created the JavaScript language?', options: ['Microsoft', 'Netscape', 'Sun'], correctIndex: 1, type: 'programming' },
    { q: 'Capital of France?', options: ['Paris', 'Lyon', 'Marseille'], correctIndex: 0, type: 'geography' },
    { q: 'Who wrote the Declaration of Independence?', options: ['George Washington', 'Thomas Jefferson', 'Benjamin Franklin'], correctIndex: 1, type: 'history' },
    { q: 'Which element has chemical symbol O?', options: ['Gold', 'Oxygen', 'Osmium'], correctIndex: 1, type: 'science' }
];

let questions = [];
let current = 0;
let score = 0;
let currentCorrectKey = null;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function pickQuestions() {
    // pick a random number of questions between 3 and min(6, pool)
    const pool = [...allQuestions];
    shuffle(pool);
    const count = Math.min(pool.length, 3 + Math.floor(Math.random() * 4));
    // try to ensure at least some type variety by taking the first `count` shuffled
    questions = pool.slice(0, count);
}

function loadQuestion() {
    const item = questions[current];
    questionEl.textContent = `${current + 1}. ${item.q}`;
    optionsEl.innerHTML = '';

    // shuffle options for this question
    const opts = item.options.map((text, idx) => ({ text, idx }));
    shuffle(opts);

    // map shuffled options to keys a/b/c
    const keys = ['a', 'b', 'c'];
    currentCorrectKey = null;
    opts.forEach((optObj, i) => {
        const key = keys[i];
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.dataset.option = key;
        btn.textContent = `${key.toUpperCase()}: ${optObj.text}`;
        btn.addEventListener('click', () => checkAnswer(key, btn));
        optionsEl.appendChild(btn);

        if (optObj.idx === item.correctIndex) {
            currentCorrectKey = key;
        }
    });

    resultEl.textContent = '';
    nextBtn.disabled = true;
}

function checkAnswer(answer, btn) {
    if (!currentCorrectKey) return;
    if (answer === currentCorrectKey) {
        score++;
        resultEl.textContent = 'Correct! 😎';
        btn.classList.add('correct');
    } else {
        resultEl.textContent = `Wrong — correct is ${currentCorrectKey.toUpperCase()}.`;
        btn.classList.add('wrong');
        const correctBtn = optionsEl.querySelector(`[data-option="${currentCorrectKey}"]`);
        if (correctBtn) correctBtn.classList.add('correct');
    }
    optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);
    nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
    current++;
    if (current >= questions.length) {
        resultEl.textContent = `Quiz finished — Score: ${score}/${questions.length}`;
        questionEl.textContent = 'All done!';
        optionsEl.innerHTML = '';
        nextBtn.disabled = true;
        return;
    }
    loadQuestion();
});

document.addEventListener('DOMContentLoaded', () => {
    pickQuestions();
    shuffle(questions);
    current = 0;
    score = 0;
    loadQuestion();
});