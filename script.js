const selectablePokemon = ['pikachu', 'charmander', 'squirtle', 'bulbasaur'];

const items = {
    pikachu:    { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', name: 'Pikachu' },
    charmander: { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', name: 'Charmander' },
    squirtle:   { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', name: 'Squirtle' },
    bulbasaur:  { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', name: 'Bulbasaur' },
    pokeball:   { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', name: 'Pokebola' },
    center:     { img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png', name: 'Poción' }
};

const symbols = [
    'pikachu', 'charmander', 'squirtle', 'bulbasaur',
    'pikachu', 'charmander', 'squirtle', 'bulbasaur',
    'pikachu', 'charmander', 'squirtle', 'bulbasaur',
    'pikachu', 'charmander', 'squirtle', 'bulbasaur', 
    'pikachu', 'charmander', 'squirtle', 'bulbasaur', 
    'center', 'pokeball'
];

const players = {
    player1: { name: "Jugador 1", money: 500, progress: 0, selectionIndex: 0 },
    player2: { name: "Jugador 2", money: 500, progress: 0, selectionIndex: 1 },
    player3: { name: "Jugador 3", money: 500, progress: 0, selectionIndex: 2 }
};

const MAX_PROGRESS = 10;

function startGame() {
    const p1Input = document.getElementById('input-p1');
    const p2Input = document.getElementById('input-p2');
    const p3Input = document.getElementById('input-p3');

    players.player1.name = p1Input.value || "Jugador 1";
    players.player2.name = p2Input.value || "Jugador 2";
    players.player3.name = p3Input.value || "Jugador 3";

    document.getElementById('name-player1').textContent = players.player1.name;
    document.getElementById('name-player2').textContent = players.player2.name;
    document.getElementById('name-player3').textContent = players.player3.name;

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-board').classList.remove('hidden');

    p1Input.blur();
    p2Input.blur();
    p3Input.blur();
    document.body.focus();

    initCarousel();
}

function initCarousel() {
    updateCarouselDisplay('player1');
    updateCarouselDisplay('player2');
    updateCarouselDisplay('player3');
}

function changePokemon(playerId, direction) {
    const player = players[playerId];
    player.selectionIndex += direction;
    
    if (player.selectionIndex < 0) {
        player.selectionIndex = selectablePokemon.length - 1;
    } else if (player.selectionIndex >= selectablePokemon.length) {
        player.selectionIndex = 0;
    }
    updateCarouselDisplay(playerId);
}

function updateCarouselDisplay(playerId) {
    const player = players[playerId];
    const pokemonKey = selectablePokemon[player.selectionIndex];
    const pokemonData = items[pokemonKey];

    const imgEl = document.getElementById(`${playerId}-img`);
    const nameEl = document.getElementById(`${playerId}-name`);
    
    if(imgEl) imgEl.src = pokemonData.img;
    if(nameEl) nameEl.textContent = pokemonData.name;
}

function spin(id) {
    const player = players[id];
    const card = document.getElementById(id);
    const moneySpan = card.querySelector('.money');
    const reel = document.getElementById(`${id}-reel`);
    const msgLog = document.getElementById(`${id}-log`);
    const btn = card.querySelector('.spin-btn');
    const progressBar = document.getElementById(`${id}-bar`);

    if (player.money < 10) {
        msgLog.textContent = "¡Sin dinero!";
        msgLog.className = "message-log lose";
        return;
    }

    if (btn.disabled) return;

    player.money -= 10;
    moneySpan.textContent = player.money;
    btn.disabled = true;
    msgLog.textContent = "Girando...";
    msgLog.className = "message-log";
    card.classList.add('spinning');
    reel.innerHTML = '<span style="font-size:30px">🌀</span>';

    setTimeout(() => {
        card.classList.remove('spinning');
        
        const resultKey = symbols[Math.floor(Math.random() * symbols.length)];
        const resultData = items[resultKey];
        reel.innerHTML = `<img src="${resultData.img}" alt="${resultData.name}">`;

        const selectedKey = selectablePokemon[player.selectionIndex];
        let message = "";
        let messageClass = "";

        if (resultKey === selectedKey) {
            player.progress += 1;
            message = `¡Coincidencia! (+1)`;
            messageClass = "win";
        } else if (resultKey === 'center') {
            player.progress += 2;
            message = "¡Bonus Poción! (+2)";
            messageClass = "super-win";
        } else if (resultKey === 'pokeball') {
            player.progress -= 1;
            message = "¡Atrapado! (-1)";
            messageClass = "lose";
        } else {
            message = "Fallaste...";
            messageClass = "";
        }

        if (player.progress < 0) player.progress = 0;
        if (player.progress > MAX_PROGRESS) player.progress = MAX_PROGRESS;

        const percentage = (player.progress / MAX_PROGRESS) * 100;
        progressBar.style.width = `${percentage}%`;
        
        if(percentage < 30) progressBar.style.background = "#ff4444";
        else if (percentage < 70) progressBar.style.background = "#ffbb33";
        else progressBar.style.background = "#00C851";

        msgLog.textContent = message;
        msgLog.className = `message-log ${messageClass}`;

       
        if (player.progress === MAX_PROGRESS) {
            showVictory(player.name);
        }

        btn.disabled = false;
    }, 1000);
}

function showVictory(winnerName) {
    const gameBoard = document.getElementById('game-board');
    const victoryScreen = document.getElementById('victory-screen');
    const winnerNameEl = document.getElementById('winner-name');

    if(gameBoard) gameBoard.classList.add('hidden');
    if(victoryScreen) victoryScreen.classList.remove('hidden');
    if(winnerNameEl) winnerNameEl.textContent = winnerName;
}

document.addEventListener('keydown', function(event) {
    const victoryScreen = document.getElementById('victory-screen');
    if (!victoryScreen.classList.contains('hidden')) return;
    
    if (event.repeat) return;
    
    switch (event.code) {
        case 'KeyA': spin('player1'); animateButton('player1'); break;
        case 'KeyS': spin('player2'); animateButton('player2'); break;
        case 'KeyD': spin('player3'); animateButton('player3'); break;
    }
});

function animateButton(playerId) {
    const btn = document.querySelector(`#${playerId} .spin-btn`);
    if (btn && !btn.disabled) {
        btn.style.transform = "scale(0.95)";
        btn.style.background = "#ffcc00";
        setTimeout(() => {
            btn.style.transform = "scale(1)";
            btn.style.background = "";
        }, 100);
    }
}