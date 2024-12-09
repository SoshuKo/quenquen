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

    // 役と現在の親・子の表示
    document.getElementById('status').innerText = 
        `現在の親: ${isParentTurn ? 'CPU' : 'プレイヤー'}\n` +
        `現在の子: ${isParentTurn ? 'プレイヤー' : 'CPU'}\n` +
        `親の役: ${parentChoice}, 子の役: ${childChoice}`;

    // 勝敗判定
    if (childChoice === 'Kiún' && parentChoice !== 'Kiún') {
        endGame('子のKiúnに対し、親がKiún以外を出したため親の負け！');
    } else if (parentChoice === 'Kiún' && childChoice !== 'Kiún') {
        endGame('親のKiúnに対し、子がKiúnを出さなかったため子の負け！');
    } else if (roles.indexOf(parentChoice) === roles.indexOf(childChoice)) {
        endGame('親と子が同じ役を出したため子の負け！');
    } else {
        // 勝負が決まらない場合、ターン交代
        lastChildChoice = childChoice;
        switchTurn();
    }
}

function switchTurn() {
    isParentTurn = !isParentTurn;
    if (isParentTurn) {
        document.getElementById('status').innerText += '\n次は親（CPU）のターンです。';
    } else {
        document.getElementById('status').innerText += '\n次は親（プレイヤー）のターンです。';
    }
}

function endGame(message) {
    document.getElementById('status').innerText += `\n${message}`;
    document.getElementById('choices').innerHTML = '<button onclick="location.reload()">もう一度遊ぶ</button>';
}

