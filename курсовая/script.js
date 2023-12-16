var timerTime;

document.addEventListener('DOMContentLoaded', function() {
    var difficultyButtons = document.querySelectorAll('.difficulty-button');
    difficultyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var difficulty;
            if (this.classList.contains('easy')) {
                timerTime = 90;
                difficulty = 'Easy';
            } else if (this.classList.contains('medium')) {
                timerTime = 50;
                difficulty = 'Medium';
            } else if (this.classList.contains('hard')) {
                timerTime = 35;
                difficulty = 'Hard';
            }
            localStorage.setItem('timerTime', timerTime);
            localStorage.setItem('difficulty', difficulty); // Сохраняем уровень сложности
            showPlayerNameInput();
        });
    });

    document.getElementById('show-ranking').addEventListener('click', function() {
        var rankingContainer = document.getElementById('ranking-container');
        var rankingList = document.getElementById('ranking-list');
    
        rankingList.innerHTML = ''; // Очищаем текущий список
        var results = JSON.parse(localStorage.getItem('results')) || [];
    
        // Сортировка результатов по уровню сложности
        sortResults(results);
    
        results.forEach(function(result) {
            var entry = document.createElement('div');
            entry.textContent = `${result.playerName} - ${result.difficulty}`;
            rankingList.appendChild(entry);
        });
    
        // Отображаем контейнер рейтинга
        rankingContainer.style.display = 'block';
    });
    
    // Функция для сортировки результатов
    function sortResults(results) {
        results.sort(function(a, b) {
            var difficultyOrder = { 'Hard': 1, 'Medium': 2, 'Easy': 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
    }
    
    

    document.getElementById('close-ranking').addEventListener('click', function() {
        var rankingContainer = document.getElementById('ranking-container');
        var content = document.querySelector('.content'); // Предполагаем, что это основной контент страницы
    
        // Скрываем рейтинг и показываем основной контент
        rankingContainer.style.display = 'none';
        content.style.display = 'block';
    });


    document.getElementById('reset-ranking').addEventListener('click', clearRanking);
    
});


function startGame() {
    document.querySelector('.game-title').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
    document.querySelector('.difficulty-container').style.display = 'block';
}

function showPlayerNameInput() {
    document.querySelector('.difficulty-container').style.display = 'none';
    document.querySelector('.player-name-container').style.display = 'block';
}

function confirmName() {
    var playerNameInput = document.querySelector('.player-name-input');
    var playerName = playerNameInput.value; // Получаем имя игрока из поля ввода

    if(playerName) { // Проверяем, что имя не пустое
        localStorage.setItem('playerName', playerName); // Сохраняем имя в localStorage
        window.location.href = 'game/game.html'; // Перенаправляем пользователя на страницу игры
    } else {
        alert('Пожалуйста, введите имя игрока.');
    }
}


function clearRanking() {
    // Очищаем 'results' из localStorage
    localStorage.removeItem('results');

    // Обновляем отображение рейтинга, если он открыт
    var rankingList = document.getElementById('ranking-list');
    if (rankingList) {
        rankingList.innerHTML = ''; // Очищаем список рейтинга
    }
}
