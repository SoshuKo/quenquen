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
document.querySelectorAll('#player-choices button').forEach(button => {
    button.addEventListener('click', () => selectRole(button));
});

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

function selectRole(button) {
    const playerChoice = button.dataset.role;

    // すでに選択したボタンがあれば選択解除
    document.querySelectorAll('#player-choices button').forEach(b => b.classList.remove('selected'));

    button.classList.add('selected');
    lastChildChoice = playerChoice;

    // 初手でKiúnを出せないルール
    document.getElementById('kiun-btn').disabled = (turnCounter === 1 && playerChoice === 'Kiún');
}

function confirmSelection() {
    const playerChoice = lastChildChoice;
    if (!playerChoice) {
        alert('役を選択してください！');
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
    document.getElementById('player-role-img').src = `images/player-${playerChoice.toLowerCase()}.png`;
    document.getElementById('cpu-role-img').src = `images/cpu-${cpuChoice.toLowerCase()}.png`;
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
