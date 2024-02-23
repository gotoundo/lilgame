document.addEventListener('DOMContentLoaded', (event) => {
    const gridSize = 10;
    let playerPos = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) };
    let enemies = [];
    let score = 0;

    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');

    // Initialize grid
    function initializeGrid() {
        grid.innerHTML = ''; // Clear previous grid
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                if (x === playerPos.x && y === playerPos.y) {
                    cell.classList.add('player');
                } else if (enemies.some(enemy => enemy.x === x && enemy.y === y)) {
                    cell.classList.add('enemy');
                }
                grid.appendChild(cell);
            }
        }
    }

    // Move Player
    function movePlayer(dx, dy) {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            playerPos = { x: newX, y: newY };
            updateGame();
        }
    }

    // Check for nearby enemies and remove them
    function radialBlast() {
        enemies = enemies.filter(enemy => {
            const isNear = Math.abs(enemy.x - playerPos.x) <= 1 && Math.abs(enemy.y - playerPos.y) <= 1;
            if (isNear) score++;
            return !isNear;
        });
        updateGame();
    }

    // Move enemies towards the player
    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            if (enemy.x < playerPos.x) {
                enemy.x++;
            } else if (enemy.x > playerPos.x) {
                enemy.x--;
            }

            if (enemy.y < playerPos.y) {
                enemy.y++;
            } else if (enemy.y > playerPos.y) {
                enemy.y--;
            }
        });
        updateGame();
    }

    // Update game state: grid and score
    function updateGame() {
        scoreDisplay.textContent = `Score: ${score}`;
        initializeGrid();
    }

    // Add new enemy at random position
    function addEnemy() {
        enemies.push({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        });
        updateGame();
    }

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': movePlayer(0, -1); break;
            case 'ArrowDown': movePlayer(0, 1); break;
            case 'ArrowLeft': movePlayer(-1, 0); break;
            case 'ArrowRight': movePlayer(1, 0); break;
            case ' ': // Spacebar
                radialBlast();
                break;
            case 'q':
                alert('Game Over!'); // Add any cleanup or game over logic here
                break;
        }
    });

    // Enemy logic (move and spawn)
    setInterval(() => {
        moveEnemies();
        if (Math.random() < 0.3) { // Adjust spawn rate as desired
            addEnemy();
        }
    }, 1000); // Move enemies and check for spawns every 1 second

    // Initialize game
    for (let i = 0; i < 5; i++) { addEnemy(); } // Start with 5 enemies
    updateGame();
});
