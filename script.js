let lastParentChoice = null; // CPUの前回の役
let lastChildChoice = null;  // プレイヤーの前回の役
let isParentTurn = true;     // 現在のターンが親のターンかどうか
let turnCounter = 1;         // 現在のターン数
let isSoundOn = true;        // 音声のオン/オフフラグ
let isFirstTurn = true;      // 初回ターンの判定
let is123RuleEnabled = true; // 123ルールのオン/オフ
let consecutiveRoles = [];   // 連続して出された役を記録

const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún', 'Fre'];
const roleImages = {
    CPU: { 'Ye': 'images/cpu-ye.png', 'Ch’e': 'images/cpu-che.png', 'Nge': 'images/cpu-nge.png', 'Kiún': 'images/cpu-kiun.png', 'Fre': 'images/cpu-kiun.png' },
    Player: { 'Ye': 'images/player-ye.png', 'Ch’e': 'images/player-che.png', 'Nge': 'images/player-nge.png', 'Kiún': 'images/player-kiun.png', 'Fre': 'images/player-kiun.png' }
};
const soundFiles = {
    Ye: 'audio/ye-sound.mp3',
    'Ch’e': 'audio/che-sound.mp3',
    Nge: 'audio/nge-sound.mp3',
    Kiún: 'audio/kiun-sound.mp3',
    Fre: 'audio/kiun-sound.mp3' // Fre用の音声
};

function getRandomChoice(exclude) {
    let availableRoles = is123RuleEnabled && canUseFre(lastParentChoice, consecutiveRoles)
        ? roles.filter(role => role !== exclude)
        : roles.filter(role => role !== exclude && role !== 'Fre');
    if (isFirstTurn) {
        availableRoles = availableRoles.filter(role => role !== 'Kiún');
    }
    return availableRoles[Math.floor(Math.random() * availableRoles.length)];
}

function canUseFre(lastChoice, history) {
    const patterns = [
        ['Ye', 'Ch’e'],
        ['Ch’e', 'Nge']
    ];
    return patterns.some(pattern => 
        history.slice(-2).join() === pattern.join() && lastChoice !== 'Fre'
    );
}

function playSound(role) {
    if (isSoundOn) {
        let audio = new Audio(soundFiles[role]);
        audio.play();
    }
}

function toggle123Rule() {
    is123RuleEnabled = !is123RuleEnabled;
    document.getElementById('rule-toggle').innerText = is123RuleEnabled ? '123ルールオフ' : '123ルールオン';
}

function updateRoleImages() {
    document.getElementById('cpu-role-img').src = roleImages.CPU[lastParentChoice] || '';
    document.getElementById('player-role-img').src = roleImages.Player[lastChildChoice] || '';
}

function updateNextOptions() {
    let cpuOptions = is123RuleEnabled && canUseFre(lastParentChoice, consecutiveRoles)
        ? roles.filter(role => role !== lastParentChoice).join(', ')
        : roles.filter(role => role !== lastParentChoice && role !== 'Fre').join(', ');

    let playerOptions = is123RuleEnabled && canUseFre(lastChildChoice, consecutiveRoles)
        ? roles.filter(role => role !== lastChildChoice).join(', ')
        : roles.filter(role => role !== lastChildChoice && role !== 'Fre').join(', ');

    document.getElementById('cpu-options').innerText = cpuOptions;
    document.getElementById('player-options').innerText = playerOptions;
}

function updateTurnInfo() {
    document.getElementById('turn-counter').innerText = turnCounter;
    document.getElementById('current-parent').innerText = isParentTurn ? 'CPU (親)' : 'プレイヤー (親)';
    document.getElementById('current-child').innerText = isParentTurn ? 'プレイヤー (子)' : 'CPU (子)';
}

function endGame(message) {
    document.getElementById('center-info').innerHTML += `<p>${message}</p>`;
    document.getElementById('choices').innerHTML = '<button onclick="location.reload()">もう一度遊ぶ</button>';
}

function playTurn(childChoice) {
    if (!roles.includes(childChoice)) {
        alert('無効な選択です。');
        return;
    }

    if (turnCounter === 1 && childChoice === 'Kiún') {
        alert('初手でKiúnは出せません！');
        return;
    }

    if (childChoice === lastChildChoice) {
        alert('同じ役を続けて出すことはできません！');
        return;
    }

    if (childChoice === 'Fre' && !canUseFre(lastChildChoice, consecutiveRoles)) {
        alert('Freはこのターンで選べません！');
        return;
    }

    let parentChoice = getRandomChoice(lastParentChoice);

    if (parentChoice === 'Fre' && !canUseFre(lastParentChoice, consecutiveRoles)) {
        parentChoice = getRandomChoice(lastParentChoice);
    }

    lastParentChoice = parentChoice;
    lastChildChoice = childChoice;
    consecutiveRoles.push(childChoice);

    let resultMessage = '';
    if (parentChoice === childChoice) {
        if (parentChoice === 'Fre' || parentChoice === 'Kiún') {
            resultMessage = '親が勝利しました！';
        } else {
            resultMessage = '親と子が同じ役を出したため子の負け！';
        }
    } else if (childChoice === 'Kiún' && parentChoice !== 'Kiún') {
        resultMessage = 'Kiúnが一致しなかったため親の負け！';
    } else if (childChoice === 'Fre' && parentChoice !== 'Fre') {
        resultMessage = 'Freとの勝負で引き分け！ゲーム続行。';
    }

    if (resultMessage) {
        updateRoleImages();
        playSound(childChoice);
        endGame(resultMessage);
        return;
    }

    turnCounter++;
    isParentTurn = !isParentTurn;
    isFirstTurn = false;

    updateRoleImages();
    playSound(childChoice);
    updateNextOptions();
    updateTurnInfo();
}


function toggleSound() {
    isSoundOn = !isSoundOn;
    document.getElementById('sound-toggle').innerText = isSoundOn ? '音声オフ' : '音声オン';
}
