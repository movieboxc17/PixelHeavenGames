// Game constants
const BALL_RADIUS = 10;
const HOLE_RADIUS = 15;
const MAX_POWER = 15;
const FRICTION = 0.98;
const MIN_SPEED = 0.1;
const PAR_VALUES = [3, 3, 3, 4, 4, 3, 5, 4, 5]; // Par values for each hole

// Game state
let canvas, ctx;
let gameWidth, gameHeight;
let currentPlayer = 1;
let currentHole = 1;
let playerScores = {
    1: Array(9).fill(0),
    2: Array(9).fill(0)
};
let playerTotalScores = { 1: 0, 2: 0 };
let ballMoving = false;
let touchStartPos = { x: 0, y: 0 };
let touchEndPos = { x: 0, y: 0 };
let powerMeter = { active: false, power: 0 };
let holeCompleted = false;

// Ball properties
let ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    isInHole: false
};

// Hole object to hold all course elements
let currentCourse = {
    ball: { startX: 0, startY: 0 },
    hole: { x: 0, y: 0 },
    obstacles: [],
    walls: [],
    sandTraps: []
};

// Course definitions for all 9 holes
const courses = [
    // Hole 1: Simple straight shot
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 700, y: 300 },
        obstacles: [],
        walls: [
            { x: 50, y: 250, width: 700, height: 10 }, // Top wall
            { x: 50, y: 350, width: 700, height: 10 }, // Bottom wall
            { x: 50, y: 250, width: 10, height: 110 }, // Left wall
            { x: 750, y: 250, width: 10, height: 110 }  // Right wall
        ],
        sandTraps: []
    },
    // Hole 2: Right angle
    {
        ball: { startX: 100, startY: 100 },
        hole: { x: 700, y: 500 },
        obstacles: [],
        walls: [
            { x: 50, y: 50, width: 700, height: 10 },  // Top wall
            { x: 50, y: 550, width: 700, height: 10 }, // Bottom wall
            { x: 50, y: 50, width: 10, height: 510 },  // Left wall
            { x: 750, y: 50, width: 10, height: 510 }, // Right wall
            { x: 50, y: 200, width: 500, height: 10 }  // Dividing wall
        ],
        sandTraps: []
    },
    // Hole 3: With obstacle
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 700, y: 300 },
        obstacles: [
            { x: 400, y: 300, radius: 30 }
        ],
        walls: [
            { x: 50, y: 250, width: 700, height: 10 }, // Top wall
            { x: 50, y: 350, width: 700, height: 10 }, // Bottom wall
            { x: 50, y: 250, width: 10, height: 110 }, // Left wall
            { x: 750, y: 250, width: 10, height: 110 }  // Right wall
        ],
        sandTraps: []
    },
    // Hole 4: With sand traps
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 700, y: 300 },
        obstacles: [],
        walls: [
            { x: 50, y: 200, width: 700, height: 10 }, // Top wall
            { x: 50, y: 400, width: 700, height: 10 }, // Bottom wall
            { x: 50, y: 200, width: 10, height: 210 }, // Left wall
            { x: 750, y: 200, width: 10, height: 210 }  // Right wall
        ],
        sandTraps: [
            { x: 300, y: 250, width: 100, height: 50 },
            { x: 500, y: 350, width: 100, height: 50 }
        ]
    },
    // Hole 5: Zigzag
    {
        ball: { startX: 100, startY: 100 },
        hole: { x: 700, y: 500 },
        obstacles: [],
        walls: [
            { x: 50, y: 50, width: 700, height: 10 },   // Top wall
            { x: 50, y: 550, width: 700, height: 10 },  // Bottom wall
            { x: 50, y: 50, width: 10, height: 510 },   // Left wall
            { x: 750, y: 50, width: 10, height: 510 },  // Right wall
            { x: 200, y: 150, width: 500, height: 10 }, // Divider 1
            { x: 50, y: 300, width: 500, height: 10 },  // Divider 2
            { x: 200, y: 450, width: 500, height: 10 }  // Divider 3
        ],
        sandTraps: [
            { x: 350, y: 200, width: 100, height: 50 },
            { x: 350, y: 350, width: 100, height: 50 }
        ]
    },
    // Hole 6: Narrow path
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 700, y: 300 },
        obstacles: [
            { x: 250, y: 250, radius: 20 },
            { x: 400, y: 350, radius: 20 },
            { x: 550, y: 250, radius: 20 }
        ],
        walls: [
            { x: 50, y: 200, width: 700, height: 10 }, // Top wall
            { x: 50, y: 400, width: 700, height: 10 }, // Bottom wall
            { x: 50, y: 200, width: 10, height: 210 }, // Left wall
            { x: 750, y: 200, width: 10, height: 210 }  // Right wall
        ],
        sandTraps: []
    },
    // Hole 7: Island green
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 600, y: 300 },
        obstacles: [],
        walls: [
            { x: 50, y: 150, width: 700, height: 10 },  // Top wall
            { x: 50, y: 450, width: 700, height: 10 },  // Bottom wall
                        { x: 50, y: 150, width: 10, height: 310 },  // Left wall
            { x: 750, y: 150, width: 10, height: 310 },  // Right wall
            { x: 500, y: 200, width: 200, height: 10 },  // Island top
            { x: 500, y: 400, width: 200, height: 10 },  // Island bottom
            { x: 500, y: 200, width: 10, height: 210 },  // Island left
            { x: 700, y: 200, width: 10, height: 210 }   // Island right
        ],
        sandTraps: [
            { x: 300, y: 200, width: 150, height: 200 },
            { x: 250, y: 250, width: 50, height: 100 }
        ]
    },
    // Hole 8: Windmill obstacle
    {
        ball: { startX: 100, startY: 300 },
        hole: { x: 700, y: 300 },
        obstacles: [
            { x: 400, y: 250, radius: 20 },
            { x: 400, y: 350, radius: 20 },
            { x: 400, y: 300, width: 150, height: 10, isRotating: true } // Rotating obstacle
        ],
        walls: [
            { x: 50, y: 200, width: 700, height: 10 },  // Top wall
            { x: 50, y: 400, width: 700, height: 10 },  // Bottom wall
            { x: 50, y: 200, width: 10, height: 210 },  // Left wall
            { x: 750, y: 200, width: 10, height: 210 }  // Right wall
        ],
        sandTraps: [
            { x: 550, y: 250, width: 100, height: 100 }
        ]
    },
    // Hole 9: Final challenge
    {
        ball: { startX: 100, startY: 100 },
        hole: { x: 700, y: 500 },
        obstacles: [
            { x: 300, y: 200, radius: 30 },
            { x: 400, y: 350, radius: 25 },
            { x: 600, y: 450, radius: 35 }
        ],
        walls: [
            { x: 50, y: 50, width: 700, height: 10 },   // Top wall
            { x: 50, y: 550, width: 700, height: 10 },  // Bottom wall
            { x: 50, y: 50, width: 10, height: 510 },   // Left wall
            { x: 750, y: 50, width: 10, height: 510 },  // Right wall
            { x: 200, y: 300, width: 300, height: 10 }, // Center divider
            { x: 550, y: 200, width: 10, height: 200 }  // Vertical divider
        ],
        sandTraps: [
            { x: 200, y: 400, width: 150, height: 80 },
            { x: 500, y: 150, width: 100, height: 80 }
        ]
    }
];

