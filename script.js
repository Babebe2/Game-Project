// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game variables
let score = 0;
let gameOver = false;
let playerSpeed = 5;
let bulletSpeed = 5;
let enemySpeed = 2;

// Player object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'lime',
    dx: 0,
};

// Bullet array
let bullets = [];

// Enemy array
let enemies = [];

// Event listeners for movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -playerSpeed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = playerSpeed;
    } else if (e.key === ' ') {
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
        player.dx = 0;
    }
});

// Shoot bullet
function shootBullet() {
    const bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        color: 'yellow',
    };
    bullets.push(bullet);
}

// Create enemies
function createEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 40),
        y: 0,
        width: 40,
        height: 40,
        color: 'red',
    };
    enemies.push(enemy);
}

// Update player position
function updatePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) bullets.splice(index, 1);  // Remove bullets that go off-screen
    });
}

// Update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) enemies.splice(index, 1); // Remove enemies off-screen
    });
}

// Check for collisions between bullets and enemies
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Bullet hit enemy
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
            }
        });
    });
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemies
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    // Check for game over (if an enemy hits the player)
    enemies.forEach(enemy => {
        if (enemy.y + enemy.height > player.y &&
            enemy.x + enemy.width > player.x &&
            enemy.x < player.x + player.width) {
            gameOver = true;
        }
    });

    // If game over, show a message
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 90, canvas.height / 2);
    }
}

// Main game loop
function gameLoop() {
    if (gameOver) return;

    updatePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();
    draw();

    requestAnimationFrame(gameLoop);
}

// Create enemies at intervals
setInterval(() => {
    if (!gameOver) createEnemy();
}, 1000); // Create a new enemy every second

// Start the game
gameLoop();

