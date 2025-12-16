const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// Atlas based on provided sheet
const ATLAS = {
    frames: {
        RESTART_BUTTON: { x: 2, y: 2, w: 72, h: 64 },
        GAME_OVER_TEXT: { x: 954, y: 26, w: 381, h: 21 },
        CLOUD: { x: 166, y: 2, w: 92, h: 27 },
        GROUND: { x: 2, y: 104, w: 2400, h: 24 },
        PTERODACTYL_1: { x: 260, y: 2, w: 92, h: 80 },
        PTERODACTYL_2: { x: 352, y: 2, w: 92, h: 80 },
        CACTUS_SMALL_1: { x: 446, y: 2, w: 34, h: 70 },
        CACTUS_SMALL_2: { x: 480, y: 2, w: 68, h: 70 },
        CACTUS_SMALL_3: { x: 548, y: 2, w: 102, h: 70 },
        CACTUS_LARGE_1: { x: 652, y: 2, w: 50, h: 100 },
        CACTUS_LARGE_2: { x: 702, y: 2, w: 100, h: 100 },
        CACTUS_LARGE_3: { x: 802, y: 2, w: 150, h: 100 },
        DINO_IDLE: { x: 1338, y: 2, w: 88, h: 94 },
        DINO_BLINK: { x: 1426, y: 2, w: 88, h: 94 },
        DINO_RUN_1: { x: 1514, y: 2, w: 88, h: 94 },
        DINO_RUN_2: { x: 1602, y: 2, w: 88, h: 94 },
        DINO_CRASH: { x: 1690, y: 2, w: 88, h: 94 },
        DINO_CROUCH_1: { x: 1866, y: 2, w: 118, h: 94 },
        DINO_CROUCH_2: { x: 1984, y: 2, w: 118, h: 94 }
    }
};

const spriteImg = new Image();
spriteImg.src = window.SPRITE_URL || '/sprite.png';

// World + physics
const WORLD_W = 900;
const WORLD_H = 300;
const groundY = WORLD_H - 60;
const gravity = 2500;
const jumpVelocity = 900;

// State
let running = false;
let ended = false;
let lastTs = 0;
let speed = 520; // closer to real dino starting speed
let distance = 0;
let score = 0;
let highScore = 0;

// Utility helpers
function drawFrame(name, dx, dy, dw, dh) {
    const f = ATLAS.frames[name];
    if (!f) return;
    ctx.drawImage(spriteImg, f.x, f.y, f.w, f.h, dx, dy, dw ?? f.w, dh ?? f.h);
}

function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function padScore(n) {
    return n.toString().padStart(5, '0');
}

class Ground {
    constructor() { this.offset = 0; }
    update(dt) { this.offset = (this.offset + speed * dt) % ATLAS.frames.GROUND.w; }
    draw() {
        const f = ATLAS.frames.GROUND;
        let x = -this.offset;
        while (x < WORLD_W) {
            const drawW = Math.min(f.w, WORLD_W - x);
            ctx.drawImage(spriteImg, f.x, f.y, drawW, f.h, x, groundY, drawW, f.h);
            x += drawW;
        }
    }
}

class Cloud {
    constructor() {
        this.x = WORLD_W + Math.random() * 200;
        this.y = 20 + Math.random() * 100;
        this.speed = speed * 0.25;
    }
    update(dt) { this.x -= this.speed * dt; }
    draw() { drawFrame('CLOUD', this.x, this.y); }
    offscreen() { return this.x + ATLAS.frames.CLOUD.w < 0; }
}

