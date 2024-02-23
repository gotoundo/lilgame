document.addEventListener('DOMContentLoaded', (event) => {
    const gridSize = 10;
    let playerPos = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) };
    let enemies = [];
    let score = 0;
    let health = 3; // Initialize this at the top of your script or in the start/restart game function


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
            if (!checkCollisions()) { // Only update the game if there's no collision resulting in game over
                updateGame();
            }
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

   // Move enemies towards the player without overlapping
   function moveEnemies() {
    const newPositions = []; // Track new positions to prevent overlaps

    enemies.forEach((enemy, index) => {
        let possibleMoves = [
            { x: enemy.x, y: enemy.y } // Stay in place
        ];

        // Add possible new positions
        if (enemy.x < playerPos.x) {
            possibleMoves.push({ x: enemy.x + 1, y: enemy.y });
        } else if (enemy.x > playerPos.x) {
            possibleMoves.push({ x: enemy.x - 1, y: enemy.y });
        }
        if (enemy.y < playerPos.y) {
            possibleMoves.push({ x: enemy.x, y: enemy.y + 1 });
        } else if (enemy.y > playerPos.y) {
            possibleMoves.push({ x: enemy.x, y: enemy.y - 1 });
        }

        // Filter out positions already taken by other enemies or the player
        possibleMoves = possibleMoves.filter(pos =>
            !newPositions.some(newPos => newPos.x === pos.x && newPos.y === pos.y) &&
            !enemies.some(otherEnemy => otherEnemy.x === pos.x && otherEnemy.y === pos.y) &&
            !(playerPos.x === pos.x && playerPos.y === pos.y)
        );

        // Choose a move from the filtered possibilities
        if (possibleMoves.length > 0) {
            if (possibleMoves.length > 1) { // Exclude the original position if there are other options
                possibleMoves.shift(); // Remove the original stay-in-place option
            }
            const chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

            // Check if chosenMove is defined
            if (chosenMove) {
                // Update the enemy's position
                newPositions.push(chosenMove); // Save this move to prevent others from moving here
                enemies[index] = chosenMove; // Update the enemy's position
            } else {
                // Keep the enemy in its current position if no valid move is found
                newPositions.push({ x: enemy.x, y: enemy.y });
            }
        } else {
            // If no possible moves, add current position to newPositions to avoid others moving into it
            newPositions.push({ x: enemy.x, y: enemy.y });
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

    function checkCollisions() {
        if (enemies.some(enemy => enemy.x === playerPos.x && enemy.y === playerPos.y)) {
            health--; // Decrease health if collision is detected
            console.log("losing health");
            updateGame();
            if (health <= 0) {
                document.getElementById('lose-screen').style.display = 'block'; // Show the "You Lose!" screen
                document.removeEventListener('keydown', handleKeyDown); // Disable further input
                return true; // Return true to indicate a collision occurred
            }
        }
        return false; // Return false to indicate no collision occurred
    }
    

    function restartGame() {
        health = 3; // Reset health, assuming starting health is 3
        score = 0; // Reset score
        enemies = []; // Clear enemies
        playerPos = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }; // Reset player position
        document.getElementById('lose-screen').style.display = 'none'; // Hide the "You Lose!" screen
        document.addEventListener('keydown', handleKeyDown); // Re-enable keyboard controls
        updateGame(); // Re-initialize the game state
        for (let i = 0; i < 5; i++) { addEnemy(); } // Add initial enemies
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

