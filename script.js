// MPHC Real Exam Pattern - 350 Words Pure Legal Matter
const unicodeParagraph = "अपीलार्थी की ओर से प्रस्तुत आपराधिक अपील अधीनस्थ न्यायालय द्वारा पारित दोषसिद्धि और दंडादेश के विरुद्ध इस न्यायालय के समक्ष प्रस्तुत की गई है। विद्वान विचारण न्यायाधीश ने अभियुक्त को भारतीय दंड संहिता की धारा के अंतर्गत दोषी पाते हुए कठोर कारावास और अर्थदंड से दंडित किया था। अभियोजन कथानक के अनुसार घटना की दिनांक को फरियादी ने आरक्षी केंद्र में इस आशय की प्रथम सूचना रिपोर्ट दर्ज कराई थी कि आरोपी ने भूमि विवाद को लेकर उसके साथ गाली-गलौज की और जान से मारने की धमकी देते हुए लाठी से प्रहार किया। इस प्रहार के कारण आहत को गंभीर चोटें आईं और उसे उपचार के लिए जिला चिकित्सालय ले जाया गया। अन्वेषण अधिकारी ने घटनास्थल का नक्शा मौका तैयार किया और साक्षियों के कथन दंड प्रक्रिया संहिता की धारा के अंतर्गत लेखबद्ध किए। विचारण के दौरान अभियोजन पक्ष ने अपने मामले के समर्थन में मौखिक और दस्तावेजी साक्ष्य प्रस्तुत किए। अभियुक्त ने अपने परीक्षण में स्वयं को निर्दोष बताया और कहा कि उसे रंजिश के कारण झूठा फंसाया गया है। अधीनस्थ न्यायालय ने साक्ष्यों का मूल्यांकन करने के पश्चात आरोपी को दोषी ठहराया था। अपीलार्थी के विद्वान अधिवक्ता ने तर्क दिया कि अधीनस्थ न्यायालय का निर्णय विधि के सिद्धांतों के विपरीत है। चश्मदीद साक्षियों के कथनों में गंभीर विरोधाभास है और स्वतंत्र साक्षियों ने अभियोजन कहानी का समर्थन नहीं किया है। इसके अतिरिक्त चिकित्सा अधिकारी की रिपोर्ट से भी चोटों की प्रकृति गंभीर सिद्ध नहीं होती है। इसलिए अभियुक्त को संदेह का लाभ दिया जाना न्यायोचित होगा। इसके विपरीत शासकीय अधिवक्ता ने तर्क दिया कि अभियोजन ने अपना मामला संदेह से परे प्रमाणित किया है और निर्णय में किसी हस्तक्षेप की आवश्यकता नहीं है। दोनों पक्षों के तर्कों पर विचार करने और अभिलेख का परिशीलन करने के पश्चात यह न्यायालय इस निष्कर्ष पर पहुंचता है कि न्याय के हित में दंडादेश को संशोधित किया जाना आवश्यक है। अतः अपील आंशिक रूप से स्वीकार की जाती है और अभियुक्त की सजा को कम करते हुए अर्थदंड में वृद्धि की जाती है। आदेश की प्रति अधीनस्थ न्यायालय को भेजी जाए।";

let sourceWords = unicodeParagraph.trim().split(/\s+/).slice(0, 350);

let backspaceCount = 0;
let wrongWordsCount = 0;
let currentWordIndex = 0;

const EXAM_DURATION = 600; // 10 Minutes
let timeLeft = EXAM_DURATION;
let countdownInterval = null;
let isTestStarted = false;

const textPanel = document.getElementById('text-panel');
const typingArea = document.getElementById('typing-area');
const timerDisplay = document.getElementById('timer-display');
const netWpmDisplay = document.getElementById('net-wpm-display');
const backspaceDisplay = document.getElementById('backspace-count');
const wrongDisplay = document.getElementById('wrong-count');
const scoreDisplay = document.getElementById('score-display');
const wordCountDisplay = document.getElementById('word-count');
const resetBtn = document.getElementById('reset-btn');
const historyTableBody = document.getElementById('history-table-body');
const clearHistoryBtn = document.getElementById('clear-history-btn');

function initExam() {
    textPanel.innerHTML = '';
    sourceWords.forEach((word, idx) => {
        const span = document.createElement('span');
        span.innerText = word;
        span.className = 'word';
        span.id = `word-${idx}`;
        textPanel.appendChild(span);
    });
    
    if (sourceWords.length > 0) {
        document.getElementById('word-0').classList.add('current-word');
    }
    
    backspaceCount = 0;
    wrongWordsCount = 0;
    currentWordIndex = 0;
    
    clearInterval(countdownInterval);
    timeLeft = EXAM_DURATION;
    isTestStarted = false;
    if (timerDisplay) timerDisplay.classList.remove('timer-warning');
    formatTimeDisplay(timeLeft);
    
    typingArea.value = '';
    typingArea.disabled = false;
    typingArea.placeholder = "अपने सिस्टम पर Remington Gail कीबोर्ड चालू करें और यहाँ टाइप करना शुरू करें...";
    
    updateScoreboard();
    loadHistoryTable();
}

function startTimer() {
    isTestStarted = true;
    countdownInterval = setInterval(() => {
        timeLeft--;
        formatTimeDisplay(timeLeft);
        updateScoreboard();
        
        if (timeLeft <= 60 && timerDisplay) {
            timerDisplay.classList.add('timer-warning');
        }
        if (timeLeft <= 0) {
            endExam("समय समाप्त! (Time's Up!)");
        }
    }, 1000);
}