// Initialize the game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    loadHole(currentHole);
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    document.getElementById('play-again').addEventListener('click', restartGame);
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Resize canvas to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.getElementById('game-ui').offsetHeight;
    gameWidth = canvas.width;
    gameHeight = canvas.height;
    
    // Scale the course elements if needed
    if (currentCourse) {
        drawCourse();
    }
}

// Load a specific hole
function loadHole(holeNumber) {
    currentHole = holeNumber;
    const courseIndex = holeNumber - 1;
    currentCourse = JSON.parse(JSON.stringify(courses[courseIndex])); // Deep copy
    
    // Scale course elements based on canvas size
    scaleCourseToDimensions();
    
    // Reset ball
    resetBall();
    
    // Update UI
    document.getElementById('hole-number').textContent = `Hole ${holeNumber}`;
    document.getElementById('par-info').textContent = `Par: ${PAR_VALUES[courseIndex]}`;
    
    // Reset hole state
    holeCompleted = false;
}

// Scale course to canvas dimensions
function scaleCourseToDimensions() {
    const scaleX = gameWidth / 800;
    const scaleY = gameHeight / 600;
    
    // Scale ball start position
    currentCourse.ball.startX *= scaleX;
    currentCourse.ball.startY *= scaleY;
    
    // Scale hole position
    currentCourse.hole.x *= scaleX;
    currentCourse.hole.y *= scaleY;
    
    // Scale obstacles
    currentCourse.obstacles.forEach(obstacle => {
        obstacle.x *= scaleX;
        obstacle.y *= scaleY;
        if (obstacle.radius) obstacle.radius *= Math.min(scaleX, scaleY);
        if (obstacle.width) obstacle.width *= scaleX;
        if (obstacle.height) obstacle.height *= scaleY;
    });
    
    // Scale walls
    currentCourse.walls.forEach(wall => {
        wall.x *= scaleX;
        wall.y *= scaleY;
        wall.width *= scaleX;
        wall.height *= scaleY;
    });
    
    // Scale sand traps
    currentCourse.sandTraps.forEach(trap => {
        trap.x *= scaleX;
        trap.y *= scaleY;
        trap.width *= scaleX;
        trap.height *= scaleY;
    });
}

