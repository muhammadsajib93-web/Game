// ======================================
// BALLOON POP GAME ENGINE
// ======================================

const Game = {

    score: 0,
    target: 0,

    running: false,
    spawnTimer: null,

    activeBalloons: 0,
    maxBalloons: 7,

    // START GAME
    start() {

        this.score = 0;
        this.target = App.player.age;
        this.running = true;
        this.activeBalloons = 0;

        this.renderScreen();

        this.updateScore();

        this.startSpawning();

    },


    // GAME INTERFACE
    renderScreen() {

        const container = document.querySelector(
            ".login-container"
        );

        container.innerHTML = `

            <section class="game-container">

                <header class="game-header">

                    <div class="game-heading">
                        <span class="game-symbol">✦</span>

                        <div>
                            <h1>Balloon Challenge</h1>

                            <p>
                                Ready for your adventure?
                            </p>
                        </div>
                    </div>

                </header>


                <div class="score-card">

                    <div class="score-info">

                        <span>YOUR SCORE</span>

                        <h2 id="scoreDisplay">
                            0 / ${this.target}
                        </h2>

                    </div>

                    <div class="score-icon">
                        🎯
                    </div>

                </div>


                <div class="progress-track">

                    <div
                        class="progress-fill"
                        id="progressFill">
                    </div>

                </div>


                <div class="game-message"
                     id="gameMessage"
                     aria-live="polite">

                    Tap the numbered balloons!

                </div>


                <div class="balloon-playground"
                     id="balloonPlayground">

                    <div class="playground-decoration">
                        ✦
                    </div>

                </div>


                <div class="game-legend">

                    <span>
                        <i class="legend-number">1</i>
                        +1 Point
                    </span>

                    <span>
                        💣
                        Reset
                    </span>

                    <span>
                        🎈
                        Empty
                    </span>

                </div>

            </section>

        `;

    },


    // SCORE UPDATE
    updateScore() {

        const display = document.getElementById(
            "scoreDisplay"
        );

        const progress = document.getElementById(
            "progressFill"
        );

        if (!display || !progress) return;

        display.textContent =
            `${this.score} / ${this.target}`;

        const percentage =
            (this.score / this.target) * 100;

        progress.style.width = `${percentage}%`;

    },


    // BALLOON SPAWNING
    startSpawning() {

        this.spawnTimer = setInterval(() => {

            if (
                this.running &&
                this.activeBalloons < this.maxBalloons
            ) {

                this.createBalloon();

            }

        }, 950);

    },


    // CREATE BALLOON
    createBalloon() {

        if (!this.running) return;

        const playground = document.getElementById(
            "balloonPlayground"
        );

        if (!playground) return;

        const balloon = document.createElement("button");

        balloon.type = "button";

        balloon.className = "balloon";

        balloon.setAttribute(
            "aria-label",
            "Pop balloon"
        );

        // RANDOM BALLOON TYPE

        const random = Math.random();

        let type;

        if (random < 0.58) {

            type = "number";

        } else if (random < 0.70) {

            type = "bomb";

        } else {

            type = "empty";

        }


        // BALLOON APPEARANCE

        if (type === "number") {

            balloon.classList.add("number-balloon");

            balloon.textContent =
                Math.floor(Math.random() * 3) + 1;

        }

        else if (type === "bomb") {

            balloon.classList.add("bomb-balloon");

            balloon.textContent = "✹";

        }

        else {

            balloon.classList.add("empty-balloon");

            balloon.textContent = "";

        }


        // RANDOM POSITION

        const left = Math.random() * 78 + 8;

        const duration = Math.random() * 2 + 6;

        const drift = Math.random() * 70 - 35;

        balloon.style.left = `${left}%`;

        balloon.style.setProperty(
            "--float-duration",
            `${duration}s`
        );

        balloon.style.setProperty(
            "--drift",
            `${drift}px`
        );


        // BALLOON DATA

        balloon.dataset.type = type;

        this.activeBalloons++;

        playground.appendChild(balloon);


        // POP EVENT

        balloon.addEventListener("pointerdown", (event) => {

            event.preventDefault();

            if (balloon.dataset.popped === "true") return;

            balloon.dataset.popped = "true";

            this.popBalloon(balloon);

        });


        // AUTO REMOVE

        setTimeout(() => {

            if (balloon.isConnected) {

                balloon.remove();

                this.activeBalloons--;

            }

        }, duration * 1000 + 100);

    },


    // POP BALLOON
    popBalloon(balloon) {

        const type = balloon.dataset.type;

        balloon.classList.add("popping");

        this.activeBalloons--;


        // NUMBER BALLOON

        if (type === "number") {

            this.score++;

            this.showMessage(
                "Lovely! +1 Point ✨"
            );

            this.updateScore();

            if (this.score >= this.target) {

                this.finishGame();

            }

        }


        // BOMB BALLOON

        else if (type === "bomb") {

            this.score = 0;

            this.updateScore();

            this.showMessage(
                "Oops! Score reset 💣"
            );

        }


        // EMPTY BALLOON

        else {

            this.showMessage(
                "Keep going! 🎈"
            );

        }


        // REMOVE BALLOON

        setTimeout(() => {

            balloon.remove();

        }, 220);

    },


    // GAME MESSAGE
    showMessage(message) {

        const element = document.getElementById(
            "gameMessage"
        );

        if (element) {

            element.textContent = message;

        }

    },


// ======================================
// GAME COMPLETION
// ======================================

finishGame() {

    this.running = false;

    clearInterval(this.spawnTimer);

    const container = document.querySelector(
        ".game-container"
    );

    container.innerHTML = `

        <section class="surprise-screen">

            <div class="surprise-icon">
                ✨
            </div>

            <h1>Amazing, ${App.escapeHTML(App.player.name)}!</h1>

            <p class="surprise-description">
                You completed your challenge!
            </p>

            <div class="winning-score">
                ${this.score} / ${this.target}
            </div>

            <h2 class="surprise-title">
                Your Winning Surprise Is Here!
            </h2>

            <p class="scratch-instruction">
                scatch the card.
            </p>


            <!-- SCRATCH CARD -->

            <div class="scratch-card" id="scratchCard">

                <!-- BIRTHDAY CARD IMAGE -->

                <div class="card-art">

                    

                  <img src="assets/birthday-card.jpeg" alt="Birthday Card">
               

			   </div>
                


                <!-- SCRATCH CANVAS -->

                <canvas
                    id="scratchCanvas"
                    aria-label="Scratch here to reveal your birthday card">
                </canvas>


                <!-- SCRATCH LABEL -->

                <div class="scratch-label"
                     id="scratchLabel">

                    <span>✦</span>

                    <p>SCRATCH TO REVEAL!</p>

                    <small>
                        Use your finger to uncover your surprise
                    </small>

                    <span>✦</span>

                </div>

            </div>


           

        </section>

    `;


    // Initialize Scratch Card

    Scratch.init();

}

    

};