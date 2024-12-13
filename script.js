let lastParentChoice = null; // CPUの前回の役
let lastChildChoice = null;  // プレイヤーの前回の役
let isParentTurn = true;     // 現在のターンが親のターンかどうか
let turnCounter = 1;         // 現在のターン数
let isSoundOn = localStorage.getItem('isSoundOn') === 'true'; // ローカルストレージから音声設定を読み込む
let isFirstTurn = true;      // 初回ターンの判定
let prevPlayerChoices = [];  // プレイヤーの過去の選択履歴
let prevCPUChoices = [];     // CPUの過去の選択履歴
let canPlayerChooseFre = false; // プレイヤーがFreを選べるか
let canCPUChooseFre = false;    // CPUがFreを選べるか

const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún', 'Fre']; // 'Fre'を役に追加
const roleImages = {
    CPU: { 'Ye': 'images/cpu-ye.png', 'Ch’e': 'images/cpu-che.png', 'Nge': 'images/cpu-nge.png', 'Kiún': 'images/cpu-kiun.png', 'Fre': 'images/cpu-fre.png' },
    Player: { 'Ye': 'images/player-ye.png', 'Ch’e': 'images/player-che.png', 'Nge': 'images/player-nge.png', 'Kiún': 'images/player-kiun.png', 'Fre': 'images/player-fre.png' }
};
const soundFiles = {
    Ye: 'audio/ye-sound.mp3',
    'Ch’e': 'audio/che-sound.mp3',
    Nge: 'audio/nge-sound.mp3',
    Kiún: 'audio/kiun-sound.mp3',
    Fre: 'audio/fre-sound.mp3'
};

// プレイヤーがYe→Ch’eまたはCh’e→Ngeの順番で連続したターンを出した次のターンでFreボタンが有効
function checkFreAvailabilityForPlayer() {
    if (prevPlayerChoices.length < 2) return false; // 直前のターンが不足している場合、Freは選べない
    return (prevPlayerChoices[prevPlayerChoices.length - 2] === 'Ye' && prevPlayerChoices[prevPlayerChoices.length - 1] === 'Ch’e') ||
           (prevPlayerChoices[prevPlayerChoices.length - 2] === 'Ch’e' && prevPlayerChoices[prevPlayerChoices.length - 1] === 'Nge');
}

// CPUがYe→Ch’eまたはCh’e→Ngeの順番で連続したターンを出した次のターンでFreが選べないようにする
function checkFreAvailabilityForCPU() {
    if (prevCPUChoices.length < 2) return false; // 直前のターンが不足している場合、Freは選べない
    return (prevCPUChoices[prevCPUChoices.length - 2] === 'Ye' && prevCPUChoices[prevCPUChoices.length - 1] === 'Ch’e') ||
           (prevCPUChoices[prevCPUChoices.length - 2] === 'Ch’e' && prevCPUChoices[prevCPUChoices.length - 1] === 'Nge');
}

// 適切なランダムな役を選ぶ（Freは現在選べる場合のみ選択肢に含める）
function getRandomChoice(exclude) {
    let choices = roles.filter(role => role !== exclude && (role !== 'Fre' || (canCPUChooseFre && !checkFreAvailabilityForCPU())));
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
    let cpuOptions = roles.filter(role => role !== lastParentChoice && (role !== 'Fre' || canCPUChooseFre)).join(', ');
    let playerOptions = roles.filter(role => role !== lastChildChoice && (role !== 'Fre' || canPlayerChooseFre)).join(', ');

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

// プレイヤーがFreを選ぶ前に、連続した役が必要かどうか
function canPlayerChooseFreNow(childChoice) {
    if (childChoice === 'Fre') {
        if (checkFreAvailabilityForPlayer()) {
            canPlayerChooseFre = true;
            return true;
        } else {
            canPlayerChooseFre = false;
            alert('このターンではFreは選べません！');
            return false;
        }
    }
    canPlayerChooseFre = false; // 他の選択肢の場合はFreを選べない
    return true;
}

// CPUがFreを選ぶ前に、連続した役が必要かどうか
function canCPUChooseFreNow(parentChoice) {
    if (parentChoice === 'Fre') {
        if (checkFreAvailabilityForCPU()) {
            canCPUChooseFre = true;
            return true;
        } else {
            canCPUChooseFre = false;
            alert('CPUはこのターンではFreを選べません！');
            return false;
        }
    }
    canCPUChooseFre = false; // 他の選択肢の場合はFreを選べない
    return true;
}

function playTurn(childChoice) {
    if (!roles.includes(childChoice)) {
        alert('無効な選択です。');
        return;
    }

    // プレイヤーがFreを選べる場合
    if (childChoice === 'Fre' && !canPlayerChooseFreNow(childChoice)) {
        return;
    }

    // CPUがFreを選べる場合
    if (isParentTurn && childChoice === 'Fre' && !canCPUChooseFreNow(lastParentChoice)) {
        return;
    }

    // 初手でKiúnを出せない制約
    if (turnCounter === 1 && childChoice === 'Kiún') {
        alert('初手でKiúnは出せません！');
        return;
    }

    if (childChoice === lastChildChoice) {
        alert('同じ役を続けて出すことはできません！');
        return;
    }

    let parentChoice = getRandomChoice(lastParentChoice);
    if (isParentTurn && parentChoice === lastParentChoice) {
        parentChoice = getRandomChoice(lastParentChoice);
    }

    // 現在の役を保存
    lastParentChoice = parentChoice;
    lastChildChoice = childChoice;

    // 勝敗判定
    let resultMessage = '';
    if (childChoice === 'Kiún' && parentChoice !== 'Kiún') {
        resultMessage = 'Kiúnが一致しなかったため、親の負け！';
    } else if (parentChoice === 'Kiún' && childChoice !== 'Kiún') {
        resultMessage = 'Kiúnが一致しなかったため、親の負け！';
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

    // Freの勝敗処理
    if (childChoice === 'Fre' && parentChoice === 'Kiún') {
        resultMessage = 'FreはKiúnに対して親の勝ち！';
    } else if (parentChoice === 'Fre' && childChoice === 'Kiún') {
        resultMessage = 'FreはKiúnに対して親の勝ち！';
    } else if (childChoice === 'Fre' && parentChoice === 'Fre') {
        resultMessage = 'Fre同士の勝負は親の勝ち！';
    } else if (childChoice === 'Fre' && ['Ye', 'Ch’e', 'Nge'].includes(parentChoice)) {
        resultMessage = 'Freと役が異なるため引き分け、ゲームは続行！';
        turnCounter++;
        updateRoleImages();
        playSound(childChoice); // 役の音声を再生
        updateNextOptions();
        updateTurnInfo();
        return;
    }

    if (resultMessage) {
        updateRoleImages();
        playSound(childChoice); // 役の音声を再生
        endGame(resultMessage);
        return;
    }

    // 勝敗が決まらない場合、ターン交代
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
}

// 選択ボタンを押すとこの関数が呼ばれます
document.getElementById('ye-button').onclick = function() { playTurn('Ye'); };
document.getElementById('che-button').onclick = function() { playTurn('Ch’e'); };
document.getElementById('nge-button').onclick = function() { playTurn('Nge'); };
document.getElementById('kiun-button').onclick = function() { playTurn('Kiún'); };
document.getElementById('fre-button').onclick = function() { playTurn('Fre'); };