class Dino {
    constructor() { this.reset(); }
    reset() {
        this.x = 60;
        this.w = 60;
        this.h = 70;
        this.y = groundY - this.h;
        this.vy = 0;
        this.ducking = false;
        this.anim = 0;
        this.blink = 0;
        this.crashed = false;
        this.crouchW = 80;
        this.crouchH = 60;
    }
    onGround() { return this.y + this.h >= groundY - 0.1; }
    jump() {
        if (this.onGround()) {
            this.vy = -jumpVelocity;
            this.ducking = false;
        }
    }
    setDuck(d) { if (!this.crashed) this.ducking = d && this.onGround(); }
    hitbox() {
        const pad = 8;
        if (this.ducking) {
            const hbH = this.crouchH * 0.7;
            return { x: this.x + pad, y: this.y + (this.crouchH - hbH), w: this.crouchW - pad * 2, h: hbH };
        }
        const hbH = this.h * 0.9;
        return { x: this.x + pad, y: this.y + (this.h - hbH), w: this.w - pad * 2, h: hbH };
    }
    update(dt) {
        if (!this.onGround() || this.vy < 0) {
            this.vy += gravity * dt;
            this.y += this.vy * dt;
            const currentH = this.ducking ? this.crouchH : this.h;
            if (this.y + currentH > groundY) { this.y = groundY - currentH; this.vy = 0; }
        }
        this.anim += dt * 10;
        this.blink += dt;
    }
    draw() {
        if (this.crashed) { drawFrame('DINO_CRASH', this.x, this.y - 20, this.w, this.h + 20); return; }
        if (!this.onGround()) { drawFrame('DINO_RUN_1', this.x, this.y - 20, this.w, this.h + 20); return; }
        if (this.ducking) {
            const f = (Math.floor(this.anim) % 2) === 0 ? 'DINO_CROUCH_1' : 'DINO_CROUCH_2';
            this.y = groundY - this.crouchH;
            drawFrame(f, this.x, this.y - 10, this.crouchW, this.crouchH + 10); return;
        }
        this.y = groundY - this.h;
        let f = (Math.floor(this.anim) % 2) === 0 ? 'DINO_RUN_1' : 'DINO_RUN_2';
        if (this.blink > 3 && this.blink < 3.2) f = 'DINO_BLINK';
        if (this.blink > 6) this.blink = 0;
        drawFrame(f, this.x, this.y - 20, this.w, this.h + 20);
    }
}

class Cactus {
    constructor() {
        const choices = ['CACTUS_SMALL_1','CACTUS_SMALL_2','CACTUS_SMALL_3','CACTUS_LARGE_1','CACTUS_LARGE_2','CACTUS_LARGE_3'];
        this.frameName = choices[Math.floor(Math.random() * choices.length)];
        const f = ATLAS.frames[this.frameName];
        this.w = f.w; this.h = f.h;
        this.x = WORLD_W + 20;
        this.y = groundY - this.h;
        this.passed = false;
    }
    update(dt) { this.x -= speed * dt; }
    draw() { drawFrame(this.frameName, this.x, this.y); }
    hitbox() {
        const pad = 5;
        return { x: this.x + pad, y: this.y + pad, w: this.w - pad * 2, h: this.h - pad * 2 };
    }
    offscreen() { return this.x + this.w < 0; }
}

class Bird {
    constructor() {
        this.frames = ['PTERODACTYL_1', 'PTERODACTYL_2'];
        this.anim = 0;
        this.w = ATLAS.frames.PTERODACTYL_1.w;
        this.h = ATLAS.frames.PTERODACTYL_1.h;
        this.x = WORLD_W + 20;
        const levels = [groundY - 90, groundY - 70, groundY - 120];
        this.y = levels[Math.floor(Math.random() * levels.length)];
        this.passed = false;
    }
    update(dt) { this.x -= speed * dt * 1.05; this.anim += dt * 12; }
    draw() { drawFrame(this.frames[Math.floor(this.anim) % 2], this.x, this.y); }
    hitbox() {
        const pad = 8;
        return { x: this.x + pad, y: this.y + pad, w: this.w - pad * 2, h: this.h - pad * 2 };
    }
    offscreen() { return this.x + this.w < 0; }
}

const dino = new Dino();
const ground = new Ground();
let clouds = [];
let obstacles = [];
let spawnTimer = 0;
let cloudTimer = 0;
let replayRect = null; // clickable restart area when game over

