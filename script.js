const unicodeParagraph = "न्यायालयों में लंबित मुकदमों की संख्या लगातार बढ़ रही है। इस समस्या के समाधान के लिए भारतीय न्याय व्यवस्था में कई महत्वपूर्ण सुधार किए जा रहे हैं। उच्च न्यायालयों द्वारा त्वरित न्याय प्रणाली को अपनाने पर बल दिया जा रहा है ताकि आम नागरिकों को समय पर न्याय मिल सके। डिजिटल तकनीक के प्रयोग से अदालती कार्यवाहियों में पारदर्शिता और गति आई है। ई-कोर्ट परियोजना के माध्यम से मुकदमों की स्थिति, आदेश और निर्णयों को ऑनलाइन देखा जा सकता है। न्यायिक कर्मचारियों और न्यायाधीशों के रिक्त पदों को भरने के लिए त्वरित कदम उठाए जा रहे हैं। लीगल एड क्लीनिक के माध्यम से गरीब और असहाय वर्गों को मुफ्त कानूनी सहायता प्रदान की जा रही है। किसी भी लोकतांत्रिक देश में कानून का शासन बनाए रखने के लिए न्यायपालिका का स्वतंत्र और निष्पक्ष होना अनिवार्य है। न्याय में देरी होना न्याय न मिलने के बराबर माना जाता है। मध्य प्रदेश उच्च न्यायालय द्वारा इस दिशा में निरंतर उत्कृष्ट प्रयास किए जा रहे हैं जिससे लंबित मामलों का निपटारा शीघ्र हो सके। सभी उम्मीदवारों को इस परीक्षा में सफलता प्राप्त करने के लिए अपनी गति और सटीकता पर विशेष ध्यान देना चाहिए। कंप्यूटर पर हिंदी टाइपिंग करते समय सही लेआउट का ज्ञान होना अत्यंत आवश्यक है। नियमित अभ्यास से त्रुटियों को कम किया जा सकता है और अंकों में सुधार लाया जा सकता है। परीक्षा हॉल में धैर्य और एकाग्रता बनाए रखना सफलता की कुंजी है।";

const unicodeToKrutiMap = {
    'अ':'v','आ':'vk','इ':'f','ई':'b','उ':'m','ऊ':'M','ऋ':'_','ए':'s','ऐ':'S','ओ':'vkS','औ':'vks','अं':'vL','अः':'v%','क':'d','ख':'[k','ग':'x','घ':'?k','ङ':'³','च':'p','छ':'N','ज':'t','झ':'÷','ञ':'¥','ट':'V','ठ':'B','ड':'M+','ढ':'<+','ण':'k.k','त':'r','थ':'Fk','द':'n','ध':'èk','न':'u','प':'i','फ':'Q','ब':'c','भ':'Hk','म':'e','य':';','र':'j','ल':'y','व':'o','श':''k','ष':'"k','स':'l','ह':'g','क्ष':'{k','त्र':'=k','ज्ञ':'K','ा':'k','ि':'f','ी':'h','ु':'q','ू':'w','ृ':'`','े':'s','ै':'S','ो':'ks','ौ':'kS','ं':'e','ः':'%','्':'~','।':'1','०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9',' ':' '
};

function convertUnicodeToKrutiString(text) {
    let modification = text;
    modification = modification.replace(/क्र/g, "Ø").replace(/प्र/g, "ç").replace(/ट्र/g, "Vª").replace(/ड्र/g, "Mª");
    modification = modification.replace(/र्(.)/g, "\$1Z"); 
    
    let output = "";
    for (let i = 0; i < modification.length; i++) {
        let char = modification[i];
        output += unicodeToKrutiMap[char] !== undefined ? unicodeToKrutiMap[char] : char;
    }
    return output;
}

let sourceWordsUnicode = unicodeParagraph.trim().split(/\s+/).slice(0, 350);
let sourceWordsKruti = sourceWordsUnicode.map(w => convertUnicodeToKrutiString(w));
let activeSourceArray = sourceWordsUnicode;

let backspaceCount = 0;
let wrongWordsCount = 0;
let currentWordIndex = 0;

const EXAM_DURATION = 600; 
let timeLeft = EXAM_DURATION;
let countdownInterval = null;
let isTestStarted = false;