function formatTimeDisplay(seconds) {
    if (!timerDisplay) return;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

typingArea.addEventListener('keydown', (e) => {
    if (typingArea.disabled) return;
    if (!isTestStarted) startTimer();

    if (e.key === 'Backspace') {
        backspaceCount++;
        updateScoreboard();
    }
});

// फिक्स किया गया इनपुट लॉजिक: जब तक स्पेस नहीं दबेगा, अगला शब्द लाल नहीं होगा
typingArea.addEventListener('input', (e) => {
    if (!isTestStarted && typingArea.value.length > 0) startTimer();

    const rawInput = typingArea.value;
    const typedWordsArray = rawInput.split(/\s+/);
    const hasTrailingSpace = rawInput.endsWith(' ') || rawInput.endsWith('\n');
    
    let completedWordsCount = typedWordsArray.length;
    if (!hasTrailingSpace && completedWordsCount > 0) {
        completedWordsCount--; // जो शब्द अभी टाइप हो रहा है उसे छोड़ दें
    }
    
    wrongWordsCount = 0;
    
    // सभी स्पैन का स्टाइल पहले सामान्य (क्लीन) करें
    const allWordSpans = textPanel.querySelectorAll('.word');
    allWordSpans.forEach(span => {
        span.className = 'word';
    });
    
    // केवल उन्हीं शब्दों को लाल या हरा करें जो पूरी तरह टाइप हो चुके हैं (जिनके बाद स्पेस दब चुका है)
    for (let i = 0; i < completedWordsCount; i++) {
        if (i >= sourceWords.length) break;
        
        const currentSpan = document.getElementById(`word-${i}`);
        const expectedWord = sourceWords[i];
        const currentTyped = typedWordsArray[i];
        
        const cleanTyped = currentTyped.replace(/[\u200B-\u200D\uFEFF]/g, "");
        const cleanExpected = expectedWord.replace(/[\u200B-\u200D\uFEFF]/g, "");
        
        if (cleanTyped === cleanExpected) {
            if (currentSpan) currentSpan.className = 'word correct-word';
        } else {
            if (currentSpan) currentSpan.className = 'word wrong-word';
            wrongWordsCount++;
        }
    }
    
    // वर्तमान में जो शब्द टाइप किया जा रहा है उसे पीला (Highlight) रखें, वह लाल या कटा हुआ नहीं दिखेगा
    currentWordIndex = completedWordsCount;
    
    const nextSpan = document.getElementById(`word-${currentWordIndex}`);
    if (nextSpan) {
        nextSpan.classList.add('current-word');
        nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    if (currentWordIndex >= sourceWords.length && hasTrailingSpace) {
        endExam("परीक्षा पूर्ण! (Exam Complete!)");
    }
    
    updateScoreboard();
});

function endExam(statusMessage) {
    clearInterval(countdownInterval);
    typingArea.disabled = true;
    updateScoreboard();
    
    const metrics = updateScoreboard();
    saveResultToLocalStorage(metrics);
}

function updateScoreboard() {
    const baseScore = 50.00;
    const backspaceDeduction = backspaceCount * 0.10;
    const wrongWordDeduction = wrongWordsCount * 0.50;
    
    let finalScore = baseScore - (backspaceDeduction + wrongWordDeduction);
    if (finalScore < 0) finalScore = 0; 

    let timeElapsedSeconds = EXAM_DURATION - timeLeft;
    let netWpm = 0;
    
    if (timeElapsedSeconds > 0) {
        let timeElapsedMinutes = timeElapsedSeconds / 60;
        let netWords = currentWordIndex - wrongWordsCount;
        if (netWords < 0) netWords = 0;
        netWpm = Math.round(netWords / timeElapsedMinutes);
    }

    if (backspaceDisplay) backspaceDisplay.innerText = backspaceCount;
    if (wrongDisplay) wrongDisplay.innerText = wrongWordsCount;
    if (wordCountDisplay) wordCountDisplay.innerText = `${currentWordIndex}/${sourceWords.length}`;
    if (scoreDisplay) scoreDisplay.innerText = finalScore.toFixed(2);
    if (netWpmDisplay) netWpmDisplay.innerText = netWpm;

    return {
        score: finalScore.toFixed(2),
        wpm: netWpm,
        wrong: wrongWordsCount,
        backspaces: backspaceCount,
        mode: 'Remington Gail (Mangal)'
    };
}

function saveResultToLocalStorage(data) {
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('mphc_history')) || [];
    } catch(e) {
        history = [];
    }
    
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    const record = {
        date: timestamp,
        mode: data.mode,
        score: data.score,
        wpm: data.wpm,
        wrong: data.wrong,
        backspaces: data.backspaces
    };
    
    history.unshift(record);
    localStorage.setItem('mphc_history', JSON.stringify(history));
    loadHistoryTable();
}

function loadHistoryTable() {
    if (!historyTableBody) return;
    let history = [];
    try {
        history = JSON.parse(localStorage.getItem('mphc_history')) || [];
    } catch(e) {
        history = [];
    }
    
    historyTableBody.innerHTML = '';
    
    if (history.length === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="6" class="no-data">No practice history recorded yet. Complete a session to see stats!</td></tr>`;
        return;
    }
    
    history.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.mode}</td>
            <td style="font-weight: bold; color: #2e7d32;">${item.score} / 50</td>
            <td style="font-weight: bold; color: #0288d1;">${item.wpm} WPM</td>
            <td>${item.wrong}</td>
            <td>${item.backspaces}</td>
        `;
        historyTableBody.appendChild(row);
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete all saved practice logs? This cannot be undone.")) {
