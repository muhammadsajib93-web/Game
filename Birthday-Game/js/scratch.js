// ======================================
// SCRATCH CARD ENGINE
// ======================================

const Scratch = {

    canvas: null,
    ctx: null,

    isDrawing: false,
    revealed: false,

    lastPoint: null,

    scratchPercentage: 0,

    revealThreshold: 55,


    // INITIALIZE

    init() {

        this.canvas = document.getElementById(
            "scratchCanvas"
        );

        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");

        this.revealed = false;

        this.isDrawing = false;

        this.scratchPercentage = 0;

        this.setupCanvas();

        this.addEvents();

    },


    // CANVAS SETUP

    setupCanvas() {

        const rect = this.canvas.getBoundingClientRect();

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        this.canvas.width = Math.round(
            rect.width * dpr
        );

        this.canvas.height = Math.round(
            rect.height * dpr
        );

        this.ctx.setTransform(
            dpr, 0, 0, dpr, 0, 0
        );


        // Silver Lavender Scratch Layer

        const gradient = this.ctx.createLinearGradient(
            0, 0,
            rect.width, rect.height
        );

        gradient.addColorStop(0, "#D9D2E5");
        gradient.addColorStop(0.5, "#F5F1FA");
        gradient.addColorStop(1, "#C8BEDB");


        this.ctx.globalCompositeOperation = "source-over";

        this.ctx.fillStyle = gradient;

        this.ctx.fillRect(
            0, 0,
            rect.width, rect.height
        );


        // Decorative Pattern

        this.ctx.fillStyle = "rgba(255,255,255,0.35)";

        for (let i = 0; i < 30; i++) {

            const x = Math.random() * rect.width;

            const y = Math.random() * rect.height;

            this.ctx.beginPath();

            this.ctx.arc(x, y, 2, 0, Math.PI * 2);

            this.ctx.fill();

        }


        // Scratch Card Text

        this.ctx.textAlign = "center";

        this.ctx.fillStyle = "#786D8B";

        this.ctx.font = "600 17px Poppins, sans-serif";

        this.ctx.fillText(
            "✦  SCRATCH TO REVEAL  ✦",
            rect.width / 2,
            rect.height / 2
        );


        this.ctx.font = "12px Poppins, sans-serif";

        this.ctx.fillStyle = "#92889F";

        this.ctx.fillText(
            "A surprise is waiting...",
            rect.width / 2,
            rect.height / 2 + 30
        );

    },


    // EVENT LISTENERS

    addEvents() {

        this.canvas.addEventListener(
            "pointerdown",
            (e) => this.startScratch(e)
        );

        this.canvas.addEventListener(
            "pointermove",
            (e) => this.scratch(e)
        );

        this.canvas.addEventListener(
            "pointerup",
            () => this.stopScratch()
        );

        this.canvas.addEventListener(
            "pointercancel",
            () => this.stopScratch()
        );

        this.canvas.addEventListener(
            "lostpointercapture",
            () => this.stopScratch()
        );

    },


    // START SCRATCH

    startScratch(e) {

        if (this.revealed) return;

        this.isDrawing = true;

        this.canvas.setPointerCapture(e.pointerId);

        this.lastPoint = this.getPosition(e);

        this.erase(this.lastPoint, this.lastPoint);

    },


    // SCRATCH MOVEMENT

    scratch(e) {

        if (!this.isDrawing || this.revealed) return;

        const currentPoint = this.getPosition(e);

        this.erase(
            this.lastPoint,
            currentPoint
        );

        this.lastPoint = currentPoint;

        this.checkProgress();

    },


    // STOP SCRATCH

    stopScratch() {

        this.isDrawing = false;

        this.lastPoint = null;

    },


    // GET POINTER POSITION

    getPosition(e) {

        const rect = this.canvas.getBoundingClientRect();

        return {

            x: e.clientX - rect.left,

            y: e.clientY - rect.top

        };

    },


    // ERASE SCRATCH LAYER

    erase(from, to) {

        const ctx = this.ctx;

        ctx.save();

        ctx.globalCompositeOperation = "destination-out";

        ctx.lineWidth = 38;

        ctx.lineCap = "round";

        ctx.lineJoin = "round";

        ctx.beginPath();

        ctx.moveTo(from.x, from.y);

        ctx.lineTo(to.x, to.y);

        ctx.stroke();

        ctx.restore();

    },


    // CHECK SCRATCH PROGRESS

    checkProgress() {

        if (this.revealed) return;

        const width = this.canvas.width;

        const height = this.canvas.height;

        const pixels = this.ctx.getImageData(
            0, 0,
            width, height
        ).data;

        let transparent = 0;

        const total = pixels.length / 4;

        // Sample every 16th pixel for performance

        for (let i = 3; i < pixels.length; i += 64) {

            if (pixels[i] < 128) {

                transparent++;

            }

        }

        const sampledTotal = Math.ceil(total / 16);

        this.scratchPercentage =
            (transparent / sampledTotal) * 100;


        if (
            this.scratchPercentage >= this.revealThreshold
        ) {

            this.reveal();

        }

    },


    // REVEAL CARD

    reveal() {

        if (this.revealed) return;

        this.revealed = true;

        this.isDrawing = false;

        this.ctx.clearRect(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        this.canvas.classList.add("scratch-hidden");

        const label = document.getElementById(
            "scratchLabel"
        );

        if (label) {

            label.classList.add("label-hidden");

        }

        const card = document.getElementById(
            "scratchCard"
        );

        card.classList.add("card-revealed");

    }

};