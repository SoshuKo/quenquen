let playerChoice = null;
let cpuChoice = null;
let turns = 1;
let soundOn = true;

const playerHand = document.getElementById('player-hand');
const cpuHand = document.getElementById('cpu-hand');
const turnsDisplay = document.getElementById('turns');
const messageDisplay = document.getElementById('message');
const confirmBtn = document.getElementById('confirmBtn');
const soundToggleBtn = document.getElementById('soundToggle');
const yeBtn = document.getElementById('yeBtn');
const cheBtn = document.getElementById('cheBtn');
const ngeBtn = document.getElementById('ngeBtn');
const kiunBtn = document.getElementById('kiunBtn');
const currentParentDisplay = document.getElementById('currentParent');

const roleImages = {
    ye: { player: 'images/player-ye.png', cpu: 'images/cpu-ye.png' },
    che: { player: 'images/player-che.png', cpu: 'images/cpu-che.png' },
    nge: { player: 'images/player-nge.png', cpu: 'images/cpu-nge.png' },
    kiun: { player: 'images/player-kiun.png', cpu: 'images/cpu-kiun.png' }
};

const sounds = {
    ye: new Audio('audio/ye-sound.mp3'),
    che: new Audio('audio/che-sound.mp3'),
    nge: new Audio('audio/nge-sound.mp3'),
    kiun: new Audio('audio/kiun-sound.mp3')
};

// 役の選択を処理
yeBtn.addEventListener('click', () => selectRole('ye'));
cheBtn.addEventListener('click', () => selectRole('che'));
ngeBtn.addEventListener('click', () => selectRole('nge'));
kiunBtn.addEventListener('click', () => selectRole('kiun'));

// 確定ボタンの処理
confirmBtn.addEventListener('click', () => {
    if (playerChoice === null) {
        messageDisplay.textContent = '役を選んでください。';
        return;
    }
    cpuChoice = getCpuChoice();
    updateDisplay();
    checkResult();
    turns++;
    turnsDisplay.textContent = turns;
    playerChoice = null;
    playerHand.innerHTML = '';
    cpuHand.innerHTML = '';
    // 役選択をリセット
    resetRoleButtons();
});

// 音声オンオフボタン
soundToggleBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggleBtn.textContent = soundOn ? '音声オフ' : '音声オン';
});

// 役を選んだとき
function selectRole(role) {
    if (playerChoice !== null) return; // 同じターンに複数回選択できない
    playerChoice = role;
    playerHand.innerHTML = `<img src="${roleImages[role].player}" alt="${role}">`;
    if (soundOn) sounds[role].play();
}

// CPUの役をランダムに選択
function getCpuChoice() {
    const choices = ['ye', 'che', 'nge', 'kiun'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// 表示を更新
function updateDisplay() {
    cpuHand.innerHTML = `<img src="${roleImages[cpuChoice].cpu}" alt="${cpuChoice}">`;
    // 親、子の役を画像と音声で表示
    if (soundOn) {
        sounds[playerChoice].play();
        setTimeout(() => {
            sounds[cpuChoice].play();
        }, 1000); // CPUの役は少し遅れて再生
    }
    messageDisplay.textContent = `親: ${playerChoice}, 子: ${cpuChoice}`;
}

// 勝敗を判定
function checkResult() {
    if (playerChoice === cpuChoice) {
        messageDisplay.textContent += ' 勝負は引き分けです。';
    } else if ((playerChoice === 'kiun' && cpuChoice !== 'kiun') || 
               (playerChoice === 'ye' && cpuChoice === 'che') || 
               (playerChoice === 'che' && cpuChoice === 'nge') || 
               (playerChoice === 'nge' && cpuChoice === 'ye')) {
        messageDisplay.textContent += ' プレイヤーの勝ち！';
    } else {
        messageDisplay.textContent += ' CPUの勝ち！';
    }
    currentParentDisplay.textContent = turns % 2 === 1 ? 'プレイヤー' : 'CPU';
}

// 役選択ボタンをリセット
function resetRoleButtons() {
    yeBtn.disabled = false;
    cheBtn.disabled = false;
    ngeBtn.disabled = false;
    kiunBtn.disabled = false;
}
