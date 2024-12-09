let lastParentChoice = null; // CPUの前回の役
let lastChildChoice = null;  // プレイヤーの前回の役
let isParentTurn = true;     // 現在のターンが親のターンかどうか
let turnCounter = 1;         // 現在のターン数

const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún'];
const roleImages = {
    CPU: { 'Ye': 'cpu-ye.png', 'Ch’e': 'cpu-che.png', 'Nge': 'cpu-nge.png', 'Kiún': 'cpu-kiun.png' },
    Player: { 'Ye': 'player-ye.png', 'Ch’e': 'player-che.png', 'Nge': 'player-nge.png', 'Kiún': 'player-kiun.png' }
};

function getRandomChoice(exclude) {
    let choices = roles.filter(role => role !== exclude);
    return choices[Math.floor(Math.random() * choices.length)];
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
    document.getElementById('current-parent').innerText = isParentTurn ? 'CPU' : 'プレイヤー';
    document.getElementById('current-child').innerText = isParentTurn ? 'プレイヤー' : 'CPU';
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
        resultMessage = '子のKiúnに対し、親がKiún以外を出したため親の負け！';
    } else if (parentChoice === 'Kiún' && childChoice !== 'Kiún') {
        resultMessage = '親のKiúnに対し、子がKiúnを出さなかったため子の負け！';
    } else if (parentChoice === childChoice) {
        resultMessage = '親と子が同じ役を出したため子の負け！';
    }

    // 勝敗が決した場合
    if (resultMessage) {
        updateRoleImages();
        endGame(resultMessage);
        return;
    }

    // 勝負が決まらない場合、ターン交代
    turnCounter++;
    isParentTurn = !isParentTurn;

    // UIの更新
    updateRoleImages();
    updateNextOptions();
    updateTurnInfo();
}
