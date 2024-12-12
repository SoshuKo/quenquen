let lastParentChoice = null; // CPUの前回の役
let lastChildChoice = null;  // プレイヤーの前回の役
let isParentTurn = true;     // 現在のターンが親のターンかどうか
let turnCounter = 1;         // 現在のターン数
let isSoundOn = localStorage.getItem('isSoundOn') === 'true'; // ローカルストレージから音声設定を読み込む
let isFirstTurn = true;      // 初回ターンの判定
let isRulesVisible = false;  // ルール表示のオン/オフフラグ
let is123RuleEnabled = false; // 123ルールが有効かどうか
let parentSequence = [];     // 親の選択順序
let childSequence = [];      // 子の選択順序

const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún', 'Fre'];
const roleImages = {
    CPU: {
        'Ye': 'images/cpu-ye.png', 'Ch’e': 'images/cpu-che.png',
        'Nge': 'images/cpu-nge.png', 'Kiún': 'images/cpu-kiun.png', 'Fre': 'images/cpu-fre.png'
    },
    Player: {
        'Ye': 'images/player-ye.png', 'Ch’e': 'images/player-che.png',
        'Nge': 'images/player-nge.png', 'Kiún': 'images/player-kiun.png', 'Fre': 'images/player-fre.png'
    }
};
const soundFiles = {
    Ye: 'audio/ye-sound.mp3',
    'Ch’e': 'audio/che-sound.mp3',
    Nge: 'audio/nge-sound.mp3',
    Kiún: 'audio/kiun-sound.mp3',
    Fre: 'audio/fre-sound.mp3'
};

// ルール表示の切り替え
function toggleRules() {
    isRulesVisible = !isRulesVisible;
    document.getElementById('rules-container').style.display = isRulesVisible ? 'block' : 'none';
}

// 123ルールの切り替え
function toggle123Rule() {
    is123RuleEnabled = !is123RuleEnabled;
    document.getElementById('toggle-123-rule').innerText = is123RuleEnabled ? '123ルール オン' : '123ルール オフ';
    parentSequence = [];
    childSequence = [];
}

// 初回ターンの時、CPUはKiúnまたはFreを選ばない
function getRandomChoice(exclude) {
    let choices = roles.filter(role => role !== exclude);
    if (isFirstTurn) {
        choices = choices.filter(role => role !== 'Kiún' && role !== 'Fre');
    }
    return choices[Math.floor(Math.random() * choices.length)];
}

function playSound(role) {
    if (isSoundOn) {
        let audio = new Audio(soundFiles[role]);
        audio.play();
    }
}

function updateRoleImages() {
    document.getElementById('cpu-role-img').src = roleImages.CPU[lastParentChoice] || '';
    document.getElementById('player-role-img').src = roleImages.Player[lastChildChoice] || '';
}

function updateNextOptions() {
    let cpuOptions = roles.filter(role => role !== lastParentChoice).join(', ');
    let playerOptions = roles.filter(role => role !== lastChildChoice).join(', ');

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

function canChooseFre(sequence) {
    return is123RuleEnabled && sequence.length >= 2 &&
        ((sequence[sequence.length - 2] === 'Ye' && sequence[sequence.length - 1] === 'Ch’e') ||
         (sequence[sequence.length - 2] === 'Ch’e' && sequence[sequence.length - 1] === 'Nge'));
}

function playTurn(childChoice) {
    if (!roles.includes(childChoice)) {
        alert('無効な選択です。');
        return;
    }

    // 初手でKiúnまたはFreを出せない制約
    if (turnCounter === 1 && (childChoice === 'Kiún' || childChoice === 'Fre')) {
        alert('初手でKiúnやFreは出せません！');
        return;
    }

    // 連続して同じ役を出せない制約
    if (childChoice === lastChildChoice) {
        alert('同じ役を続けて出すことはできません！');
        return;
    }

    // Freを選べるタイミングか確認
    if (childChoice === 'Fre' && !canChooseFre(childSequence)) {
        alert('123ルールに従ってFreを出すことはできません！');
        return;
    }

    // CPUの選択
    let parentChoice = getRandomChoice(lastParentChoice);

    // CPUがFreを選ぶ条件
    if (canChooseFre(parentSequence)) {
        parentChoice = Math.random() < 0.5 ? 'Fre' : getRandomChoice(lastParentChoice);
    }

    // 現在の役を保存
    lastParentChoice = parentChoice;
    lastChildChoice = childChoice;

    // 選択履歴を更新
    if (isParentTurn) {
        parentSequence.push(parentChoice);
    } else {
        childSequence.push(childChoice);
    }

    // 勝敗判定
    let resultMessage = '';
    if (childChoice === 'Fre' && parentChoice === 'Kiún') {
        resultMessage = 'FreとKiúnの勝負で親が勝利しました！';
    } else if (childChoice === 'Kiún' && parentChoice === 'Fre') {
        resultMessage = 'FreとKiúnの勝負で親が勝利しました！';
    } else if (childChoice === 'Fre' && parentChoice === 'Fre') {
        resultMessage = 'Fre同士の勝負で親が勝利しました！';
    } else if (childChoice === 'Fre' || parentChoice === 'Fre') {
        resultMessage = 'Freと他の役の勝負で引き分けました。';
    } else if (parentChoice === childChoice && childChoice === 'Kiún') {
        resultMessage = 'Kiúnが一致したためゲームは続行されます。';
        turnCounter++;
        updateRoleImages();
        playSound(childChoice); // 役の音声を再生
        updateNextOptions();
        updateTurnInfo();
        return;
    } else if (parentChoice === childChoice) {
        resultMessage = '親と子が同じ役を出したため子の負け！';
    }

    // 勝敗が決した場合
    if (resultMessage) {
        updateRoleImages();
        playSound(childChoice); // 役の音声を再生
        endGame(resultMessage);
        return;
    }

    // 勝負が決まらない場合、ターン交代
    turnCounter++;
    isParentTurn = !isParentTurn; // 親と子を交代
    isFirstTurn = false; // 初回ターンが終わったのでフラグを更新

    // UIの更新
    updateRoleImages();
    playSound(childChoice); // 役の音声を再生
    updateNextOptions();
    updateTurnInfo();
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    localStorage.setItem('isSoundOn', isSoundOn); // 音声設定をローカルストレージに保存
    document.getElementById('sound-toggle').innerText = isSoundOn ? '音声オフ' : '音声オン';
}

// ルールボタンの追加
document.getElementById('rule-button').addEventListener('click', toggleRules);
