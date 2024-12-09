let lastParentChoice = null;
let lastChildChoice = null;
let isParentTurn = true;
let turnCounter = 1;

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

function playTurn(childChoice) {
    if (roles.includes(childChoice) && childChoice === lastChildChoice) {
        alert('同じ役を続けて出すことはできません！');
        return;
    }

    let parentChoice = getRandomChoice(lastParentChoice);
    if (isParentTurn && parentChoice === lastParentChoice) {
        parentChoice = getRandomChoice(lastParentChoice);
    }

    lastParentChoice = parentChoice;
    lastChildChoice = childChoice;

    // 勝敗ロジック省略 (前のコードから引き継ぎ)
    updateRoleImages();
    document.getElementById('turn-counter').innerText = turnCounter++;
    document.getElementById('current-parent').innerText = isParentTurn ? 'CPU' : 'プレイヤー';
    document.getElementById('current-child').innerText = isParentTurn ? 'プレイヤー' : 'CPU';
}
