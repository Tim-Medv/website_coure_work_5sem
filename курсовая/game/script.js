document.addEventListener('DOMContentLoaded', () => {
    generateLevel(levels[currentLevel]);

    var timerTime = localStorage.getItem('timerTime'); // Извлекаем время из localStorage
    if (timerTime) {
        startTimer(parseInt(timerTime), document.querySelector('#timer'));
    } else {
        console.error('время не определено');
        // Обрабатываем ошибку, если время не было определено
    }

    var playerName = localStorage.getItem('playerName'); // Извлекаем имя игрока из localStorage
    console.log('Игрок:', playerName);
    if (playerName) {
        // Форматируем и отображаем имя игрока на странице
        document.querySelector('.player-name-display').textContent = 'player ' + playerName;
    }
    
});


function attachEventListeners() {
    document.querySelectorAll('.test-tube').forEach(tube => {
        tube.addEventListener('click', function() {
            if (selectedTube) {
                if (selectedTube !== this) {
                    animatePouring(selectedTube, this);
                }
                selectedTube = null;
            } else {
                if (this.querySelector('.liquid')) {
                    selectedTube = this;
                }
            }
        });
    });
}

let selectedTube = null;

function animatePouring(fromTube, toTube) {
    const fromLiquid = fromTube.querySelector('.liquid:last-child');
    const toLiquids = toTube.querySelectorAll('.liquid');

    if (fromLiquid && canPour(fromLiquid, toTube)) {
        fromLiquid.style.height = '0px';
        
        if (toLiquids.length > 0) {
            toLiquids[0].style.height = '200px';
        } else {
            const newLiquid = document.createElement('div');
            newLiquid.className = fromLiquid.className;
            newLiquid.style.height = '0px';
            toTube.appendChild(newLiquid);
            setTimeout(() => {
                newLiquid.style.height = '100px';
            }, 0);
        }

        setTimeout(() => {
            fromLiquid.remove();
            checkCompletion();
        }, 800);
    }
}

function canPour(fromLiquid, toTube) {
    const toLiquids = toTube.querySelectorAll('.liquid');

    if (toLiquids.length === 2) {
        return false;
    } else if (toLiquids.length === 1) {
        return fromLiquid.className === toLiquids[0].className;
    }
    return true;
}









function checkCompletion() {
    const allTubes = document.querySelectorAll('.test-tube');
    const isCompleted = Array.from(allTubes).every(tube => {
        const liquids = tube.querySelectorAll('.liquid');
        return liquids.length === 0 || (liquids.length === 1 && liquids[0].style.height === '200px');
    });

    if (isCompleted) {
        showCompletionMessage();
    }
}

function showCompletionMessage() {
    const message = document.createElement('div');
    message.textContent = 'Уровень пройден!';
    message.id = 'completion-message';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
        if (currentLevel < levels.length - 1) {
            generateNextLevel();
        } else {
            saveGameResult();
            showFinalMessage();
        }
    }, 1000);
}


function saveGameResult() {
    const playerName = localStorage.getItem('playerName');
    const difficulty = localStorage.getItem('difficulty');
    const results = JSON.parse(localStorage.getItem('results')) || [];

    results.push({ playerName, difficulty });
    localStorage.setItem('results', JSON.stringify(results));
}


function generateNextLevel() {
    // Переходим к следующему уровню
    currentLevel++;
    // Проверяем, есть ли еще уровни
    if (currentLevel < levels.length) {
        generateLevel(levels[currentLevel]);
    }
}


function generateLevel(levelConfig) {
    // Перемешиваем конфигурацию уровня перед созданием уровня
    shuffle(levelConfig);
    
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = ''; // Очищаем текущий уровень

    levelConfig.forEach((config, index) => {
        const tube = document.createElement('div');
        tube.className = 'test-tube';
        tube.id = `tube${index + 1}`;

        config.forEach(color => {
            const liquid = document.createElement('div');
            liquid.className = `liquid ${color}`;
            tube.appendChild(liquid);
        });

        gameContainer.appendChild(tube);
    });

    attachEventListeners();
}


const levels = [
    [ // Уровень 1
        ['yellow', 'brown'],
        ['brown', 'yellow'],
        []
    ],
    [ // Уровень 2
        ['yellow', 'red'],
        ['blue', 'yellow'],
        ['red', 'blue'],
        []
    ],
    [ // Уровень 3
        ['red', 'green'],   
        ['green', 'blue'],  
        ['yellow', 'red'],  
        ['blue', 'yellow'], 
        []                  
    ]
];


let currentLevel = 0;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Случайный индекс от 0 до i
        [array[i], array[j]] = [array[j], array[i]]; // Перестановка элементов
    }
}



function showFinalMessage() {
    clearInterval(timerInterval); // Останавливаем таймер

    const message = document.createElement('div');
    message.textContent = 'Успешное прохождение';
    message.className = 'game-title'; // Добавляем класс для стилизации

    // Создаем кнопку "Вернуться"
    const backButton = document.createElement('button');
    backButton.textContent = 'Вернуться';
    backButton.className = 'game-button'; // Добавляем класс для стилизации
    backButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    document.body.innerHTML = '';
    document.body.appendChild(message);
    document.body.appendChild(backButton);
}






//таймер
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}



function gameOver() {
    const message = document.createElement('div');
    message.textContent = 'Время вышло';
    message.className = 'game-end'; // Добавляем класс для стилизации сообщения "Время вышло"

    // Создаем кнопку "Вернуться"
    const backButton = document.createElement('button');
    backButton.textContent = 'Вернуться';
    backButton.classList.add('game-button', 'red'); 
    backButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    document.body.innerHTML = '';
    document.body.appendChild(message);
    document.body.appendChild(backButton);
}