// Reset ball to starting position
function resetBall() {
    ball = {
        x: currentCourse.ball.startX,
        y: currentCourse.ball.startY,
        vx: 0,
        vy: 0,
        isInHole: false
    };
    ballMoving = false;
}

// Game loop
function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame() {
    // Skip updates if the hole is completed
    if (holeCompleted) return;
    
    // Update ball physics if it's moving
    if (ballMoving) {
        // Check if ball is in a sand trap (slower movement)
        let inSandTrap = false;
        for (const trap of currentCourse.sandTraps) {
            if (ball.x > trap.x && ball.x < trap.x + trap.width &&
                ball.y > trap.y && ball.y < trap.y + trap.height) {
                inSandTrap = true;
                break;
            }
        }
        
        // Apply friction (higher in sand)
        const frictionFactor = inSandTrap ? 0.95 : FRICTION;
        ball.vx *= frictionFactor;
        ball.vy *= frictionFactor;
        
        // Move ball
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // Check wall collisions
        for (const wall of currentCourse.walls) {
            // Horizontal wall collision
            if (ball.y + BALL_RADIUS > wall.y && ball.y - BALL_RADIUS < wall.y + wall.height) {
                // Right edge of wall
                if (ball.x - BALL_RADIUS < wall.x + wall.width && ball.x - BALL_RADIUS > wall.x && ball.vx < 0) {
                    ball.x = wall.x + wall.width + BALL_RADIUS;
                    ball.vx = -ball.vx * 0.7; // Dampen bounce
                }
                // Left edge of wall
                else if (ball.x + BALL_RADIUS > wall.x && ball.x + BALL_RADIUS < wall.x + wall.width && ball.vx > 0) {
                    ball.x = wall.x - BALL_RADIUS;
                    ball.vx = -ball.vx * 0.7; // Dampen bounce
                }
            }
            
            // Vertical wall collision
            if (ball.x + BALL_RADIUS > wall.x && ball.x - BALL_RADIUS < wall.x + wall.width) {
                // Bottom edge of wall
                if (ball.y - BALL_RADIUS < wall.y + wall.height && ball.y - BALL_RADIUS > wall.y && ball.vy < 0) {
                    ball.y = wall.y + wall.height + BALL_RADIUS;
                    ball.vy = -ball.vy * 0.7; // Dampen bounce
                }
                // Top edge of wall
                else if (ball.y + BALL_RADIUS > wall.y && ball.y + BALL_RADIUS < wall.y + wall.height && ball.vy > 0) {
                    ball.y = wall.y - BALL_RADIUS;
                    ball.vy = -ball.vy * 0.7; // Dampen bounce
                }
            }
        }
        
        // Check obstacle collisions
        for (const obstacle of currentCourse.obstacles) {
            if (obstacle.radius) {
                // Circle obstacle
                const dx = ball.x - obstacle.x;
                const dy = ball.y - obstacle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < BALL_RADIUS + obstacle.radius) {
                    // Calculate collision response
                    const nx = dx / distance;
                    const ny = dy / distance;
                    const dot = ball.vx * nx + ball.vy * ny;
                    
                    // Project velocity onto normal
                    ball.vx = (ball.vx - 2 * dot * nx) * 0.7;
                    ball.vy = (ball.vy - 2 * dot * ny) * 0.7;
                    
                    // Move ball outside of obstacle
                    const moveDistance = BALL_RADIUS + obstacle.radius - distance + 1;
                    ball.x += nx * moveDistance;
                    ball.y += ny * moveDistance;
                }
            } else if (obstacle.width && obstacle.height) {
                // Rectangular obstacle (for rotating barriers if needed)
                // Simplified collision handling for rectangle obstacles
                // For a more accurate rotation, would need more complex collision detection
                
                if (!obstacle.isRotating) {
                    // Handle like a wall
                    if (ball.x + BALL_RADIUS > obstacle.x && ball.x - BALL_RADIUS < obstacle.x + obstacle.width &&
                        ball.y + BALL_RADIUS > obstacle.y && ball.y - BALL_RADIUS < obstacle.y + obstacle.height) {
                        
                        // Find closest edge and bounce
                        const leftDist = Math.abs(ball.x - (obstacle.x - BALL_RADIUS));
                        const rightDist = Math.abs(ball.x - (obstacle.x + obstacle.width + BALL_RADIUS));
                        const topDist = Math.abs(ball.y - (obstacle.y - BALL_RADIUS));
                        const bottomDist = Math.abs(ball.y - (obstacle.y + obstacle.height + BALL_RADIUS));
                        
                        const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
                        
                        if (minDist === leftDist) {
                            ball.x = obstacle.x - BALL_RADIUS;
                            ball.vx = -ball.vx * 0.7;
                        } else if (minDist === rightDist) {
                            ball.x = obstacle.x + obstacle.width + BALL_RADIUS;
                            ball.vx = -ball.vx * 0.7;
                        } else if (minDist === topDist) {
                            ball.y = obstacle.y - BALL_RADIUS;
                            ball.vy = -ball.vy * 0.7;
                        } else if (minDist === bottomDist) {
                            ball.y = obstacle.y + obstacle.height + BALL_RADIUS;
                            ball.vy = -ball.vy * 0.7;
                        }
                    }
                }
            }
        }
        
        // Check if ball reached the hole
        const dx = ball.x - currentCourse.hole.x;
        const dy = ball.y - currentCourse.hole.y;
        const distanceToHole = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceToHole < HOLE_RADIUS - 3 && Math.abs(ball.vx) < 1 && Math.abs(ball.vy) < 1) {
            ball.isInHole = true;
            ballMoving = false;
            holeCompleted = true;
            
            // Update score for current player
            playerScores[currentPlayer][currentHole - 1] += 1; // Add final putt
            playerTotalScores[currentPlayer] += playerScores[currentPlayer][currentHole - 1];
            
            // Show next hole or end game
            setTimeout(() => {
                if (currentHole < 9) {
                    // Switch player
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    updatePlayerUI();
                    
                    // Load next hole
                    loadHole(currentHole + 1);
                } else if (currentPlayer === 1) {
                    // First player finished all holes, switch to player 2
                    currentPlayer = 2;
                    currentHole = 1;
                    updatePlayerUI();
                    loadHole(1);
                } else {
                    // Both players finished, show scoreboard
                    showScoreboard();
                }
            }, 1000);
        }
        
        // Check if ball stopped moving
        if (Math.abs(ball.vx) < MIN_SPEED && Math.abs(ball.vy) < MIN_SPEED) {
            ball.vx = 0;
            ball.vy = 0;
            ballMoving = false;
        }
    }
    
    // Update power meter if active
    if (powerMeter.active) {
        const dx = touchStartPos.x - touchEndPos.x;
        const dy = touchStartPos.y - touchEndPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
                powerMeter.power = Math.min(distance / 10, MAX_POWER);
        
        // Update power meter UI
        const powerPercentage = (powerMeter.power / MAX_POWER) * 100;
        document.getElementById('power-fill').style.width = powerPercentage + '%';
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
    // Draw course
    drawCourse();
    
    // Draw ball
    if (!ball.isInHole) {
        ctx.fillStyle = currentPlayer === 1 ? '#ff4757' : '#1e90ff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw aim line when player is aiming
        if (powerMeter.active) {
            const dx = touchStartPos.x - touchEndPos.x;
            const dy = touchStartPos.y - touchEndPos.y;
            const distance = Math.min(Math.sqrt(dx * dx + dy * dy), MAX_POWER * 10);
            const angle = Math.atan2(dy, dx);
            
            // Draw dotted aim line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(
                ball.x + Math.cos(angle) * distance,
                ball.y + Math.sin(angle) * distance
            );
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw power indicator
            const powerText = Math.round(powerMeter.power / MAX_POWER * 100) + '%';
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                powerText,
                ball.x + Math.cos(angle) * (distance + 20),
                ball.y + Math.sin(angle) * (distance + 20)
            );
        }
    }
}

