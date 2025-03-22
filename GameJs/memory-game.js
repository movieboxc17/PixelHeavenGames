document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const gameContainer = document.querySelector('.game-container');
    const memoryGame = document.querySelector('.memory-game');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const restartBtn = document.getElementById('restart-btn');
    const gameSetup = document.getElementById('game-setup');
    const gameBoard = document.getElementById('game-board');
    
    // Initially hide the game board
    gameBoard.style.display = 'none';
    
    // Game state variables
    let moves = 0;
    let matchedPairs = 0;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let timer;
    let seconds = 0;
    let minutes = 0;
    let isPaused = false;
    let soundEnabled = true;
    let difficulty = 'medium'; // easy, medium, hard
    
    // Emoji array for card faces based on themes
    const cardThemes = {
        emoji: ['🚀', '🎮', '🎯', '🎲', '🎪', '🎭', '🎨', '🎧'],
        animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
        food: ['🍎', '🍕', '🍔', '🍦', '🍩', '🍓', '🍌', '🥑'],
        space: ['🌎', '🌙', '⭐', '🚀', '🛸', '☄️', '🌠', '🪐']
    };
    
    // Current theme
    let currentTheme = 'emoji';
    
    // Sounds
    const sounds = {
        flip: new Audio('./sounds/flip.mp3'),
        match: new Audio('./sounds/match.mp3'),
        noMatch: new Audio('./sounds/no-match.mp3'),
        win: new Audio('./sounds/win.mp3'),
        click: new Audio('./sounds/click.mp3')
    };
    
    // Improved sound handling
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
    
    // Start game button event listener
    document.getElementById('start-game').addEventListener('click', () => {
        gameSetup.style.display = 'none';
        gameBoard.style.display = 'block';
        
        // Get selected options
        difficulty = document.querySelector('.difficulty-btn.active').dataset.difficulty;
        currentTheme = document.querySelector('.theme-btn.active').dataset.theme;
        
        // Initialize the game
        restartGame();
    });
    
    // Create the cards
    function createCards() {
        // Get theme cards
        const themeCards = cardThemes[currentTheme] || cardThemes.emoji;
        
        // Get card style
        const cardStyle = document.querySelector('.card-style-btn.active')?.dataset.style || 'classic';
        
        // Determine number of pairs based on difficulty
        let numPairs;
        switch (difficulty) {
            case 'easy':
                numPairs = 6;
                memoryGame.style.gridTemplateColumns = 'repeat(3, 1fr)';
                break;
            case 'medium':
                numPairs = 8;
                memoryGame.style.gridTemplateColumns = 'repeat(4, 1fr)';
                break;
            case 'hard':
                numPairs = 12;
                memoryGame.style.gridTemplateColumns = 'repeat(4, 1fr)';
                break;
            default:
                numPairs = 8;
                memoryGame.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
        
        // Get subset of cards if needed
        const selectedCards = themeCards.slice(0, numPairs);
        
        // Double the cards to create pairs
        const cardPairs = [...selectedCards, ...selectedCards];
        
        // Shuffle the array
        cardPairs.sort(() => Math.random() - 0.5);
        
        // Clear existing cards
        memoryGame.innerHTML = '';
        
        // Create HTML for each card
        cardPairs.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.emoji = emoji;
            card.dataset.theme = currentTheme;
            card.dataset.style = cardStyle;
            
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
    }
    
    // Show hint
    function showHint() {
        // Only show hint if no cards are flipped
        if (hasFlippedCard || lockBoard) return;
        
        const unflippedCards = [...document.querySelectorAll('.memory-card:not(.flip)')];
        if (unflippedCards.length === 0) return;
        
        // Find a matching pair
        let foundPair = false;
        const cardValues = {};
        
        unflippedCards.forEach(card => {
            const value = card.dataset.emoji;
            if (cardValues[value]) {
                cardValues[value].push(card);
                foundPair = true;
            } else {
                cardValues[value] = [card];
            }
        });
        
        // Show hint animation on a pair
        if (foundPair) {
            const pairToHint = Object.values(cardValues).find(cards => cards.length === 2);
            
            if (pairToHint) {
                pairToHint.forEach(card => {
                    card.classList.add('hint');
                    setTimeout(() => {
                        card.classList.remove('hint');
                    }, 1500);
                });
            }
        }
    }
    
    // Flip card function
    function flipCard() {
        if (lockBoard || isPaused) return;
        if (this === firstCard) return;
        
        playSound('flip');
        
        // Start timer on first card flip
        if (moves === 0 && !timer) {
            startTimer();
        }
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        moves++;
        movesDisplay.textContent = moves;
        
        checkForMatch();
    }
    
    // Check if cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            playSound('match');
            disableCards();
            matchedPairs++;
            
            // Add matched animation
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            setTimeout(() => {
                firstCard.classList.remove('matched');
                secondCard.classList.remove('matched');
            }, 1000);
            
            // Check if all pairs are matched
            const totalPairs = document.querySelectorAll('.memory-card').length / 2;
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    stopTimer();
                    showGameOverModal();
                }, 500);
            }
        } else {
            playSound('noMatch');
            unflipCards();
        }
    }
    
    // Show game over modal
    function showGameOverModal() {
        playSound('win');
        
        const gameOverModal = document.querySelector('.game-over-modal');
        const winnerNameElement = document.getElementById('winner-name');
        const winnerTimeElement = document.getElementById('winner-time');
        const winnerPairsElement = document.getElementById('winner-pairs');
        
        // Update winner information
        winnerNameElement.textContent = 'You Win!';
        winnerTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        winnerPairsElement.textContent = matchedPairs;
        
        // Check for achievements
        checkAchievements();
        
        // Show the modal
        gameOverModal.style.display = 'flex';
    }
    
    // Check for achievements
    function checkAchievements() {
        const achievementContainer = document.querySelector('.achievement-unlocked');
        if (!achievementContainer) return;
        
        let achievement = null;
        
        // Perfect game (no misses)
        const totalPairs = document.querySelectorAll('.memory-card').length / 2;
        if (moves === totalPairs) {
            achievement = {
                name: "Perfect Memory",
                description: "Completed the game without any mismatches!",
                icon: "fa-trophy"
            };
        }
        // Speed demon (under 30 seconds)
        else if (minutes === 0 && seconds < 30) {
            achievement = {
                name: "Speed Demon",
                description: "Completed the game in under 30 seconds!",
                icon: "fa-bolt"
            };
        }
        // First victory
        else if (!localStorage.getItem('hasWonGame')) {
            achievement = {
                name: "First Victory",
                description: "Completed your first memory game!",
                icon: "fa-award"
            };
            localStorage.setItem('hasWonGame', 'true');
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
        const text = `I just completed Memory Game in ${minutes}:${seconds.toString().padStart(2, '0')} with ${moves} moves! Can you beat my score? #PixelHeavenGames`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Memory Game Score',
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
    
    // Restart game
    function restartGame() {
        stopTimer();
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        minutes = 0;
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '00:00';
        timer = null;
        
        resetBoard();
        createCards();
        
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
    }
    
    // Add setup event listeners
    function setupGameOptions() {
        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show/hide relevant sections based on mode
                const mode = btn.dataset.mode;
                const playerSetup = document.querySelector('.player-setup');
                const aiSettings = document.querySelector('.ai-settings');
                
                if (mode === 'multiplayer') {
                    playerSetup.style.display = 'block';
                    aiSettings.style.display = 'none';
                } else if (mode === 'ai') {
                    playerSetup.style.display = 'none';
                    aiSettings.style.display = 'block';
                } else {
                    playerSetup.style.display = 'none';
                    aiSettings.style.display = 'none';
                }
            });
        });
        
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Theme selection
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Card style selection
        document.querySelectorAll('.card-style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.card-style-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Player management
        document.getElementById('add-player').addEventListener('click', () => {
            const hiddenPlayers = document.querySelectorAll('.player-input[style="display: none;"]');
            if (hiddenPlayers.length > 0) {
                hiddenPlayers[0].style.display = 'flex';
                document.getElementById('remove-player').disabled = false;
                
                if (hiddenPlayers.length === 1) {
                    document.getElementById('add-player').disabled = true;
                }
            }
        });
        
        document.getElementById('remove-player').addEventListener('click', () => {
            const visiblePlayers = document.querySelectorAll('.player-input:not([style="display: none;"])');
            if (visiblePlayers.length > 1) {
                visiblePlayers[visiblePlayers.length - 1].style.display = 'none';
                document.getElementById('add-player').disabled = false;
                
                if (visiblePlayers.length === 2) {
                    document.getElementById('remove-player').disabled = true;
                }
            }
        });
        
        // Color picker
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const playerInput = e.target.closest('.player-input');
                const colorOptions = playerInput.querySelectorAll('.color-option');
                
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                playerInput.dataset.color = option.dataset.color;
            });
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
        if (!localStorage.getItem('tutorialShown')) {
            tutorialOverlay.style.display = 'flex';
            localStorage.setItem('tutorialShown', 'true');
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
            }
        });
        
        nextStepBtn.addEventListener('click', () => {
            if (currentStep < tutorialSteps.length - 1) {
                currentStep++;
                updateTutorial();
            } else {
                tutorialOverlay.style.display = 'none';
            }
        });
        
        skipTutorialBtn.addEventListener('click', () => {
            tutorialOverlay.style.display = 'none';
        });
        
        // Allow clicking on dots to navigate
        tutorialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentStep = index;
                updateTutorial();
            });
        });
    }
    
    // Setup pause menu
    function setupPauseMenu() {
        const pauseMenu = document.querySelector('.pause-menu');
        const pauseBtn = document.getElementById('pause-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const restartPausedBtn = document.getElementById('restart-paused-btn');
        const exitBtn = document.getElementById('exit-btn');
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        const vibrationToggle = document.getElementById('vibration-toggle');
        
        pauseBtn.addEventListener('click', () => {
            isPaused = true;
            pauseMenu.style.display = 'flex';
        });
        
        resumeBtn.addEventListener('click', () => {
            isPaused = false;
            pauseMenu.style.display = 'none';
        });
        
        restartPausedBtn.addEventListener('click', () => {
            pauseMenu.style.display = 'none';
            restartGame();
        });
        
        exitBtn.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        soundToggle.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
        });
        
        musicToggle.addEventListener('change', (e) => {
            // Music functionality would go here
        });
        
        vibrationToggle.addEventListener('change', (e) => {
            // Vibration functionality would go here
        });
    }
    
    // Add keyboard controls
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
            
            // H key for hint
            if (e.key === 'h' || e.key === 'H') {
                showHint();
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
            }
        });
    }
    
    // Add swipe controls for mobile
    function setupSwipeControls() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            // Calculate horizontal and vertical distance
            const horizontalDist = touchEndX - touchStartX;
            const verticalDist = touchEndY - touchStartY;
            
            // Only register swipe if it's significant
            if (Math.abs(horizontalDist) > 100 || Math.abs(verticalDist) > 100) {
                // Determine if it's horizontal or vertical swipe
                if (Math.abs(horizontalDist) > Math.abs(verticalDist)) {
                    // Horizontal swipe
                    if (horizontalDist > 0) {
                        // Right swipe - restart game
                        restartGame();
                    } else {
                        // Left swipe - go back to home
                        window.location.href = '../index.html';
                    }
                } else {
                    // Vertical swipe
                    if (verticalDist > 0) {
                        // Down swipe - toggle pause
                        togglePause();
                    } else {
                        // Up swipe - show hint
                        showHint();
                    }
                }
            }
        }
    }
    
    // Add custom context menu
    function setupContextMenu() {
        gameContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Create custom context menu
            let contextMenu = document.querySelector('.custom-context-menu');
            
            if (!contextMenu) {
                contextMenu = document.createElement('div');
                contextMenu.classList.add('custom-context-menu');
                
                contextMenu.innerHTML = `
                    <ul>
                        <li id="context-restart"><i class="fas fa-redo"></i> Restart Game</li>
                        <li id="context-pause"><i class="fas fa-pause"></i> Pause Game</li>
                        <li id="context-hint"><i class="fas fa-lightbulb"></i> Show Hint</li>
                        <li id="context-sound"><i class="fas fa-volume-up"></i> Toggle Sound</li>
                        <li id="context-home"><i class="fas fa-home"></i> Return to Home</li>
                    </ul>
                `;
                
                document.body.appendChild(contextMenu);
                
                // Add event listeners
                document.getElementById('context-restart').addEventListener('click', () => {
                    restartGame();
                    hideContextMenu();
                });
                
                document.getElementById('context-pause').addEventListener('click', () => {
                    togglePause();
                    hideContextMenu();
                });
                
                document.getElementById('context-hint').addEventListener('click', () => {
                    showHint();
                    hideContextMenu();
                });
                
                document.getElementById('context-sound').addEventListener('click', () => {
                    soundEnabled = !soundEnabled;
                    hideContextMenu();
                });
                
                document.getElementById('context-home').addEventListener('click', () => {
                    window.location.href = '../index.html';
                });
            }
            
            // Position the menu
            contextMenu.style.top = `${e.pageY}px`;
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.display = 'block';
            
            // Update sound icon
            const soundItem = document.getElementById('context-sound');
            if (soundItem) {
                soundItem.innerHTML = soundEnabled ? 
                    '<i class="fas fa-volume-up"></i> Toggle Sound' : 
                    '<i class="fas fa-volume-mute"></i> Toggle Sound';
            }
            
            // Hide context menu when clicking elsewhere
            document.addEventListener('click', hideContextMenu);
            
            function hideContextMenu() {
                contextMenu.style.display = 'none';
                document.removeEventListener('click', hideContextMenu);
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
                        <button id="mobile-hint" class="mobile-menu-btn">
                            <i class="fas fa-lightbulb"></i> Hint
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
                });
                
                document.getElementById('mobile-pause').addEventListener('click', () => {
                    togglePause();
                    mobileMenu.style.display = 'none';
                });
                
                document.getElementById('mobile-hint').addEventListener('click', () => {
                    showHint();
                    mobileMenu.style.display = 'none';
                });
                
                document.getElementById('mobile-sound').addEventListener('click', () => {
                    soundEnabled = !soundEnabled;
                    const soundBtn = document.getElementById('mobile-sound');
                    if (soundBtn) {
                        soundBtn.innerHTML = soundEnabled ? 
                            '<i class="fas fa-volume-up"></i> Sound' : 
                            '<i class="fas fa-volume-mute"></i> Sound';
                    }
                });
                
                document.getElementById('mobile-home').addEventListener('click', () => {
                    window.location.href = '../index.html';
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
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Event listener for restart button
        if (restartBtn) {
            restartBtn.addEventListener('click', restartGame);
        }
        
        // Event listener for new game button
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                window.location.href = '../index.html';
            });
        }
        
        // Event listener for hint button
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', showHint);
        }
        
                // Event listener for sound button
                const soundBtn = document.getElementById('sound-btn');
                if (soundBtn) {
                    soundBtn.addEventListener('click', () => {
                        soundEnabled = !soundEnabled;
                        soundBtn.innerHTML = soundEnabled ? 
                            '<i class="fas fa-volume-up"></i>' : 
                            '<i class="fas fa-volume-mute"></i>';
                    });
                }
                
                // Event listener for pause button
                const pauseBtn = document.getElementById('pause-btn');
                if (pauseBtn) {
                    pauseBtn.addEventListener('click', togglePause);
                }
                
                // Event listeners for game over modal buttons
                document.getElementById('play-again-btn')?.addEventListener('click', () => {
                    document.querySelector('.game-over-modal').style.display = 'none';
                    restartGame();
                });
                
                document.getElementById('return-home-btn')?.addEventListener('click', () => {
                    window.location.href = '../index.html';
                });
                
                document.getElementById('share-score-btn')?.addEventListener('click', shareScore);
            }
            
            // Add custom styles
            function addCustomStyles() {
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    /* Fix for card flipping in Safari */
                    .memory-card {
                        -webkit-transform-style: preserve-3d;
                        transform-style: preserve-3d;
                        -webkit-transition: transform 0.5s;
                        transition: transform 0.5s;
                    }
                    
                    /* Fix for backface visibility in Safari */
                    .front-face, .back-face {
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                    }
                    
                    /* Fix for transform in Safari */
                    .memory-card.flip {
                        -webkit-transform: rotateY(180deg);
                        transform: rotateY(180deg);
                    }
                    
                    /* Custom context menu */
                    .custom-context-menu {
                        display: none;
                        position: absolute;
                        background-color: #1a1a2e;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                        z-index: 1000;
                        overflow: hidden;
                    }
                    
                    .custom-context-menu ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    
                    .custom-context-menu li {
                        padding: 10px 15px;
                        cursor: pointer;
                        color: #e6e6e6;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                    }
                    
                    .custom-context-menu li:hover {
                        background-color: #e94560;
                        color: #16213e;
                    }
                    
                    .custom-context-menu li i {
                        margin-right: 10px;
                        width: 20px;
                        text-align: center;
                    }
                    
                    /* Floating action button */
                    .floating-action-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 50px;
                        height: 50px;
                        background-color: #e94560;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #16213e;
                        font-size: 1.5rem;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        cursor: pointer;
                        z-index: 900;
                        transition: all 0.3s ease;
                    }
                    
                    .floating-action-button:hover {
                        transform: scale(1.1);
                    }
                    
                    /* Mobile menu */
                    .mobile-menu {
                        display: none;
                        position: fixed;
                        bottom: 80px;
                        right: 20px;
                        background-color: #1a1a2e;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        z-index: 899;
                        overflow: hidden;
                    }
                    
                    .mobile-menu-content {
                        display: flex;
                        flex-direction: column;
                        padding: 10px;
                    }
                    
                    .mobile-menu-btn {
                        background-color: transparent;
                        color: #e6e6e6;
                        border: none;
                        padding: 10px 15px;
                        text-align: left;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        transition: all 0.2s ease;
                        border-radius: 5px;
                    }
                    
                    .mobile-menu-btn:hover {
                        background-color: #16213e;
                    }
                    
                    .mobile-menu-btn i {
                        margin-right: 10px;
                        width: 20px;
                        text-align: center;
                        color: #e94560;
                    }
                    
                    /* Improve mobile responsiveness */
                    @media (max-width: 480px) {
                        .memory-game {
                            grid-template-columns: repeat(2, 1fr) !important;
                            gap: 10px;
                        }
                        
                        .memory-card {
                            height: 100px;
                        }
                        
                        .front-face, .back-face {
                            font-size: 2rem;
                        }
                    }
                `;
                
                document.head.appendChild(styleElement);
            }
            
            // Initialize game
            function init() {
                // Setup event listeners
                setupEventListeners();
                
                // Setup game options
                setupGameOptions();
                
                // Setup tutorial
                setupTutorial();
                
                // Setup pause menu
                setupPauseMenu();
                
                // Setup keyboard controls
                setupKeyboardControls();
                
                // Setup swipe controls for mobile
                setupSwipeControls();
                
                // Setup context menu
                setupContextMenu();
                
                // Add floating action button for mobile
                addFloatingActionButton();
                
                // Add custom styles
                addCustomStyles();
            }
            
            // Initialize the game
            init();
        });        
