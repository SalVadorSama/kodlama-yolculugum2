// --- VERİ MODELİ VE MÜFREDAT ---
const lessons = [
    { id: 1, title: "Değişkenler", q: "Hangisi bir tam sayı (integer) tanımlar?", a: ["int x = 5", "string x = '5'", "bool x = true"], correct: 0 },
    { id: 2, title: "Döngüler", q: "Hangi döngü belirli bir sayıda döner?", a: ["while", "for", "if"], correct: 1 },
    { id: 3, title: "Koşullar", q: "Eğer durumu kontrol etmek için ne kullanılır?", a: ["else", "switch", "if"], correct: 2 },
    // Buraya 7. güne kadar ders ekleyebilirsin...
];

const weeklyExam = {
    q: "Haftalık Tekrar: Değişken ve Döngülerin farkı nedir?",
    a: ["Biri veri tutar, biri tekrar eder", "İkisi de aynıdır", "Biri sadece sayı tutar"],
    correct: 0
};

// --- DURUM YÖNETİMİ ---
let state = JSON.parse(localStorage.getItem('devLingoData')) || {
    xp: 0, lvl: 1, streak: 0, freeze: 1, 
    lastDate: null, completedToday: false, dayIndex: 0
};

// --- ANA FONKSİYONLAR ---
function init() {
    checkDailyReset();
    updateUI();
    askNotificationPermission();
}

function updateUI() {
    document.getElementById('xp-val').innerText = state.xp;
    document.getElementById('lvl-val').innerText = state.lvl;
    document.getElementById('streak-val').innerText = state.streak;
    document.getElementById('freeze-val').innerText = state.freeze;
    document.getElementById('progress-fill').style.width = (state.xp % 100) + "%";
    
    const currentLesson = lessons[state.dayIndex % lessons.length];
    document.getElementById('day-title').innerText = `${state.dayIndex + 1}. Gün`;
    document.getElementById('task-topic').innerText = currentLesson.title;

    if (state.completedToday) {
        document.getElementById('start-btn').innerText = "Yarın Görüşürüz!";
        document.getElementById('start-btn').disabled = true;
        document.getElementById('start-btn').style.background = "#ccc";
    }

    // Haftalık Sınav Kontrolü (Her 7 günde bir)
    if (state.dayIndex > 0 && (state.dayIndex + 1) % 7 === 0 && !state.completedToday) {
        document.getElementById('exam-area').classList.remove('hidden');
    }
}

function checkDailyReset() {
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (state.lastDate && state.lastDate !== today) {
        if (state.lastDate !== yesterdayStr) {
            // Seri bozuldu mu?
            if (state.freeze > 0) {
                state.freeze--;
                showToast("Seri dondurma kullanıldı! 🔥 Korundu.");
            } else {
                state.streak = 0;
                showToast("Serin maalesef sıfırlandı. 😢");
            }
        }
        state.completedToday = false;
        save();
    }
}

function startTask() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('action-screen').classList.remove('hidden');
    
    const current = lessons[state.dayIndex % lessons.length];
    renderQuestion(current);
}

function renderQuestion(data) {
    document.getElementById('question-text').innerText = data.q;
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    
    data.a.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, data.correct);
        container.appendChild(btn);
    });
}

function checkAnswer(chosen, correct) {
    if (chosen === correct) {
        state.xp += 20;
        state.streak++;
        state.completedToday = true;
        state.lastDate = new Date().toDateString();
        state.dayIndex++;
        
        // Seviye atlama
        state.lvl = Math.floor(state.xp / 100) + 1;
        
        // Ödül: Her 10 seride bir dondurma hakkı
        if (state.streak % 10 === 0) state.freeze++;

        showToast("Tebrikler! +20 XP kazandın.");
        save();
        location.reload(); // Ana ekrana dön
    } else {
        showToast("Yanlış cevap, tekrar dene!");
    }
}

function save() {
    localStorage.setItem('devLingoData', JSON.stringify(state));
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

// Bildirim İzni
function askNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

// Her dakika 00:00 kontrolü yap
setInterval(checkDailyReset, 60000);

init();
