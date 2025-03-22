document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameContainer = document.querySelector('.game-container');
    const memoryGame = document.querySelector('.memory-game');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const currentPlayerDisplay = document.getElementById('current-player-name');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const startGameBtn = document.getElementById('start-game');
    const playAgainBtn = document.getElementById('play-again-btn');
    const returnHomeBtn = document.getElementById('return-home-btn');
    const addPlayerBtn = document.getElementById('add-player');
    const removePlayerBtn = document.getElementById('remove-player');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const playerSetup = document.querySelector('.player-setup');
    const gameBoard = document.querySelector('.game-board');
    const gameOverModal = document.querySelector('.game-over-modal');
    const scoreboard = document.querySelector('.scoreboard-entries');
    const finalScoreboard = document.querySelector('.final-scoreboard');
    const winnerNameDisplay = document.getElementById('winner-name');
    const winnerTimeDisplay = document.getElementById('winner-time');
    const winnerMovesDisplay = document.getElementById('winner-moves');
    
    // Game state
    let gameMode = 'single';
    let difficulty = 'easy';
    let players = [
        { id: 1, name: 'Player 1', color: '#e94560', pairs: 0, moves: 0 }
    ];
    let currentPlayerIndex = 0;
    let moves = 0;
    let matchedPairs = 0;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timer;
    let seconds = 0;
    let minutes = 0;
    let gameStarted = false;
    let aiMemory = new Map(); // For AI opponent
    let aiDifficulty = 0.7; // AI memory reliability (0-1)
    
    // Emoji arrays for different difficulty levels
    const emojiSets = {
        easy: ['🚀', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎧'],
        medium: ['🚀', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎧', '🎸', '🎹', '🎺', '🎻'],
        hard: ['🚀', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎧', '🎸', '🎹', '🎺', '🎻', '🎬', '🎤', '🎩', '🎫']
    };
    
    let emojis = emojiSets.easy;
    
    // Initialize game setup
    function initGameSetup() {
        // Set up event listeners for game mode selection
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                gameMode = button.dataset.mode;
                
                // Show/hide player setup based on mode
                if (gameMode === 'multiplayer') {
                    playerSetup.style.display = 'block';
                    // Reset to 2 players for multiplayer
                    resetPlayers(2);
                    updatePlayerInputs();
                } else if (gameMode === 'ai') {
                    playerSetup.style.display = 'none';
                    // Set up player vs AI
                    players = [
                        { id: 1, name: 'Player 1', color: '#e94560', pairs: 0, moves: 0 },
                        { id: 2, name: 'AI Opponent', color: '#9333ea', pairs: 0, moves: 0 }
                    ];
                } else {
                    playerSetup.style.display = 'none';
                    // Reset to single player
                    resetPlayers(1);
                }
            });
        });
        
        // Set up event listeners for difficulty selection
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                difficulty = button.dataset.difficulty;
                emojis = emojiSets[difficulty];
                
                // Adjust AI difficulty based on game difficulty
                if (difficulty === 'easy') {
                    aiDifficulty = 0.5;
                } else if (difficulty === 'medium') {
                    aiDifficulty = 0.7;
                } else {
                    aiDifficulty = 0.9;
                }
            });
        });
        
        // Add player button
        addPlayerBtn.addEventListener('click', () => {
            if (players.length < 4) {
                const newPlayerId = players.length + 1;
                players.push({
                    id: newPlayerId,
                    name: `Player ${newPlayerId}`,
                    color: getDefaultColorForPlayer(newPlayerId),
                    pairs: 0,
                    moves: 0
                });
                
                updatePlayerInputs();
                
                // Enable remove button if we have more than 2 players
                if (players.length > 2) {
                    removePlayerBtn.disabled = false;
                }
                
                // Disable add button if we reached 4 players
                if (players.length === 4) {
                    addPlayerBtn.disabled = true;
                }
            }
        });
        
        // Remove player button
        removePlayerBtn.addEventListener('click', () => {
            if (players.length > 2) {
                players.pop();
                updatePlayerInputs();
                
                // Disable remove button if we have only 2 players
                if (players.length === 2) {
                    removePlayerBtn.disabled = true;
                }
                
                // Enable add button if we have less than 4 players
                if (players.length < 4) {
                    addPlayerBtn.disabled = false;
                }
            }
        });
        
        // Color picker functionality
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', function() {
                const playerIndex = parseInt(this.closest('.player-input').querySelector('input').id.replace('player', '')) - 1;
                const color = this.dataset.color;
                
                // Remove selected class from all options in this color picker
                this.closest('.color-picker').querySelectorAll('.color-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                this.classList.add('selected');
                
                // Update player color
                players[playerIndex].color = color;
            });
        });
        
        // Player name input functionality
        document.querySelectorAll('.player-input input').forEach(input => {
            input.addEventListener('change', function() {
                const playerIndex = parseInt(this.id.replace('player', '')) - 1;
                players[playerIndex].name = this.value || `Player ${playerIndex + 1}`;
            });
        });
        
        // Start game button
        startGameBtn.addEventListener('click', startGame);
        
        // Restart game button
        restartBtn.addEventListener('click', restartGame);
        
        // New game button
        newGameBtn.addEventListener('click', newGame);
        
        // Play again button
        playAgainBtn.addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            restartGame();
        });
        
        // Return home button
        returnHomeBtn.addEventListener('click', () => {
            gameOverModal.style.display = 'none';
            newGame();
        });
    }
    
    // Update player input fields based on current players
    function updatePlayerInputs() {
        const playerInputs = document.querySelectorAll('.player-input');
        
        // Hide all player inputs first
        playerInputs.forEach(input => {
            input.style.display = 'none';
        });
        
        // Show and update inputs for current players
        players.forEach((player, index) => {
            const input = playerInputs[index];
            input.style.display = 'flex';
            
            const nameInput = input.querySelector('input');
            nameInput.value = player.name;
            
            // Update color selection
            const colorOptions = input.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.classList.remove('selected');
                if (option.dataset.color === player.color) {
                    option.classList.add('selected');
                }
            });
        });
    }
    
    // Reset players array to specified count
    function resetPlayers(count) {
        players = [];
        for (let i = 0; i < count; i++) {
            players.push({
                id: i + 1,
                name: `Player ${i + 1}`,
                color: getDefaultColorForPlayer(i + 1),
                pairs: 0,
                moves: 0
            });
        }
        
        // Update UI buttons
        if (count < 4) {
            addPlayerBtn.disabled = false;
        } else {
            addPlayerBtn.disabled = true;
        }
        
        if (count > 2) {
            removePlayerBtn.disabled = false;
        } else {
            removePlayerBtn.disabled = true;
        }
    }
    
    // Get default color for player based on player number
    function getDefaultColorForPlayer(playerNumber) {
        switch (playerNumber) {
            case 1: return '#e94560';
            case 2: return '#4e8cff';
            case 3: return '#4ade80';
            case 4: return '#facc15';
            default: return '#e94560';
        }
    }
    
    // Start the game
    function startGame() {
        // Hide setup, show game board
        startGameBtn.style.display = 'none';
        playerSetup.style.display = 'none';
        gameBoard.style.display = 'block';
        
        // Reset game state
        currentPlayerIndex = 0;
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        minutes = 0;
        gameStarted = true;
        aiMemory.clear();
        
        // Update UI
        updateCurrentPlayerDisplay();
        updateScoreboard();
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '00:00';
        
        // Start timer
        startTimer();
        
        // Create cards
        createCards();
    }
    
    // Create the cards
    function createCards() {
        memoryGame.innerHTML = '';
        
        // Double the emojis to create pairs
        const cardEmojis = [...emojis, ...emojis];
        
        // Shuffle the array
        cardEmojis.sort(() => Math.random() - 0.5);
        
        // Create HTML for each card
        cardEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.textContent = emoji;
            
            const backFace = document.createElement('div');
            backFace.classList.add('back-face');
            
            card.appendChild(frontFace);
            card.appendChild(backFace);
            
            card.addEventListener('click', flipCard);
            
            memoryGame.appendChild(card);
        });
        
        // Add current player class to memory game
        updateGameBoardPlayerClass();
    }
    
    // Start the timer
    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            
            // Format time display
            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    // Stop the timer
    function stopTimer() {
        clearInterval(timer);
    }
    
    // Flip card function
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        // If it's AI's turn, don't allow player to flip
        if (gameMode === 'ai' && currentPlayerIndex === 1) return;
        
        this.classList.add('flip');
        
        // Add card to AI memory with some randomness
        if (Math.random() < aiDifficulty) {
            aiMemory.set(this.dataset.index, this.dataset.emoji);
        }
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        
        // Increment moves for current player
        players[currentPlayerIndex].moves++;
        moves++;
        movesDisplay.textContent = moves;
        
        checkForMatch();
    }
    
    // Check if cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            // Add match animation
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            // Increment pairs for current player
            players[currentPlayerIndex].pairs++;
            matchedPairs++;
            
            disableCards();
            updateScoreboard();
            
            // Check if all pairs are matched
            if (matchedPairs === emojis.length) {
                endGame();
            }
        } else {
            unflipCards();
            // Switch to next player
            nextPlayer();
        }
    }
    
    // Switch to next player
    function nextPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateCurrentPlayerDisplay();
        updateGameBoardPlayerClass();
        
        // If it's AI's turn, make AI move
        if (gameMode === 'ai' && currentPlayerIndex === 1) {
            setTimeout(makeAIMove, 1000);
        }
    }
    
    // Make AI move
    function makeAIMove() {
        if (!gameStarted) return;
        
        const cards = document.querySelectorAll('.memory-card:not(.flip)');
        if (cards.length === 0) return;
        
        // Try to find a match from memory
        let foundMatch = false;
        let firstCardIndex = null;
        let secondCardIndex = null;
        
        // Create a map of emojis to card indices
        const emojiToCardIndices = new Map();
        aiMemory.forEach((emoji, index) => {
            if (!emojiToCardIndices.has(emoji)) {
                emojiToCardIndices.set(emoji, []);
            }
            emojiToCardIndices.get(emoji).push(index);
        });
        
                // Find pairs in memory
                emojiToCardIndices.forEach((indices, emoji) => {
                    if (indices.length >= 2 && !foundMatch) {
                        // Find two cards that aren't already flipped
                        const availableIndices = indices.filter(idx => 
                            !document.querySelector(`.memory-card[data-index="${idx}"]`).classList.contains('flip')
                        );
                        
                        if (availableIndices.length >= 2) {
                            firstCardIndex = availableIndices[0];
                            secondCardIndex = availableIndices[1];
                            foundMatch = true;
                        }
                    }
                });
                
                // If no match found in memory, pick random cards
                if (!foundMatch) {
                    // First card: random selection
                    const availableCards = Array.from(cards);
                    const randomIndex = Math.floor(Math.random() * availableCards.length);
                    const firstCardElement = availableCards[randomIndex];
                    firstCardIndex = firstCardElement.dataset.index;
                    
                    // Try to find a match for the first card
                    const matchingCardIndex = aiMemory.has(firstCardIndex) ? 
                        Array.from(aiMemory.entries())
                            .find(([idx, emoji]) => 
                                emoji === aiMemory.get(firstCardIndex) && 
                                idx !== firstCardIndex &&
                                !document.querySelector(`.memory-card[data-index="${idx}"]`).classList.contains('flip')
                            )?.[0] : null;
                    
                    if (matchingCardIndex) {
                        secondCardIndex = matchingCardIndex;
                    } else {
                        // Second card: another random selection (excluding first card)
                        const remainingCards = availableCards.filter(card => card !== firstCardElement);
                        if (remainingCards.length > 0) {
                            const secondRandomIndex = Math.floor(Math.random() * remainingCards.length);
                            secondCardIndex = remainingCards[secondRandomIndex].dataset.index;
                        }
                    }
                }
                
                // Flip the selected cards
                if (firstCardIndex !== null && secondCardIndex !== null) {
                    const firstCardElement = document.querySelector(`.memory-card[data-index="${firstCardIndex}"]`);
                    const secondCardElement = document.querySelector(`.memory-card[data-index="${secondCardIndex}"]`);
                    
                    if (firstCardElement && secondCardElement) {
                        // Flip first card
                        setTimeout(() => {
                            firstCardElement.classList.add('flip');
                            firstCard = firstCardElement;
                            hasFlippedCard = true;
                            
                            // Flip second card after a delay
                            setTimeout(() => {
                                secondCardElement.classList.add('flip');
                                secondCard = secondCardElement;
                                
                                // Increment moves for AI
                                players[currentPlayerIndex].moves++;
                                moves++;
                                movesDisplay.textContent = moves;
                                
                                // Check for match
                                checkForMatch();
                            }, 600);
                        }, 500);
                    }
                }
            }
            
            // Update current player display
            function updateCurrentPlayerDisplay() {
                const currentPlayer = players[currentPlayerIndex];
                currentPlayerDisplay.textContent = currentPlayer.name;
                currentPlayerDisplay.style.color = currentPlayer.color;
                
                // Update the current player indicator dot color
                document.querySelector('.current-player').style.setProperty('--player-color', currentPlayer.color);
            }
            
            // Update game board player class for styling
            function updateGameBoardPlayerClass() {
                // Remove all player turn classes
                memoryGame.classList.remove('player-1-turn', 'player-2-turn', 'player-3-turn', 'player-4-turn', 'ai-turn');
                
                // Add appropriate class
                if (gameMode === 'ai' && currentPlayerIndex === 1) {
                    memoryGame.classList.add('ai-turn');
                } else {
                    memoryGame.classList.add(`player-${currentPlayerIndex + 1}-turn`);
                }
            }
            
            // Update scoreboard
            function updateScoreboard() {
                scoreboard.innerHTML = '';
                
                players.forEach(player => {
                    const entry = document.createElement('div');
                    entry.classList.add('scoreboard-entry');
                    
                    if (gameMode === 'ai' && player.id === 2) {
                        entry.classList.add('ai');
                    } else {
                        entry.classList.add(`player-${player.id}`);
                    }
                    
                    entry.innerHTML = `
                        <div class="player-name">${player.name}</div>
                        <div class="player-score">
                            <div class="player-pairs"><i class="fas fa-layer-group"></i> ${player.pairs}</div>
                            <div class="player-moves"><i class="fas fa-arrows-alt"></i> ${player.moves}</div>
                        </div>
                    `;
                    
                    scoreboard.appendChild(entry);
                });
            }
            
            // Disable matched cards
            function disableCards() {
                firstCard.removeEventListener('click', flipCard);
                secondCard.removeEventListener('click', flipCard);
                
                resetBoard();
            }
            
            // Unflip non-matching cards
            function unflipCards() {
                lockBoard = true;
                
                setTimeout(() => {
                    firstCard.classList.remove('flip');
                    secondCard.classList.remove('flip');
                    
                    resetBoard();
                }, 1000);
            }
            
            // Reset board after each turn
            function resetBoard() {
                [hasFlippedCard, lockBoard] = [false, false];
                [firstCard, secondCard] = [null, null];
            }
            
            // End game
            function endGame() {
                stopTimer();
                gameStarted = false;
                
                // Find winner (player with most pairs)
                const winner = [...players].sort((a, b) => {
                    if (b.pairs === a.pairs) {
                        return a.moves - b.moves; // If tied on pairs, fewer moves wins
                    }
                    return b.pairs - a.pairs;
                })[0];
                
                // Update winner display
                winnerNameDisplay.textContent = winner.name;
                winnerTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                winnerMovesDisplay.textContent = winner.moves;
                
                // Create final scoreboard
                finalScoreboard.innerHTML = '<h4>Final Scores</h4>';
                
                const sortedPlayers = [...players].sort((a, b) => b.pairs - a.pairs);
                
                sortedPlayers.forEach((player, index) => {
                    const entry = document.createElement('div');
                    entry.classList.add('scoreboard-entry');
                    
                    if (gameMode === 'ai' && player.id === 2) {
                        entry.classList.add('ai');
                    } else {
                        entry.classList.add(`player-${player.id}`);
                    }
                    
                    entry.innerHTML = `
                        <div class="player-name">${index + 1}. ${player.name}</div>
                        <div class="player-score">
                            <div class="player-pairs"><i class="fas fa-layer-group"></i> ${player.pairs}</div>
                            <div class="player-moves"><i class="fas fa-arrows-alt"></i> ${player.moves}</div>
                        </div>
                    `;
                    
                    finalScoreboard.appendChild(entry);
                });
                
                // Show game over modal
                setTimeout(() => {
                    gameOverModal.style.display = 'flex';
                }, 1000);
            }
            
            // Restart game
            function restartGame() {
                // Reset game state
                players.forEach(player => {
                    player.pairs = 0;
                    player.moves = 0;
                });
                
                currentPlayerIndex = 0;
                moves = 0;
                matchedPairs = 0;
                seconds = 0;
                minutes = 0;
                gameStarted = true;
                aiMemory.clear();
                
                // Update UI
                updateCurrentPlayerDisplay();
                updateScoreboard();
                movesDisplay.textContent = '0';
                timeDisplay.textContent = '00:00';
                
                // Restart timer
                stopTimer();
                startTimer();
                
                // Recreate cards
                createCards();
            }
            
            // New game (return to setup)
            function newGame() {
                // Hide game board, show setup
                gameBoard.style.display = 'none';
                startGameBtn.style.display = 'block';
                
                // Reset game state
                stopTimer();
                gameStarted = false;
                
                // Reset mode and difficulty selections
                modeButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.mode === 'single') {
                        btn.classList.add('active');
                    }
                });
                
                difficultyButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.difficulty === 'easy') {
                        btn.classList.add('active');
                    }
                });
                
                // Reset to default settings
                gameMode = 'single';
                difficulty = 'easy';
                emojis = emojiSets.easy;
                resetPlayers(1);
                playerSetup.style.display = 'none';
            }
            
            // Initialize the game
            initGameSetup();
        });
