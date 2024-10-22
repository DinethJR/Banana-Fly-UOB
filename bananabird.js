// Canvas and context setup
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird variables
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let velocityY = 0; // Bird's vertical velocity
let gravity = 0.4;
let bird = { x: birdX, y: birdY, width: birdWidth, height: birdHeight };

// Pipe variables
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let velocityX = -2; // Pipe speed

// Game status variables
let gameOver = false;
let score = 0;
let playerName = "";

// Load images
let birdImg = new Image();
birdImg.src = "./flappybird.png"; // Ensure you have the correct bird image path

let topPipeImg = new Image();
topPipeImg.src = "./toppipe.png"; // Ensure you have the correct top pipe image

let bottomPipeImg = new Image();
bottomPipeImg.src = "./bottompipe.png"; // Ensure you have the correct bottom pipe image

// Load event to start game when clicking "Start"
window.onload = function () {
    document.getElementById("startButton").addEventListener("click", startGame);
};

// Start the game when "Start" button is clicked
function startGame() {
    playerName = document.getElementById("playerName").value || "Player";
    document.getElementById("loginPage").style.display = "none"; // Hide login page
    document.getElementById("gamePage").style.display = "block"; // Show game page

    // Initialize game board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Start the game loop
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // Generate pipes every 1.5 seconds
    document.addEventListener("keydown", moveBird); // Bird movement listener
}

// Game loop: updating the bird, pipes, and game state
function update() {
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height); // Clear the canvas

    // Bird physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Apply gravity, prevent bird from going above the canvas

    drawBird();

    if (bird.y > board.height) {
        gameOver = true; // Game over if the bird falls out of the canvas
    }

    // Pipe logic and drawing
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX; // Move pipe to the left
        drawPipe(pipe);

        // Update score when the bird passes the pipe
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Increment score by 0.5 for each pipe
            pipe.passed = true;
        }

        // Collision detection
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove pipes that are out of view
    pipeArray = pipeArray.filter(pipe => pipe.x + pipe.width > 0);

    // Display score
    context.fillStyle = "white";
    context.font = "20px 'Press Start 2P'";
    context.fillText("" + Math.floor(score), 5, 30); // Floor score to show whole number

    if (gameOver) {
        context.fillStyle = "white";
        context.font = "20px 'Press Start 2P'";
        context.fillText("GAME OVER", 100, 320);
        context.fillText(playerName, 100,360);
        context.fillText("You Scored:" + Math.floor(score), 100, 400);
    } else {
        requestAnimationFrame(update); // Continue updating the game
    }
}

// Draw the bird
function drawBird() {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); // Draw bird image
}

// Draw pipes
function drawPipe(pipe) {
    if (pipe.y < 0) {
        context.drawImage(topPipeImg, pipe.x, pipe.y, pipe.width, pipe.height); // Draw top pipe
    } else {
        context.drawImage(bottomPipeImg, pipe.x, pipe.y, pipe.width, pipe.height); // Draw bottom pipe
    }
}

// Place pipes on the canvas
function placePipes() {
    if (gameOver) return;

    let pipeYPosition = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let opening = board.height / 4;

    let topPipe = {
        x: pipeX,
        y: pipeYPosition,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    let bottomPipe = {
        x: pipeX,
        y: pipeYPosition + pipeHeight + opening,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    pipeArray.push(topPipe, bottomPipe);
}

// Move the bird when the player presses the spacebar or arrow key
function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp") {
        velocityY = -6; // Jumping
        if (gameOver) {
            resetGame(); // Reset game if it's over
        }
    }
}

// Reset the game state after game over
function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    requestAnimationFrame(update);
}

// Detect collisions between the bird and pipes
function detectCollision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
    );
}