// Draw the course elements
function drawCourse() {
    // Draw grass background
    ctx.fillStyle = '#86c174';
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    
    // Draw sand traps
    ctx.fillStyle = '#e6c34a';
    for (const trap of currentCourse.sandTraps) {
        ctx.fillRect(trap.x, trap.y, trap.width, trap.height);
    }
    
    // Draw hole
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(currentCourse.hole.x, currentCourse.hole.y, HOLE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw flag
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(currentCourse.hole.x, currentCourse.hole.y - 30, 2, 30);
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(currentCourse.hole.x + 2, currentCourse.hole.y - 30);
    ctx.lineTo(currentCourse.hole.x + 12, currentCourse.hole.y - 25);
    ctx.lineTo(currentCourse.hole.x + 2, currentCourse.hole.y - 20);
    ctx.fill();
    
    // Draw walls
    ctx.fillStyle = '#5a3825';
    for (const wall of currentCourse.walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }
    
    // Draw obstacles
    ctx.fillStyle = '#4d4d4d';
    for (const obstacle of currentCourse.obstacles) {
        if (obstacle.radius) {
            ctx.beginPath();
            ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (obstacle.width && obstacle.height) {
            // For rectangular obstacles (like windmill parts)
            if (obstacle.isRotating) {
                // Save context state for rotation
                ctx.save();
                ctx.translate(obstacle.x, obstacle.y);
                
                // Rotate obstacle based on time
                const now = Date.now() / 1000;
                const rotationAngle = (now % (Math.PI * 2)) * 0.5;
                ctx.rotate(rotationAngle);
                
                // Draw the rotating rectangle
                ctx.fillRect(-obstacle.width / 2, -obstacle.height / 2, obstacle.width, obstacle.height);
                
                // Restore context
                ctx.restore();
            } else {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        }
    }
}

// Handle touch events
function handleTouchStart(e) {
    e.preventDefault();
    
    // Don't allow new shots if ball is moving or hole is completed
    if (ballMoving || holeCompleted) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    
    // Check if touch is near the ball
    const dx = touchX - ball.x;
    const dy = touchY - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < BALL_RADIUS * 3) {
        powerMeter.active = true;
        touchStartPos = { x: ball.x, y: ball.y };
        touchEndPos = { x: touchX, y: touchY };
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (powerMeter.active) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchEndPos = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    
    if (powerMeter.active) {
        powerMeter.active = false;
        document.getElementById('power-fill').style.width = '0%';
        
        // Calculate velocity based on drag direction and power
        const dx = touchStartPos.x - touchEndPos.x;
        const dy = touchStartPos.y - touchEndPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const power = Math.min(distance / 10, MAX_POWER);
            const angle = Math.atan2(dy, dx);
            
            ball.vx = Math.cos(angle) * power;
            ball.vy = Math.sin(angle) * power;
            ballMoving = true;
            
            // Increment shot count
            playerScores[currentPlayer][currentHole - 1]++;
            updatePlayerUI();
        }
    }
}

// Update player UI display
function updatePlayerUI() {
    // Update active player indicator
    document.getElementById('player1').classList.toggle('active', currentPlayer === 1);
    document.getElementById('player2').classList.toggle('active', currentPlayer === 2);
    
    // Update scores
    document.querySelector('#player1 .player-score').textContent = playerTotalScores[1];
    document.querySelector('#player2 .player-score').textContent = playerTotalScores[2];
}

// Show final scoreboard
function showScoreboard() {
    const scoreboardEl = document.getElementById('scoreboard');
    const scoreBodyEl = document.getElementById('score-body');
    
    // Clear previous scores
    scoreBodyEl.innerHTML = '';
    
    // Calculate totals
    const player1Total = playerScores[1].reduce((a, b) => a + b, 0);
    const player2Total = playerScores[2].reduce((a, b) => a + b, 0);
    
    // Update winner display
    const winnerDisplay = document.getElementById('winner-display');
    if (player1Total < player2Total) {
        winnerDisplay.textContent = 'Player 1 wins!';
        winnerDisplay.style.color = '#ff4757';
    } else if (player2Total < player1Total) {
        winnerDisplay.textContent = 'Player 2 wins!';
        winnerDisplay.style.color = '#1e90ff';
    } else {
        winnerDisplay.textContent = "It's a tie!";
        winnerDisplay.style.color = '#4CAF50';
    }
    
    // Populate score table
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        
        const holeCell = document.createElement('td');
        holeCell.textContent = i + 1;
        row.appendChild(holeCell);
        
        const player1Cell = document.createElement('td');
        player1Cell.textContent = playerScores[1][i];
        
        // Highlight scores relative to par
        const par = PAR_VALUES[i];
        if (playerScores[1][i] < par) {
            player1Cell.style.color = '#4CAF50'; // Under par (green)
        } else if (playerScores[1][i] > par) {
            player1Cell.style.color = '#FF5722'; // Over par (red)
        }
        
        row.appendChild(player1Cell);
        
        const player2Cell = document.createElement('td');
        player2Cell.textContent = playerScores[2][i];
        
        // Highlight scores relative to par
        if (playerScores[2][i] < par) {
            player2Cell.style.color = '#4CAF50'; // Under par (green)
        } else if (playerScores[2][i] > par) {
            player2Cell.style.color = '#FF5722'; // Over par (red)
        }
        
        row.appendChild(player2Cell);
        
        scoreBodyEl.appendChild(row);
    }
    
    // Update totals
    document.getElementById('player1-total').textContent = player1Total;
    document.getElementById('player2-total').textContent = player2Total;
    
    // Show scoreboard
    scoreboardEl.classList.remove('hidden');
}

// Restart the game
function restartGame() {
    // Reset scores
    playerScores = {
        1: Array(9).fill(0),
        2: Array(9).fill(0)
    };
    playerTotalScores = { 1: 0, 2: 0 };
    
    // Reset game state
    currentPlayer = 1;
    currentHole = 1;
    holeCompleted = false;
    
    // Hide scoreboard
    document.getElementById('scoreboard').classList.add('hidden');
    
    // Update UI
    updatePlayerUI();
    
    // Load first hole
    loadHole(1);
}

// Initialize game when page loads
window.addEventListener('load', init);
