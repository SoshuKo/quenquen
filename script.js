let lastParentChoice = null;
let lastChildChoice = null;
let isParentTurn = true;

const roles = ['Ye', 'Ch’e', 'Nge', 'Kiún'];

function getRandomChoice(exclude) {
    let choices = roles.filter(role => role !== exclude);
    return choices[Math.floor(Math.random() * choices.length)];
}

function playTurn(childChoice) {
    let parentChoice = getRandomChoice(lastParentChoice);
    lastParentChoice = parentChoice;

    document.getElementById('status').innerText = `親: ${parentChoice}, 子: ${childChoice}`;

    if (parentChoice === 'Kiún' && childChoice !== 'Kiún') {
        endGame('親の勝ち');
    } else if (roles.indexOf(parentChoice) === roles.indexOf(childChoice)) {
        endGame('親の勝ち');
    } else {
        lastChildChoice = childChoice;
        switchTurn();
    }
}

function switchTurn() {
    isParentTurn = !isParentTurn;
    if (isParentTurn) {
        document.getElementById('status').innerText += ' 次は親のターンです。';
    } else {
        document.getElementById('status').innerText += ' 次は子のターンです。';
    }
}

function endGame(message) {
    document.getElementById('status').innerText = message;
    document.getElementById('choices').innerHTML = '<button onclick="location.reload()">もう一度遊ぶ</button>';
}
