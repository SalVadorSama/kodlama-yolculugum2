const lessons = [
    { 
        id: 1, 
        title: "Değişkenler", 
        teach: "Yazılımda verileri saklamak için kutular kullanırız. Bunlara <b>değişken</b> denir. Örneğin: <code>x = 5</code> yazdığında 'x' kutusuna 5 sayısını koymuş olursun.",
        type: "selection",
        q: "Hangisi bir değişken tanımlama şeklidir?",
        options: ["x = 10", "10 == x", "x + 10"],
        correct: 0
    },
    { 
        id: 2, 
        title: "Metinler (Strings)", 
        teach: "Yazılımcılar metinlere 'String' der. Metin yazarken tırnak işareti kullanılır. Örnek: <code>isim = 'Ali'</code>",
        type: "writing",
        q: "Ekrana 'Merhaba' yazmak için boşluğu doldur: print(____)",
        correct: "'Merhaba'"
    }
];

let state = JSON.parse(localStorage.getItem('devLingoData')) || {
    xp: 0, lvl: 1, streak: 0, freeze: 1, lastDate: null, currentLessonIdx: 0
};

function init() {
    renderHome();
    updateUI();
}

function updateUI() {
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('lvl-val').innerText = state.lvl;
    document.getElementById('streak-val').innerText = state.streak;
    document.getElementById('freeze-val').innerText = state.freeze;
}

function renderHome() {
    const list = document.getElementById('lesson-list');
    list.innerHTML = "<h3>Dersler</h3>";
    lessons.forEach((l, index) => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerHTML = `${index + 1}. ${l.title}`;
        btn.onclick = () => startLesson(index);
        list.appendChild(btn);
    });
}

function startLesson(idx) {
    state.currentLessonIdx = idx;
    const lesson = lessons[idx];
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('teaching-screen').classList.remove('hidden');
    document.getElementById('teach-title').innerText = lesson.title;
    document.getElementById('teach-content').innerHTML = lesson.teach;
}

function goToQuiz() {
    document.getElementById('teaching-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    const lesson = lessons[state.currentLessonIdx];
    document.getElementById('question-text').innerText = lesson.q;
    
    const area = document.getElementById('quiz-input-area');
    area.innerHTML = "";

    if (lesson.type === "selection") {
        lesson.options.forEach((opt, i) => {
            const b = document.createElement('button');
            b.className = "option-btn";
            b.innerText = opt;
            b.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(x => x.classList.remove('selected'));
                b.classList.add('selected');
                b.dataset.idx = i;
            };
            area.appendChild(b);
        });
    } else {
        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Cevabını buraya yaz...";
        input.id = "user-answer";
        area.appendChild(input);
    }
}

function checkAnswer() {
    const lesson = lessons[state.currentLessonIdx];
    let isCorrect = false;

    if (lesson.type === "selection") {
        const selected = document.querySelector('.option-btn.selected');
        if (selected && parseInt(selected.dataset.idx) === lesson.correct) isCorrect = true;
    } else {
        const ans = document.getElementById('user-answer').value.trim();
        if (ans === lesson.correct) isCorrect = true;
    }

    if (isCorrect) {
        state.xp += 10;
        updateStreak();
        alert("Harika! Doğru cevap.");
        resetApp();
    } else {
        alert("Hatalı cevap, tekrar dene!");
    }
}

function updateStreak() {
    const today = new Date().toDateString();
    if (state.lastDate !== today) {
        state.streak++;
        state.lastDate = today;
    }
    save();
}

function resetApp() {
    save();
    location.reload();
}

function save() {
    localStorage.setItem('devLingoData', JSON.stringify(state));
}

init();
