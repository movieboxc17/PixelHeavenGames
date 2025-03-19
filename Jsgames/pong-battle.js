document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const player1ScoreElement = document.getElementById('player1-score');
    const player2ScoreElement = document.getElementById('player2-score');
    const startButton = document.getElementById('start-btn');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 500;

    // Game variables
    let gameRunning = false;
    let animationId;
    
    // Paddle properties
    const paddleWidth = 15;
    const paddleHeight = 100;
    const paddleSpeed = 8;
    
    // Ball properties
    const ballSize = 15;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    
    // Game objects
    const player1 = {
        x: 20,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        score: 0,
        moveUp: false,
        moveDown: false
    };
    
    const player2 = {
        x: canvas.width - 20 - paddleWidth,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        score: 0,
        moveUp: false,
        moveDown: false
    };
    
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: ballSize,
        speedX: ballSpeedX,
        speedY: ballSpeedY,
        reset: function() {
            this.x = canvas.width / 2;
            this.y = canvas.height / 2;
            // Randomize direction
            this.speedX = (Math.random() > 0.5 ? 1 : -1) * ballSpeedX;
            this.speedY = (Math.random() > 0.5 ? 1 : -1) * ballSpeedY;
        }
    };
    
    // Event listeners for keyboard controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'w': player1.moveUp = true; break;
            case 's': player1.moveDown = true; break;
            case 'ArrowUp': player2.moveUp = true; break;
            case 'ArrowDown': player2.moveDown = true; break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        switch(e.key) {
            case 'w': player1.moveUp = false; break;
            case 's': player1.moveDown = false; break;
            case 'ArrowUp': player2.moveUp = false; break;
            case 'ArrowDown': player2.moveDown = false; break;
        }
    });
    
    // Start button event listener
    startButton.addEventListener('click', () => {
        if (gameRunning) {
            // Reset game
            cancelAnimationFrame(animationId);
            resetGame();
            startButton.textContent = 'Start Game';
            gameRunning = false;
        } else {
            // Start game
            gameRunning = true;
            startButton.textContent = 'Reset Game';
            gameLoop();
        }
    });
    
    // Reset game state
    function resetGame() {
        player1.score = 0;
        player2.score = 0;
        player1.y = canvas.height / 2 - paddleHeight / 2;
        player2.y = canvas.height / 2 - paddleHeight / 2;
        ball.reset();
        updateScore();
    }
    
    // Update score display
    function updateScore() {
        player1ScoreElement.textContent = player1.score;
        player2ScoreElement.textContent = player2.score;
    }
    
    // Check for collisions
    function checkCollisions() {
        // Ball collision with top and bottom walls
        if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
            ball.speedY = -ball.speedY;
            playSound('wall');
        }
        
        // Ball collision with paddles
        if (
            // Player 1 paddle
            ball.x <= player1.x + player1.width &&
            ball.y + ball.size >= player1.y &&
            ball.y <= player1.y + player1.height &&
            ball.speedX < 0
        ) {
            ball.speedX = -ball.speedX * 1.05; // Increase speed slightly
            // Adjust Y speed based on where the ball hits the paddle
            const hitPosition = (ball.y - player1.y) / player1.height;
            ball.speedY = (hitPosition - 0.5) * 10;
            playSound('paddle');
        }
        
        if (
            // Player 2 paddle
            ball.x + ball.size >= player2.x &&
            ball.y + ball.size >= player2.y &&
            ball.y <= player2.y + player2.height &&
            ball.speedX > 0
        ) {
            ball.speedX = -ball.speedX * 1.05; // Increase speed slightly
            // Adjust Y speed based on where the ball hits the paddle
            const hitPosition = (ball.y - player2.y) / player2.height;
            ball.speedY = (hitPosition - 0.5) * 10;
            playSound('paddle');
        }
        
        // Ball out of bounds (scoring)
        if (ball.x < 0) {
            // Player 2 scores
            player2.score++;
            updateScore();
            ball.reset();
            playSound('score');
        } else if (ball.x > canvas.width) {
            // Player 1 scores
            player1.score++;
            updateScore();
            ball.reset();
            playSound('score');
        }
    }
    
    // Simple sound effects (can be expanded)
    function playSound(type) {
        // You can implement actual sounds here if desired
    }
    
    // Update game state
    function update() {
        // Move paddles
        if (player1.moveUp && player1.y > 0) {
            player1.y -= paddleSpeed;
        }
        if (player1.moveDown && player1.y + player1.height < canvas.height) {
            player1.y += paddleSpeed;
        }
        
        if (player2.moveUp && player2.y > 0) {
            player2.y -= paddleSpeed;
        }
        if (player2.moveDown && player2.y + player2.height < canvas.height) {
            player2.y += paddleSpeed;
        }
        
        // Move ball
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        
        // Check for collisions
        checkCollisions();
    }
    
    // Draw game objects
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        ctx.strokeStyle = '#333';
        ctx.setLineDash([10, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
        ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
        
        // Draw ball
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ball.x + ball.size/2, ball.y + ball.size/2, ball.size/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Game loop
    function gameLoop() {
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    // Initial draw
    draw();
});