function scheduleSpawn(dt) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
        const useBird = score >= 200 && Math.random() < 0.25; // birds start later
        obstacles.push(useBird ? new Bird() : new Cactus());
        const base = 1.05;
        spawnTimer = Math.max(0.7, base - (speed - 520) / 1200);
    }
}

function scheduleCloud(dt) {
    cloudTimer -= dt;
    if (cloudTimer <= 0) {
        clouds.push(new Cloud());
        cloudTimer = 1.2 + Math.random() * 1.4;
    }
}

const keys = { ArrowUp:false, Space:false, ArrowDown:false };
document.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!running && !ended) running = true;
        dino.jump();
    }
    if (e.code === 'ArrowDown') dino.setDuck(true);
    if (ended && (e.code === 'Enter' || e.code === 'Space')) restart();
});

document.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
    if (e.code === 'ArrowDown') dino.setDuck(false);
});

canvas.addEventListener('click', (e) => {
    if (ended && replayRect) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (WORLD_W / rect.width);
        const y = (e.clientY - rect.top) * (WORLD_H / rect.height);
        if (x >= replayRect.x && x <= replayRect.x + replayRect.w && y >= replayRect.y && y <= replayRect.y + replayRect.h) {
            restart();
            return;
        }
    }
    if (!running) running = true;
    dino.jump();
});

function restart() {
    running = false;
    ended = false;
    lastTs = 0;
    speed = 520;
    distance = 0;
    score = 0;
    obstacles = [];
    clouds = [];
    spawnTimer = 0;
    cloudTimer = 0;
    dino.reset();
    replayRect = null;
}

function endGame() {
    ended = true;
    running = false;
    dino.crashed = true;
    highScore = Math.max(highScore, score);
}

function update(dt) {
    if (!running) return;

    // Speed ramp similar to Chrome Dino
    speed = Math.min(900, speed + dt * 45);

    ground.update(dt);
    dino.update(dt);

    obstacles.forEach(o => o.update(dt));
    obstacles = obstacles.filter(o => !o.offscreen());
    clouds.forEach(c => c.update(dt));
    clouds = clouds.filter(c => !c.offscreen());

    scheduleSpawn(dt);
    scheduleCloud(dt);

    // scoring based on distance travelled
    distance += speed * dt;
    score = Math.floor(distance / 8);

    obstacles.forEach(o => {
        if (!o.passed && o.x + o.w < dino.x) { o.passed = true; }
        if (aabb(dino.hitbox(), o.hitbox())) endGame();
    });
}

function drawScore() {
    const hi = padScore(highScore);
    const cur = padScore(score);
    ctx.fillStyle = '#535353';
    ctx.font = '20px Courier New, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${hi ? 'HI ' + hi : ''} ${cur}`, WORLD_W - 20, 40);
}

function drawGameOver() {
    // Game over banner and restart button centered
    const textFrame = ATLAS.frames.GAME_OVER_TEXT;
    const btnFrame = ATLAS.frames.RESTART_BUTTON;
    const textX = (WORLD_W - textFrame.w) / 2;
    const textY = 90;
    drawFrame('GAME_OVER_TEXT', textX, textY);

    const btnX = (WORLD_W - btnFrame.w) / 2;
    const btnY = textY + 40;
    drawFrame('RESTART_BUTTON', btnX, btnY);
    replayRect = { x: btnX, y: btnY, w: btnFrame.w, h: btnFrame.h };
}

function draw() {
    ctx.clearRect(0, 0, WORLD_W, WORLD_H);
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    clouds.forEach(c => c.draw());
    ground.draw();
    obstacles.forEach(o => o.draw());
    dino.draw();
    drawScore();

    if (ended) drawGameOver();
}

function loop(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    update(dt);
    draw();
    requestAnimationFrame(loop);
}

restart();
requestAnimationFrame(loop);
