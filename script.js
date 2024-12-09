let lastParentChoice = null;
let lastChildChoice = null;
let isParentTurn = true;
let turnCounter = 1;
let audioEnabled = true;
const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún'];
const roleAudio = {
    'Ye': 'audio/ye-sound.m4a',
    'Ch’e': 'audio/che-sound.m4a',
    'Nge': 'audio/nge-sound.m4a',
    'Kiún': 'audio/kiun-sound.m4a'
};

document.getElementById('toggle-audio').addEventListener('click', toggleAudio);
document.getElementById('confirm-selection').addEventListener('click', confirmSelection);

function toggleAudio() {
    audioEnabled = !audioEnabled;
    document.getElementById('toggle-audio').innerText = audioEnabled ? '音声オフ' : '音声オン';
}

function playAudio(role) {
    if (audioEnabled && roleAudio[role]) {
        const audio = new Audio(roleAudio[role]);
        audio.play();
    }
}

function confirmSelection() {
    const playerChoice = document.querySelector('#player-choices button.selected')?.dataset.role;
    if (!playerChoice) {
        alert('役を選択してください！');
        return;
    }
    if (turnCounter === 1 && playerChoice === 'Kiún') {
        alert('初手ではKiúnを出せません！');
        return;
    }

    // プレイヤーの選択を反映
    lastChildChoice = playerChoice;

    // CPUの選択
    const cpuChoice = chooseCpuRole();
    lastParentChoice = cpuChoice;

    // 音声再生
    playAudio(playerChoice);
    playAudio(cpuChoice);

    // 表示更新
    updateGameDisplay(playerChoice, cpuChoice);

    // 勝敗判定
    checkGameOutcome(playerChoice, cpuChoice);

    // 次のターン準備
    prepareNextTurn();
}

function chooseCpuRole() {
    const availableRoles = roles.filter(role => role !== lastParentChoice && !(turnCounter === 1 && role === 'Kiún'));
    return availableRoles[Math.floor(Math.random() * availableRoles.length)];
}

function updateGameDisplay(playerChoice, cpuChoice) {
    document.getElementById('player-role-img').src = `images/${playerChoice}.png`;
    document.getElementById('cpu-role-img').src = `images/${cpuChoice}.png`;
}

function checkGameOutcome(playerChoice, cpuChoice) {
    if (playerChoice === 'Kiún' && cpuChoice !== 'Kiún') {
        alert('プレイヤーの勝利！');
    } else if (cpuChoice === 'Kiún' && playerChoice !== 'Kiún') {
        alert('CPUの勝利！');
    } else if (playerChoice !== cpuChoice) {
        alert('プレイヤーの負け！');
    }
}

function prepareNextTurn() {
    isParentTurn = !isParentTurn;
    turnCounter++;
    document.getElementById('turn-counter').innerText = turnCounter;
    document.getElementById('current-parent').innerText = isParentTurn ? 'プレイヤー' : 'CPU';
    document.getElementById('current-child').innerText = isParentTurn ? 'CPU' : 'プレイヤー';

    // 初手のKiúnルール対応
    document.querySelector('#player-choices button[data-role="Kiún"]').disabled = (turnCounter === 1);
}