const textPanel = document.getElementById('text-panel');
const typingArea = document.getElementById('typing-area');
const fontSelect = document.getElementById('font-select');
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
    const currentMode = fontSelect.value;
    
    if (currentMode === 'krutidev') {
        textPanel.className = 'text-panel font-krutidev';
        typingArea.className = 'font-krutidev';
        activeSourceArray = sourceWordsKruti;
    } else {
        textPanel.className = 'text-panel font-unicode';
        typingArea.className = 'font-unicode';
        activeSourceArray = sourceWordsUnicode;
    }

    textPanel.innerHTML = '';
    activeSourceArray.forEach((word, idx) => {
        const span = document.createElement('span');
        span.innerText = word;
        span.className = 'word';
        span.id = `word-${idx}`;
        textPanel.appendChild(span);
    });
    
    if (activeSourceArray.length > 0) {
        document.getElementById('word-0').classList.add('current-word');
    }
    
    backspaceCount = 0;
    wrongWordsCount = 0;
    currentWordIndex = 0;
    
    clearInterval(countdownInterval);
    timeLeft = EXAM_DURATION;
    isTestStarted = false;
    timerDisplay.classList.remove('timer-warning');
    formatTimeDisplay(timeLeft);
    
    typingArea.value = '';
    typingArea.disabled = false;
    typingArea.placeholder = "यहाँ टाइप करना शुरू करें... (पहला अक्षर दबाते ही टाइमर शुरू हो जाएगा)";
    
    updateScoreboard();
    loadHistoryTable();
}

function startTimer() {
    isTestStarted = true;
    countdownInterval = setInterval(() => {
        timeLeft--;
        formatTimeDisplay(timeLeft);
        updateScoreboard();
        
        if (timeLeft <= 60) {
            timerDisplay.classList.add('timer-warning');
        }
        if (timeLeft <= 0) {
            endExam("समय समाप्त! (Time's Up!)");
        }
    }, 1000);
}

function formatTimeDisplay(seconds) {
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

typingArea.addEventListener('input', (e) => {
    if (!isTestStarted && typingArea.value.length > 0) startTimer();

    const rawInput = typingArea.value;
    if (rawInput.endsWith(' ') || rawInput.endsWith('  ')) {
        const typedWord = rawInput.trim();
        if (typedWord.length > 0) {
            evaluateWord(typedWord);
        }
    }
});

function evaluateWord(typedWord) {
    const currentSpan = document.getElementById(`word-${currentWordIndex}`);
    const expectedWord = activeSourceArray[currentWordIndex];
    
    if (typedWord === expectedWord) {
        currentSpan.className = 'word correct-word';
    } else {
        currentSpan.className = 'word wrong-word';
        wrongWordsCount++;
    }
    
    currentWordIndex++;
    typingArea.value = ''; 
    
    if (currentWordIndex >= activeSourceArray.length) {
        endExam("परीक्षा पूर्ण! (Exam Complete!)");
    } else {
        const nextSpan = document.getElementById(`word-${currentWordIndex}`);
        nextSpan.classList.add('current-word');
        nextSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    updateScoreboard();
}

function endExam(statusMessage) {
    clearInterval(countdownInterval);
    typingArea.disabled = true;
    typingArea.value = statusMessage;
    
    // Explicit final data generation pass
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

    backspaceDisplay.innerText = backspaceCount;
    wrongDisplay.innerText = wrongWordsCount;
    wordCountDisplay.innerText = `${currentWordIndex}/${activeSourceArray.length}`;
    scoreDisplay.innerText = finalScore.toFixed(2);
    netWpmDisplay.innerText = netWpm;

    return {
        score: finalScore.toFixed(2),
        wpm: netWpm,
        wrong: wrongWordsCount,
        backspaces: backspaceCount,
        mode: fontSelect.value === 'krutidev' ? 'Kruti Dev 010' : 'Unicode'
    };
}

// LocalStorage Engine Operations
function saveResultToLocalStorage(data) {
    let history = JSON.parse(localStorage.getItem('mphc_history')) || [];
    
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    const record = {
        date: timestamp,
        mode: data.mode,
        score: data.score,
        wpm: data.wpm,
        wrong: data.wrong,
        backspaces: data.backspaces
    };
    
    history.unshift(record); // Prepend new entry to keep latest performance up top
    localStorage.setItem('mphc_history', JSON.stringify(history));
    loadHistoryTable();
}

function loadHistoryTable() {
    let history = JSON.parse(localStorage.getItem('mphc_history')) || [];
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

clearHistoryBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all saved practice logs? This cannot be undone.")) {
        localStorage.removeItem('mphc_history');
        loadHistoryTable();
    }
});