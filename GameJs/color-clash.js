document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameContainer = document.querySelector('.game-container');
    const gameSetup = document.getElementById('game-setup');
    const gameBoard = document.getElementById('game-board');
    const gameGrid = document.querySelector('.game-grid');
    const timeDisplay = document.getElementById('time');
    const currentPlayerNameDisplay = document.getElementById('current-player-name');
    const player1ScoreDisplay = document.querySelector('#player1-score .score-value');
    const player2ScoreDisplay = document.querySelector('#player2-score .score-value');
    const player1ScoreFill = document.querySelector('#player1-score .score-fill');
    const player2ScoreFill = document.querySelector('#player2-score .score-fill');
    
    // Game state variables
    let gridSize = 7;
    let gameMode = 'classic';
    let currentPlayer = 1;
    let player1Color = '#e94560';
    let player2Color = '#4ecca3';
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Score = 0;
    let player2Score = 0;
    let totalCells = 0;
    let grid = [];
    let cellColors = [];
    let timer;
    let seconds = 0;
    let minutes = 0;
    let isPaused = false;
    let soundEnabled = true;
    let gameOver = false;
    let moveCount = 0;
    
    // Sounds
    const sounds = {
        select: new Audio('../sounds/select.mp3'),
        capture: new Audio('../sounds/capture.mp3'),
        turn: new Audio('../sounds/turn.mp3'),
        win: new Audio('../sounds/win.mp3'),
        click: new Audio('../sounds/click.mp3')
    };
    
    // Initialize the game
    function init() {
        // Initially hide the game board
        gameBoard.style.display = 'none';
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup tutorial
        setupTutorial();
        
        // Setup pause menu
        setupPauseMenu();
        
        // Setup keyboard controls
        setupKeyboardControls();
    }
    
    // Play sound function
    function playSound(sound) {
        if (soundEnabled && sounds[sound]) {
            try {
                // Create a clone to allow overlapping sounds
                const soundClone = sounds[sound].cloneNode();
                soundClone.volume = 0.5; // Lower volume
                soundClone.play().catch(e => console.log('Sound play error:', e));
            } catch (error) {
                console.log('Sound error:', error);
            }
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                gameMode = btn.dataset.mode;
                playSound('click');
            });
        });
        
        // Grid size selection
        document.querySelectorAll('.grid-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.grid-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                gridSize = parseInt(btn.dataset.size);
                playSound('click');
            });
        });
        
        // Color selection for players
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const playerInput = e.target.closest('.player-input');
                const colorOptions = playerInput.querySelectorAll('.color-option');
                
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                const playerIndex = parseInt(playerInput.dataset.player);
                const color = getComputedStyle(option).backgroundColor;
                
                if (playerIndex === 0) {
                    player1Color = color;
                    playerInput.querySelector('.player-avatar').style.backgroundColor = color;
                } else if (playerIndex === 1) {
                    player2Color = color;
                    playerInput.querySelector('.player-avatar').style.backgroundColor = color;
                }
                
                playSound('click');
            });
        });
        
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            // Get player names
            player1Name = document.getElementById('player1-name').value || 'Player 1';
            player2Name = document.getElementById('player2-name').value || 'Player 2';
            
            // Update player name in the game board
            document.querySelector('#player1-score .player-name').textContent = player1Name;
            document.querySelector('#player2-score .player-name').textContent = player2Name;
            currentPlayerNameDisplay.textContent = player1Name;
            currentPlayerNameDisplay.style.color = player1Color;
            
            // Update score fill colors
            document.querySelector('#player1-score .score-fill').style.backgroundColor = player1Color;
            document.querySelector('#player2-score .score-fill').style.backgroundColor = player2Color;
            
            // Hide setup, show game board
            gameSetup.style.display = 'none';
            gameBoard.style.display = 'block';
            
            // Start the game
            startGame();
            
            playSound('click');
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            restartGame();
            playSound('click');
        });
        
        // New game button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            // Return to setup screen
            gameBoard.style.display = 'none';
            gameSetup.style.display = 'block';
            stopTimer();
            resetGameState();
            playSound('click');
        });
        
        // Sound button
        document.getElementById('sound-btn').addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            const soundBtn = document.getElementById('sound-btn');
            soundBtn.innerHTML = soundEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
            
            if (soundEnabled) {
                playSound('click');
            }
        });
        
        // Pause button
        document.getElementById('pause-btn').addEventListener('click', () => {
            togglePause();
            playSound('click');
        });
        
        // Game over modal buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            document.querySelector('.game-over-modal').style.display = 'none';
            restartGame();
            playSound('click');
        });
        
        document.getElementById('return-home-btn').addEventListener('click', () => {
            document.querySelector('.game-over-modal').style.display = 'none';
            gameBoard.style.display = 'none';
            gameSetup.style.display = 'block';
            stopTimer();
            resetGameState();
            playSound('click');
        });
        
        document.getElementById('share-score-btn').addEventListener('click', () => {
            shareScore();
            playSound('click');
        });
    }
    
    // Start the game
    function startGame() {
        // Reset game state
        resetGameState();
        
        // Create the grid
        createGrid();
        
        // Set initial positions
        setInitialPositions();
        
        // Update scores
        updateScores();
        
        // Start timer
        startTimer();
    }
    
    // Reset game state
    function resetGameState() {
        currentPlayer = 1;
        player1Score = 0;
        player2Score = 0;
        grid = [];
        cellColors = [];
        seconds = 0;
        minutes = 0;
        isPaused = false;
        gameOver = false;
        moveCount = 0;
        
        // Reset displays
        timeDisplay.textContent = '00:00';
        currentPlayerNameDisplay.textContent = player1Name;
        currentPlayerNameDisplay.style.color = player1Color;
    }
    
    // Create the game grid
    function createGrid() {
        // Clear existing grid
        gameGrid.innerHTML = '';
        
        // Set grid template columns based on grid size
        gameGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        // Create grid cells
        totalCells = gridSize * gridSize;
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        cellColors = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
        
        // Generate a set of colors for the grid
        const colors = generateColors(6);
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Randomly assign a color from the palette
                const randomColorIndex = Math.floor(Math.random() * colors.length);
                const cellColor = colors[randomColorIndex];
                cell.style.backgroundColor = cellColor;
                cellColors[row][col] = cellColor;
                
                // Add event listener
                cell.addEventListener('click', handleCellClick);
                
                gameGrid.appendChild(cell);
            }
        }
    }
    
    // Generate a set of distinct colors
    function generateColors(count) {
        const baseColors = [
            '#e94560', // Red
            '#4ecca3', // Green
            '#ffbd69', // Yellow
            '#6a67ce', // Purple
            '#3fc1c9', // Cyan
            '#fc5185', // Pink
            '#f0a500', // Orange
            '#00b8a9', // Teal
            '#8785a2', // Lavender
            '#7579e7'  // Blue
        ];
        
        // Ensure we don't use player colors in the grid
        const availableColors = baseColors.filter(color => 
            color !== player1Color && color !== player2Color
        );
        
        // If we need more colors than available, generate random ones
        if (count > availableColors.length) {
            const additionalColors = [];
            for (let i = 0; i < count - availableColors.length; i++) {
                const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                additionalColors.push(randomColor);
            }
            return [...availableColors, ...additionalColors];
        }
        
        // Otherwise, return a subset of available colors
        return availableColors.slice(0, count);
    }
    
    // Set initial positions
    function setInitialPositions() {
        // Player 1 starts at top-left
        const topLeft = document.querySelector(`.grid-cell[data-row="0"][data-col="0"]`);
        topLeft.classList.add('player1');
        topLeft.style.backgroundColor = player1Color;
        grid[0][0] = 1;
        player1Score = 1;
        
        // Player 2 starts at bottom-right
        const bottomRight = document.querySelector(`.grid-cell[data-row="${gridSize-1}"][data-col="${gridSize-1}"]`);
        bottomRight.classList.add('player2');
        bottomRight.style.backgroundColor = player2Color;
        grid[gridSize-1][gridSize-1] = 2;
        player2Score = 1;
    }
    
    // Handle cell click
    function handleCellClick(e) {
        // Ignore clicks if game is paused or over
        if (isPaused || gameOver) return;
        
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        // Check if the cell is already claimed
        if (grid[row][col] !== 0) {
            return;
        }
        
        // Check if the move is valid (adjacent to player's territory)
        if (!isValidMove(row, col)) {
            // Provide visual feedback for invalid move
            e.target.classList.add('invalid-move');
            setTimeout(() => {
                e.target.classList.remove('invalid-move');
            }, 300);
            return;
        }
        
        // Claim the cell
        claimCell(row, col);
        moveCount++;
        
        // Check for game over
        if (checkGameOver()) {
            gameOver = true;
            stopTimer();
            showGameOverModal();
            return;
        }
        
        // Switch player
        switchPlayer();
    }
    
    // Check if move is valid (adjacent to player's territory)
    function isValidMove(row, col) {
        // Check adjacent cells (up, right, down, left)
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            // Check if within grid bounds
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                // Check if adjacent cell belongs to current player
                if (grid[newRow][newCol] === currentPlayer) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Claim cell and expand territory
    function claimCell(row, col) {
        // Get the cell
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        
        // Mark the cell as claimed by current player
        grid[row][col] = currentPlayer;
        
        // Update cell appearance
        cell.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
        cell.style.backgroundColor = currentPlayer === 1 ? player1Color : player2Color;
        cell.classList.add('pulse');
        
        // Remove pulse animation after it completes
        setTimeout(() => {
            cell.classList.remove('pulse');
        }, 500);
        
        // Play capture sound
        playSound('capture');
        
        // Update score
        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
        
        // Find and claim all matching adjacent cells with the same color
        const targetColor = cellColors[row][col];
        expandTerritory(targetColor);
        
        // Update scores display
        updateScores();
    }
    
    // Expand territory by claiming all matching adjacent cells
    function expandTerritory(targetColor) {
        let cellsClaimed = true;
        
        // Keep expanding until no more cells can be claimed
        while (cellsClaimed) {
            cellsClaimed = false;
            
            // Create a copy of the grid to check against
            const gridCopy = JSON.parse(JSON.stringify(grid));
            
                        // Check all cells
                        for (let row = 0; row < gridSize; row++) {
                            for (let col = 0; col < gridSize; col++) {
                                // Skip cells that are already claimed
                                if (gridCopy[row][col] !== 0) continue;
                                
                                // Check if cell color matches target color
                                if (cellColors[row][col] === targetColor) {
                                    // Check if adjacent to current player's territory
                                    if (isAdjacentToPlayer(row, col, gridCopy)) {
                                        // Claim the cell
                                        grid[row][col] = currentPlayer;
                                        
                                        // Get the cell element and update its appearance
                                        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                                        cell.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
                                        cell.style.backgroundColor = currentPlayer === 1 ? player1Color : player2Color;
                                        
                                        // Add a delayed animation for chain reaction effect
                                        setTimeout(() => {
                                            cell.classList.add('chain-capture');
                                            setTimeout(() => {
                                                cell.classList.remove('chain-capture');
                                            }, 300);
                                        }, 100 * Math.random() * 5); // Random delay for natural effect
                                        
                                        // Update score
                                        if (currentPlayer === 1) {
                                            player1Score++;
                                        } else {
                                            player2Score++;
                                        }
                                        
                                        cellsClaimed = true;
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Check if cell is adjacent to current player's territory
                function isAdjacentToPlayer(row, col, gridCopy) {
                    // Check adjacent cells (up, right, down, left)
                    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
                    
                    for (const [dx, dy] of directions) {
                        const newRow = row + dx;
                        const newCol = col + dy;
                        
                        // Check if within grid bounds
                        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                            // Check if adjacent cell belongs to current player
                            if (gridCopy[newRow][newCol] === currentPlayer) {
                                return true;
                            }
                        }
                    }
                    
                    return false;
                }
                
                // Switch player
                function switchPlayer() {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    
                    // Update current player display
                    currentPlayerNameDisplay.textContent = currentPlayer === 1 ? player1Name : player2Name;
                    currentPlayerNameDisplay.style.color = currentPlayer === 1 ? player1Color : player2Color;
                    
                    // Play turn sound
                    playSound('turn');
                    
                    // Highlight current player's territory
                    highlightCurrentPlayerTerritory();
                }
                
                // Highlight current player's territory
                function highlightCurrentPlayerTerritory() {
                    // Remove previous highlights
                    document.querySelectorAll('.grid-cell').forEach(cell => {
                        cell.classList.remove('current-player-cell');
                    });
                    
                    // Add highlight to current player's cells
                    document.querySelectorAll(`.grid-cell.player${currentPlayer}`).forEach(cell => {
                        cell.classList.add('current-player-cell');
                    });
                }
                
                // Update scores display
                function updateScores() {
                    player1ScoreDisplay.textContent = player1Score;
                    player2ScoreDisplay.textContent = player2Score;
                    
                    // Update score bars
                    const player1Percentage = (player1Score / totalCells) * 100;
                    const player2Percentage = (player2Score / totalCells) * 100;
                    
                    player1ScoreFill.style.width = `${player1Percentage}%`;
                    player2ScoreFill.style.width = `${player2Percentage}%`;
                    
                    // Add animation to score changes
                    player1ScoreDisplay.classList.add('score-change');
                    player2ScoreDisplay.classList.add('score-change');
                    
                    setTimeout(() => {
                        player1ScoreDisplay.classList.remove('score-change');
                        player2ScoreDisplay.classList.remove('score-change');
                    }, 300);
                }
                
                // Check if game is over
                function checkGameOver() {
                    // Game is over when all cells are claimed
                    return player1Score + player2Score >= totalCells;
                }
                
                // Show game over modal
                function showGameOverModal() {
                    const gameOverModal = document.querySelector('.game-over-modal');
                    const winnerNameElement = document.getElementById('winner-name');
                    const winnerScoreElement = document.getElementById('winner-score');
                    const winnerPercentageElement = document.getElementById('winner-percentage');
                    const player1FinalName = document.querySelector('#player1-final .player-name');
                    const player1FinalScore = document.querySelector('#player1-final .score-value');
                    const player2FinalName = document.querySelector('#player2-final .player-name');
                    const player2FinalScore = document.querySelector('#player2-final .score-value');
                    const timeElement = document.getElementById('winner-time');
                    const movesElement = document.getElementById('winner-moves');
                    
                    // Determine winner
                    let winner, winnerScore, winnerPercentage;
                    
                    if (player1Score > player2Score) {
                        winner = player1Name;
                        winnerScore = player1Score;
                        winnerPercentage = Math.round((player1Score / totalCells) * 100);
                        document.querySelector('.winner-avatar').style.backgroundColor = player1Color;
                    } else if (player2Score > player1Score) {
                        winner = player2Name;
                        winnerScore = player2Score;
                        winnerPercentage = Math.round((player2Score / totalCells) * 100);
                        document.querySelector('.winner-avatar').style.backgroundColor = player2Color;
                    } else {
                        winner = "It's a tie!";
                        winnerScore = player1Score;
                        winnerPercentage = Math.round((player1Score / totalCells) * 100);
                        document.querySelector('.winner-avatar').style.backgroundColor = '#ffbd69';
                    }
                    
                    // Update winner information
                    winnerNameElement.textContent = winner;
                    winnerScoreElement.textContent = winnerScore;
                    winnerPercentageElement.textContent = `${winnerPercentage}%`;
                    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    movesElement.textContent = moveCount;
                    
                    // Update final scoreboard
                    player1FinalName.textContent = player1Name;
                    player1FinalScore.textContent = player1Score;
                    player2FinalName.textContent = player2Name;
                    player2FinalScore.textContent = player2Score;
                    
                    // Style the winner in the final scoreboard
                    if (player1Score > player2Score) {
                        document.getElementById('player1-final').style.color = player1Color;
                        document.getElementById('player2-final').style.color = '#e6e6e6';
                    } else if (player2Score > player1Score) {
                        document.getElementById('player1-final').style.color = '#e6e6e6';
                        document.getElementById('player2-final').style.color = player2Color;
                    } else {
                        document.getElementById('player1-final').style.color = '#ffbd69';
                        document.getElementById('player2-final').style.color = '#ffbd69';
                    }
                    
                    // Check for achievements
                    checkAchievements();
                    
                    // Play win sound
                    playSound('win');
                    
                    // Show the modal
                    gameOverModal.style.display = 'flex';
                }
                
                // Check for achievements
                function checkAchievements() {
                    const achievementContainer = document.querySelector('.achievement-unlocked');
                    if (!achievementContainer) return;
                    
                    let achievement = null;
                    
                    // Domination (>75% of the board)
                    const winnerScore = Math.max(player1Score, player2Score);
                    const winnerPercentage = (winnerScore / totalCells) * 100;
                    
                    if (winnerPercentage > 75) {
                        achievement = {
                            name: "Domination",
                            description: "Claimed more than 75% of the board!",
                            icon: "fa-crown"
                        };
                    }
                    // Quick victory (under 1 minute)
                    else if (minutes === 0 && seconds < 60) {
                        achievement = {
                            name: "Speed Demon",
                            description: "Won the game in under a minute!",
                            icon: "fa-bolt"
                        };
                    }
                    // Comeback (was behind by 10+ cells at some point)
                    else if (localStorage.getItem('wasLosingBadly') === 'true') {
                        achievement = {
                            name: "Epic Comeback",
                            description: "Won after being behind by 10+ cells!",
                            icon: "fa-arrow-up"
                        };
                        localStorage.removeItem('wasLosingBadly');
                    }
                    // First victory
                    else if (!localStorage.getItem('hasWonColorClash')) {
                        achievement = {
                            name: "First Victory",
                            description: "Won your first Color Clash game!",
                            icon: "fa-award"
                        };
                        localStorage.setItem('hasWonColorClash', 'true');
                    }
                    
                    if (achievement) {
                        document.getElementById('achievement-title').textContent = achievement.name;
                        document.getElementById('achievement-description').textContent = achievement.description;
                        document.querySelector('.achievement-icon i').className = `fas ${achievement.icon}`;
                        achievementContainer.style.display = 'flex';
                    } else {
                        achievementContainer.style.display = 'none';
                    }
                }
                
                // Share score
                function shareScore() {
                    const winner = player1Score > player2Score ? player1Name : (player2Score > player1Score ? player2Name : "It's a tie");
                    const text = `I just played Color Clash! ${winner} won with a score of ${Math.max(player1Score, player2Score)} cells (${Math.round((Math.max(player1Score, player2Score) / totalCells) * 100)}% of the grid)! Can you beat this score? #PixelHeavenGames`;
                    
                    if (navigator.share) {
                        navigator.share({
                            title: 'My Color Clash Score',
                            text: text,
                            url: window.location.href
                        }).catch(err => {
                            console.error('Share failed:', err);
                            fallbackShare(text);
                        });
                    } else {
                        fallbackShare(text);
                    }
                }
                
                // Fallback share method
                function fallbackShare(text) {
                    // Create a temporary input
                    const input = document.createElement('textarea');
                    input.value = text;
                    document.body.appendChild(input);
                    
                    // Select and copy
                    input.select();
                    document.execCommand('copy');
                    
                    // Remove the input
                    document.body.removeChild(input);
                    
                    // Alert the user
                    alert('Score copied to clipboard! Share it with your friends.');
                }
                
                // Start the timer
                function startTimer() {
                    if (timer) clearInterval(timer);
                    
                    timer = setInterval(() => {
                        if (!isPaused) {
                            seconds++;
                            if (seconds === 60) {
                                minutes++;
                                seconds = 0;
                            }
                            
                            // Format time display
                            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                            
                            // Check for comeback achievement tracking
                            const scoreDifference = Math.abs(player1Score - player2Score);
                            if (scoreDifference > 10) {
                                if ((player1Score > player2Score && currentPlayer === 2) ||
                                    (player2Score > player1Score && currentPlayer === 1)) {
                                    localStorage.setItem('wasLosingBadly', 'true');
                                }
                            }
                        }
                    }, 1000);
                }
                
                // Stop the timer
                function stopTimer() {
                    clearInterval(timer);
                    timer = null;
                }
                
                // Toggle pause
                function togglePause() {
                    isPaused = !isPaused;
                    
                    const pauseMenu = document.querySelector('.pause-menu');
                    if (pauseMenu) {
                        pauseMenu.style.display = isPaused ? 'flex' : 'none';
                    }
                    
                    // Add blur effect to game board when paused
                    if (isPaused) {
                        gameGrid.classList.add('paused');
                    } else {
                        gameGrid.classList.remove('paused');
                    }
                }
                
                // Restart game
                function restartGame() {
                    stopTimer();
                    resetGameState();
                    createGrid();
                    setInitialPositions();
                    updateScores();
                    startTimer();
                    
                    // Highlight current player's territory
                    highlightCurrentPlayerTerritory();
                    
                    // Hide game over modal if it's open
                    const gameOverModal = document.querySelector('.game-over-modal');
                    if (gameOverModal) {
                        gameOverModal.style.display = "none";
                    }
                    
                    // Hide pause menu if it's open
                    const pauseMenu = document.querySelector('.pause-menu');
                    if (pauseMenu) {
                        pauseMenu.style.display = "none";
                        isPaused = false;
                    }
                    
                    // Remove blur effect
                    gameGrid.classList.remove('paused');
                }
                
                // Setup pause menu
                function setupPauseMenu() {
                    const pauseMenu = document.querySelector('.pause-menu');
                    const resumeBtn = document.getElementById('resume-btn');
                    const restartPausedBtn = document.getElementById('restart-paused-btn');
                    const exitBtn = document.getElementById('exit-btn');
                    const soundToggle = document.getElementById('sound-toggle');
                    const musicToggle = document.getElementById('music-toggle');
                    
                    resumeBtn.addEventListener('click', () => {
                        isPaused = false;
                        pauseMenu.style.display = 'none';
                        gameGrid.classList.remove('paused');
                        playSound('click');
                    });
                    
                    restartPausedBtn.addEventListener('click', () => {
                        pauseMenu.style.display = 'none';
                        restartGame();
                        playSound('click');
                    });
                    
                    exitBtn.addEventListener('click', () => {
                        pauseMenu.style.display = 'none';
                        gameBoard.style.display = 'none';
                        gameSetup.style.display = 'block';
                        stopTimer();
                        resetGameState();
                        playSound('click');
                    });
                    
                    soundToggle.addEventListener('change', (e) => {
                        soundEnabled = e.target.checked;
                        if (soundEnabled) {
                            playSound('click');
                        }
                    });
                    
                    musicToggle.addEventListener('change', (e) => {
                        // Music functionality would go here
                    });
                }
                
                // Setup tutorial
                function setupTutorial() {
                    const tutorialOverlay = document.getElementById('tutorial-overlay');
                    const prevStepBtn = document.getElementById('prev-step');
                    const nextStepBtn = document.getElementById('next-step');
                    const skipTutorialBtn = document.getElementById('skip-tutorial');
                    const tutorialSteps = document.querySelectorAll('.tutorial-step');
                    const tutorialDots = document.querySelectorAll('.tutorial-dot');
                    let currentStep = 0;
                    
                    // Show tutorial on first visit
                    if (!localStorage.getItem('colorClashTutorialShown')) {
                        tutorialOverlay.style.display = 'flex';
                        localStorage.setItem('colorClashTutorialShown', 'true');
                    }
                    
                    function updateTutorial() {
                        tutorialSteps.forEach((step, index) => {
                            step.classList.toggle('active', index === currentStep);
                        });
                        
                        tutorialDots.forEach((dot, index) => {
                            dot.classList.toggle('active', index === currentStep);
                        });
                        
                        prevStepBtn.disabled = currentStep === 0;
                        nextStepBtn.textContent = currentStep === tutorialSteps.length - 1 ? 'Start Game' : 'Next';
                    }
                    
                    prevStepBtn.addEventListener('click', () => {
                        if (currentStep > 0) {
                            currentStep--;
                            updateTutorial();
                            playSound('click');
                        }
                    });
                    
                    nextStepBtn.addEventListener('click', () => {
                        if (currentStep < tutorialSteps.length - 1) {
                            currentStep++;
                            updateTutorial();
                            playSound('click');
                        } else {
                            tutorialOverlay.style.display = 'none';
                            playSound('click');
                        }
                    });
                    
                    skipTutorialBtn.addEventListener('click', () => {
                        tutorialOverlay.style.display = 'none';
                        playSound('click');
                    });
                    
                    // Allow clicking on dots to navigate
                    tutorialDots.forEach((dot, index) => {
                        dot.addEventListener('click', () => {
                            currentStep = index;
                            updateTutorial();
                            playSound('click');
                        });
                    });
                }
                
                // Setup keyboard controls
                function setupKeyboardControls() {
                    document.addEventListener('keydown', (e) => {
                        // Escape key to pause/resume
                        if (e.key === 'Escape') {
                            togglePause();
                        }
                        
                        // R key to restart
                        if (e.key === 'r' || e.key === 'R') {
                            restartGame();
                        }
                        
                        // M key to toggle sound
                        if (e.key === 'm' || e.key === 'M') {
                            soundEnabled = !soundEnabled;
                            const soundBtn = document.getElementById('sound-btn');
                            if (soundBtn) {
                                soundBtn.innerHTML = soundEnabled ? 
                                    '<i class="fas fa-volume-up"></i>' : 
                                    '<i class="fas fa-volume-mute"></i>';
                            }
                            
                            if (soundEnabled) {
                                playSound('click');
                            }
                        }
                        
                        // Arrow keys for navigation (in timed mode)
                        if (gameMode === 'timed' && !isPaused && !gameOver) {
                            let row = -1, col = -1;
                            
                            // Find current position
                            for (let r = 0; r < gridSize; r++) {
                                for (let c = 0; c < gridSize; c++) {
                                    if (grid[r][c] === currentPlayer) {
                                        // Just find one cell to use as reference
                                        row = r;
                                        col = c;
                                        break;
                                    }
                                }
                                if (row !== -1) break;
                            }
                            
                            if (row !== -1) {
                                let targetRow = row, targetCol = col;
                                
                                // Determine direction
                                if (e.key === 'ArrowUp') targetRow = Math.max(0, row - 1);
                                else if (e.key === 'ArrowDown') targetRow = Math.min(gridSize - 1, row + 1);
                                else if (e.key === 'ArrowLeft') targetCol = Math.max(0, col - 1);
                                else if (e.key === 'ArrowRight') targetCol = Math.min(gridSize - 1, col + 1);
                                else return;
                                
                                // If target cell is unclaimed and valid, click it
                                if (grid[targetRow][targetCol] === 0 && isValidMove(targetRow, targetCol)) {
                                    const targetCell = document.querySelector(`.grid-cell[data-row="${targetRow}"][data-col="${targetCol}"]`);
                                    targetCell.click();
                                }
                            }
                        }
                    });
                }
                
                // Add floating action button for mobile
                function addFloatingActionButton() {
                    const fab = document.createElement('div');
                    fab.classList.add('floating-action-button');
                    fab.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
                    
                    document.body.appendChild(fab);
                    
                    fab.addEventListener('click', () => {
                        // Create and show mobile menu
                        let mobileMenu = document.querySelector('.mobile-menu');
                        
                        if (!mobileMenu) {
                            mobileMenu = document.createElement('div');
                            mobileMenu.classList.add('mobile-menu');
                            
                            mobileMenu.innerHTML = `
                                <div class="mobile-menu-content">
                                    <button id="mobile-restart" class="mobile-menu-btn">
                                        <i class="fas fa-redo"></i> Restart
                                    </button>
                                    <button id="mobile-pause" class="mobile-menu-btn">
                                        <i class="fas fa-pause"></i> Pause
                                    </button>
                                    <button id="mobile-sound" class="mobile-menu-btn">
                                        <i class="fas fa-volume-up"></i> Sound
                                    </button>
                                    <button id="mobile-home" class="mobile-menu-btn">
                                        <i class="fas fa-home"></i> Home
                                    </button>
                                </div>
                            `;
                            
                            document.body.appendChild(mobileMenu);
                            
                            // Add event listeners
                            document.getElementById('mobile-restart').addEventListener('click', () => {
                                restartGame();
                                mobileMenu.style.display = 'none';
                                playSound('click');
                            });
                            
                            document.getElementById('mobile-pause').addEventListener('click', () => {
                                togglePause();
                                mobileMenu.style.display = 'none';
                                playSound('click');
                            });
                            
                            document.getElementById('mobile-sound').addEventListener('click', () => {
                                soundEnabled = !soundEnabled;
                                const soundBtn = document.getElementById('mobile-sound');
                                if (soundBtn) {
                                    soundBtn.innerHTML = soundEnabled ? 
                                        '<i class="fas fa-volume-up"></i> Sound' : 
                                        '<i class="fas fa-volume-mute"></i> Sound';
                                }
                                
                                if (soundEnabled) {
                                    playSound('click');
                                }
                            });
                            
                            document.getElementById('mobile-home').addEventListener('click', () => {
                                gameBoard.style.display = 'none';
                                gameSetup.style.display = 'block';
                                stopTimer();
                                resetGameState();
                                mobileMenu.style.display = 'none';
                                playSound('click');
                            });
                        }
                        
                        // Toggle menu display
                        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
                        
                        // Update sound icon
                        const soundBtn = document.getElementById('mobile-sound');
                        if (soundBtn) {
                            soundBtn.innerHTML = soundEnabled ? 
                                '<i class="fas fa-volume-up"></i> Sound' : 
                                '<i class="fas fa-volume-mute"></i> Sound';
                        }
                        
                        playSound('click');
                    });
                }
                
                // Add custom styles for improved visual feedback
                function addCustomStyles() {
                    const styleElement = document.createElement('style');
                    styleElement.textContent = `
                        /* Pulse animation for cell capture */
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.1); }
                            100% { transform: scale(1); }
                        }
                        
                        .grid-cell.pulse {
                            animation: pulse 0.3s ease-in-out;
                            z-index: 10;
                        }
                        
                        /* Chain capture animation */
                        @keyframes chainCapture {
                            0% { transform: scale(1); opacity: 0.7; }
                            50% { transform: scale(1.05); opacity: 1; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        
                        .grid-cell.chain-capture {
                            animation: chainCapture 0.3s ease-in-out;
                        }
                        
                        /* Current player territory highlight */
                        .grid-cell.current-player-cell {
                            box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
                        }
                        
                        /* Invalid move feedback */
                        @keyframes invalidMove {
                            0% { transform: scale(1); }
                            25% { transform: scale(0.95); }
                            50% { transform: scale(1); }
                            75% { transform: scale(0.95); }
                            100% { transform: scale(1); }
                        }
                        
                        .grid-cell.invalid-move {
                            animation: invalidMove 0.4s ease-in-out;
                            box-shadow: inset 0 0 0 3px rgba(255, 0, 0, 0.5);
                        }
                        
                        /* Score change animation */
                        @keyframes scoreChange {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.2); color: #ffbd69; }
                            100% { transform: scale(1); }
                        }
                        
                        .score-value.score-change {
                            animation: scoreChange 0.3s ease-in-out;
                        }
                        
                        /* Paused game blur effect */
                        .game-grid.paused {
                            filter: blur(3px);
                            pointer-events: none;
                        }
                        
                        /* Improve mobile responsiveness */
                        @media (max-width: 480px) {
                            .grid-cell {
                                min-height: 35px;
                            }
                        }
                    `;
                    
                    document.head.appendChild(styleElement);
                }
                
                // Initialize the game
                function init() {
                    // Add custom styles
                    addCustomStyles();
                    
                    // Setup event listeners
                    setupEventListeners();
                    
                    // Setup tutorial
                    setupTutorial();
                    
                    // Setup pause menu
                    setupPauseMenu();
                    
                    // Setup keyboard controls
                    setupKeyboardControls();
                    
                    // Add floating action button for mobile
                    addFloatingActionButton();
                }
                
                // Initialize the game
                init();
            });
            
