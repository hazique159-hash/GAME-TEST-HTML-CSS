/* ==========================================
   CYBERMATCH 2077 - GAME ENGINE
   ========================================== */

// 1. SOUND SYNTHESIS ENGINE (Web Audio API)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playFlip() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playMatch() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;

    const playTone = (freq, start, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(587.33, now, 0.2); // D5
    playTone(880.00, now + 0.08, 0.35); // A5
  }

  playMismatch() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  playCombo() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    // C-Major scale cyber arpeggio
    const scale = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    scale.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0.05, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  }

  playDefeat() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [311.13, 277.18, 246.94, 207.65]; // Sad descending tone
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.4);
    });
  }
}

// 2. CANVAS PARTICLE SYSTEM
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 4 + 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.96; // apply drag
    this.vy *= 0.96;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 3. GLYPH DATA (Inline SVGs with unique colors)
const GLYPH_POOL = [
  { id: 1, color: 'var(--neon-cyan)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" fill="currentColor"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" stroke-linecap="round"/></svg>` }, // CPU
  { id: 2, color: 'var(--neon-magenta)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 5 5 5 9v4c0 2 1.5 4.5 3 6v2c0 .5.5 1 1 1h6c.5 0 1-.5 1-1v-2c1.5-1.5 3-4 3-6V9c0-4-3-7-7-7zm-3 8c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm6 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z" stroke-linejoin="round"/><path d="M10 16h4M9 19h6"/></svg>` }, // Skull
  { id: 3, color: 'var(--neon-green)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 9c-1.5-2.5-4.5-2.5-6 0-1 1.5-1 4.5 1.5 5.5"/><path d="M14.5 13.5c2.5.5 4 3 2.5 5-1.5 2-4.5 1-5.5-1.5"/><path d="M9.5 13.5c-2.5.5-4-3-2.5-5 1.5-2 4.5-1 5.5 1.5"/></svg>` }, // Biohazard
  { id: 4, color: 'var(--neon-yellow)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="17" r="4"/><path d="M10 14l9-9 3 3-1.5 1.5L19 8l-1.5 1.5 1.5 1.5-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>` }, // Key
  { id: 5, color: 'var(--neon-purple)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 7v6c0 5.5 4 10.5 9 12 5-1.5 9-6.5 9-12V7l-9-5z" stroke-linejoin="round"/><path d="M12 6v12M8 10h8" stroke-linecap="round"/></svg>` }, // Shield
  { id: 6, color: 'var(--neon-orange)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="4" r="3"/><circle cx="4" cy="18" r="3"/><circle cx="20" cy="18" r="3"/><path d="M12 7v3M5.5 15.5l4.5-2.5M18.5 15.5l-4.5-2.5"/></svg>` }, // Network Node
  { id: 7, color: 'var(--neon-cyan)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>` }, // Target Ring
  { id: 8, color: 'var(--neon-magenta)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>` }, // Eye
  { id: 9, color: 'var(--neon-yellow)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8"/><path d="M4 4l4 4M16 8l4-4M4 20l4-4M16 16l4 4"/></svg>` }, // Tesseract
  { id: 10, color: 'var(--neon-purple)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2h13l3 3v15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><rect x="6" y="2" width="8" height="6"/><rect x="6" y="12" width="12" height="10"/></svg>` }, // Disk
  { id: 11, color: 'var(--neon-orange)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linejoin="round"/></svg>` }, // Lightning
  { id: 12, color: 'var(--neon-green)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6L2 12l6 6M16 6l6 6-6 6M10 20l4-16" stroke-linecap="round"/></svg>` }, // Terminal Code
  { id: 13, color: 'var(--neon-cyan)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 4v16M4 12h16M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4"/><circle cx="4" cy="4" r="1.5" fill="currentColor"/><circle cx="20" cy="4" r="1.5" fill="currentColor"/><circle cx="4" cy="20" r="1.5" fill="currentColor"/><circle cx="20" cy="20" r="1.5" fill="currentColor"/></svg>` }, // Drone
  { id: 14, color: 'var(--neon-magenta)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8.5 14.5a5 5 0 0 1 7 0M5.5 11.5a9 9 0 0 1 13 0M2.5 8.5a13 13 0 0 1 19 0" stroke-linecap="round"/></svg>` }, // Wi-Fi Radar
  { id: 15, color: 'var(--neon-green)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="16" height="12" rx="2"/><path d="M22 10v4" stroke-linecap="round"/><path d="M6 10v4M10 10v4M14 10v4"/></svg>` }, // Battery
  { id: 16, color: 'var(--neon-yellow)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22C12 12 22 12 22 12M12 22C12 12 2 12 2 12M12 2c0 10 10 10 10 10M12 2C12 12 2 12 2 12"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>` }, // Satellite
  { id: 17, color: 'var(--neon-purple)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 10.5C8 14 16 10 19.5 13.5M4.5 13.5C8 10 16 14 19.5 10.5" stroke-linecap="round"/><path d="M8 11.5v1M12 11v2M16 11.5v1"/></svg>` }, // DNA
  { id: 18, color: 'var(--neon-orange)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c0 0-3 3.5-3 7.5S10 16 12 22c0 0 3-2.5 3-7.5S12 2 12 2z"/><path d="M12 6c0 0-1.5 2-1.5 4.5S11 15 12 19" stroke-linecap="round"/></svg>` } // Flame
];

// 4. DIFFICULTY SPECIFICATIONS
const DIFFICULTIES = {
  easy: { pairs: 8, time: 60, gridClass: 'grid-4x4' },
  medium: { pairs: 12, time: 90, gridClass: 'grid-6x4' },
  hard: { pairs: 18, time: 120, gridClass: 'grid-6x6' }
};

// 5. GAME CONTROLLER
class CyberMatchGame {
  constructor() {
    this.sound = new SoundFX();
    
    // Elements
    this.board = document.getElementById('game-board');
    this.overlay = document.getElementById('start-overlay');
    this.overlayBtn = document.getElementById('start-overlay-btn');
    this.initiateBtn = document.getElementById('btn-initiate');
    this.muteBtn = document.getElementById('btn-mute');
    this.muteIcon = document.getElementById('mute-icon');
    
    // Stats elements
    this.scoreText = document.getElementById('stat-score');
    this.movesText = document.getElementById('stat-moves');
    this.accuracyText = document.getElementById('stat-accuracy');
    this.comboText = document.getElementById('stat-combo');
    this.comboFill = document.getElementById('combo-fill');
    
    // Timer elements
    this.timerText = document.getElementById('timer-value');
    this.timerBar = document.getElementById('timer-bar');
    
    // Leaderboard elements
    this.leaderboardContainer = document.getElementById('leaderboard-list');
    this.clearScoresBtn = document.getElementById('btn-clear-scores');
    
    // Modal elements
    this.modalEl = document.getElementById('scoreModal');
    this.finalScoreText = document.getElementById('modal-final-score');
    this.playerNameInput = document.getElementById('playerName');
    this.submitScoreBtn = document.getElementById('btn-submit-score');
    this.bsModal = new bootstrap.Modal(this.modalEl);

    // Canvas setup
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;

    // State Variables
    this.difficulty = 'easy';
    this.cards = [];
    this.flippedCards = [];
    this.score = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.totalClicks = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.timeRemaining = 60;
    this.maxTime = 60;
    this.timerInterval = null;
    this.isPlaying = false;
    this.isChecking = false;
    this.lastMatchTime = 0;

    this.bindEvents();
    this.renderLeaderboard();
    this.setupCanvas();
  }

  // Bind UI inputs
  bindEvents() {
    // Difficulty change listeners
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.difficulty = e.target.value;
        this.sound.playFlip();
        if (this.isPlaying) {
          this.endGame(false, true); // Cancel current game silently
        }
      });
    });

    // Start actions
    this.overlayBtn.addEventListener('click', () => this.startGame());
    this.initiateBtn.addEventListener('click', () => this.startGame());
    
    // Audio toggling
    this.muteBtn.addEventListener('click', () => {
      const isMuted = this.sound.toggleMute();
      if (isMuted) {
        this.muteIcon.className = 'fa-solid fa-volume-xmark me-1';
        this.muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark me-1"></i> AUDIO OFF';
        this.muteBtn.classList.add('cyber-btn-magenta');
      } else {
        this.muteIcon.className = 'fa-solid fa-volume-high me-1';
        this.muteBtn.innerHTML = '<i class="fa-solid fa-volume-high me-1"></i> AUDIO ON';
        this.muteBtn.classList.remove('cyber-btn-magenta');
      }
    });

    // Leaderboard actions
    this.clearScoresBtn.addEventListener('click', () => {
      this.sound.playMismatch();
      this.clearLeaderboard();
    });

    // Modal high score submit
    this.submitScoreBtn.addEventListener('click', () => {
      this.submitHighScore();
    });

    this.playerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.submitHighScore();
      }
    });
  }

  // Setup particle canvas sizing
  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.loopParticles();
  }

  resizeCanvas() {
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = parentRect.width;
    this.canvas.height = parentRect.height;
  }

  // Start new game session
  startGame() {
    this.sound.init(); // Initialize audio context on click
    this.sound.playFlip();

    // Reset state parameters
    const diffSettings = DIFFICULTIES[this.difficulty];
    this.maxTime = diffSettings.time;
    this.timeRemaining = diffSettings.time;
    this.score = 0;
    this.moves = 0;
    this.matchedPairs = 0;
    this.totalClicks = 0;
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.flippedCards = [];
    this.isChecking = false;
    this.isPlaying = true;
    this.lastMatchTime = 0;

    // Reset UI stats
    this.updateStatsDisplay();
    this.timerText.innerText = `${this.timeRemaining}s`;
    this.timerBar.style.strokeDashoffset = '0';
    this.timerBar.style.stroke = 'var(--neon-magenta)';

    // Reset canvas particles
    this.particles = [];

    // Shuffle & Generate Board
    this.generateBoard(diffSettings);

    // Toggle board layout view
    this.overlay.classList.add('d-none');
    this.board.classList.remove('d-none');
    this.initiateBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate me-1"></i> RESET LINK';

    // Start timer interval
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  // Shuffles array in-place
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Render card board
  generateBoard(settings) {
    this.board.innerHTML = '';
    this.board.className = settings.gridClass;

    // Pick icons for difficulty level
    const selectedGlyphs = GLYPH_POOL.slice(0, settings.pairs);
    
    // Duplicate icons to form matching pairs
    let gameIcons = [...selectedGlyphs, ...selectedGlyphs];
    this.shuffle(gameIcons);

    // Render cards to DOM
    gameIcons.forEach((glyph, index) => {
      const card = document.createElement('div');
      card.className = 'card-container';
      card.dataset.pairId = glyph.id;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">
            <div class="card-front-cyberpattern">
              <div class="card-front-node"></div>
            </div>
          </div>
          <div class="card-back" style="color: ${glyph.color};">
            ${glyph.svg}
          </div>
        </div>
      `;

      card.addEventListener('click', () => this.onCardClick(card, glyph));
      this.board.appendChild(card);
    });

    // Fit canvas overlay size
    setTimeout(() => this.resizeCanvas(), 50);
  }

  // Handle player card clicks
  onCardClick(cardElement, glyph) {
    // Prevent clicking matched, already flipped, or during mismatch validation pauses
    if (!this.isPlaying || this.isChecking) return;
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

    this.sound.playFlip();
    cardElement.classList.add('flipped');
    this.flippedCards.push({ element: cardElement, data: glyph });
    this.totalClicks++;

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.isChecking = true;
      this.checkMatch();
    }
    this.updateStatsDisplay();
  }

  // Evaluate matching pair
  checkMatch() {
    const cardA = this.flippedCards[0];
    const cardB = this.flippedCards[1];

    if (cardA.data.id === cardB.data.id) {
      // 1. Success! Match found
      this.sound.playMatch();
      cardA.element.classList.add('matched');
      cardB.element.classList.add('matched');

      // Spawn canvas particle bursts
      this.triggerMatchFX(cardA.element, cardB.element, cardA.data.color);

      // Score Calculations
      this.matchedPairs++;
      
      // Calculate rapid combo matching time speed bonuses
      const now = Date.now();
      let speedBonus = 0;
      if (this.lastMatchTime > 0 && (now - this.lastMatchTime) < 3500) {
        speedBonus = 50 * this.comboMultiplier;
      }
      this.lastMatchTime = now;

      // Update overcharge multiplier meter
      this.comboCount++;
      if (this.comboCount >= 4) this.comboMultiplier = 4;
      else if (this.comboCount >= 3) this.comboMultiplier = 3;
      else if (this.comboCount >= 2) this.comboMultiplier = 2;
      else this.comboMultiplier = 1;

      // Base score is multiplied by active combo coefficient
      this.score += (100 * this.comboMultiplier) + speedBonus;

      // Play special combo scale sound on multiplier upgrades
      if (this.comboCount >= 2 && this.comboCount <= 4) {
        setTimeout(() => this.sound.playCombo(), 250);
      }

      this.flippedCards = [];
      this.isChecking = false;

      // Victory Condition check
      const diffSettings = DIFFICULTIES[this.difficulty];
      if (this.matchedPairs === diffSettings.pairs) {
        this.endGame(true);
      }
    } else {
      // 2. Mismatch! Error
      this.sound.playMismatch();
      cardA.element.classList.add('mismatched');
      cardB.element.classList.add('mismatched');

      // Reset Combo multipliers
      this.comboCount = 0;
      this.comboMultiplier = 1;

      // Mismatch penalty subtraction
      this.score = Math.max(0, this.score - 15);

      // Delay then flip cards back down
      setTimeout(() => {
        cardA.element.classList.remove('flipped', 'mismatched');
        cardB.element.classList.remove('flipped', 'mismatched');
        this.flippedCards = [];
        this.isChecking = false;
        this.updateStatsDisplay();
      }, 800);
    }
  }

  // Spark explosions on canvas
  triggerMatchFX(elA, elB, color) {
    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    const xA = rectA.left - canvasRect.left + rectA.width / 2;
    const yA = rectA.top - canvasRect.top + rectA.height / 2;

    const xB = rectB.left - canvasRect.left + rectB.width / 2;
    const yB = rectB.top - canvasRect.top + rectB.height / 2;

    // Spawn 25 particles per card center location
    for (let i = 0; i < 25; i++) {
      this.particles.push(new Particle(xA, yA, color));
      this.particles.push(new Particle(xB, yB, color));
    }
  }

  // Particle update and draw loop
  loopParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      p.draw(this.ctx);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.loopParticles());
  }

  // Game timer countdown tick
  tick() {
    if (!this.isPlaying) return;

    this.timeRemaining--;

    // Update timer visuals
    this.timerText.innerText = `${this.timeRemaining}s`;
    
    // Circular radial progress
    const strokeDash = 220; // total circumference length
    const offset = strokeDash - (this.timeRemaining / this.maxTime) * strokeDash;
    this.timerBar.style.strokeDashoffset = offset;

    // Flashing neon warning color under 10 seconds remaining
    if (this.timeRemaining <= 10) {
      this.timerBar.style.stroke = 'var(--neon-magenta)';
      if (this.timeRemaining % 2 === 0) {
        this.timerText.style.textShadow = '0 0 10px var(--neon-magenta), 0 0 20px var(--neon-magenta)';
        this.timerText.style.color = 'var(--neon-magenta)';
      } else {
        this.timerText.style.textShadow = 'none';
        this.timerText.style.color = '#fff';
      }
    } else {
      this.timerBar.style.stroke = 'var(--neon-cyan)';
      this.timerText.style.textShadow = '0 0 6px var(--neon-cyan)';
      this.timerText.style.color = '#fff';
    }

    if (this.timeRemaining <= 0) {
      this.endGame(false);
    }
  }

  // Refresh scoreboard widgets
  updateStatsDisplay() {
    // 1. Digital Score display (pads digits to 5 characters)
    this.scoreText.innerText = String(this.score).padStart(5, '0');
    
    // 2. Flip counters
    this.movesText.innerText = String(this.moves).padStart(2, '0');
    
    // 3. Precision accuracy percentages
    if (this.totalClicks === 0) {
      this.accuracyText.innerText = '0%';
    } else {
      // Accuracy is defined as twice the matched pairs divided by total individual click attempts
      const acc = Math.round((this.matchedPairs * 2 / this.totalClicks) * 100);
      this.accuracyText.innerText = `${acc}%`;
    }

    // 4. Overcharge gauge
    this.comboText.innerText = `x${this.comboMultiplier}`;
    // Cap bar fill at 4 levels
    const fillPercent = Math.min((this.comboCount / 4) * 100, 100);
    this.comboFill.style.width = `${fillPercent}%`;
  }

  // Ends active game loop
  endGame(isWin, isSilent = false) {
    this.isPlaying = false;
    clearInterval(this.timerInterval);

    if (isSilent) {
      this.board.innerHTML = '';
      this.board.classList.add('d-none');
      this.overlay.classList.remove('d-none');
      this.initiateBtn.innerHTML = '<i class="fa-solid fa-power-off me-1"></i> INIT SYNC';
      return;
    }

    if (isWin) {
      this.sound.playVictory();
      
      // Calculate remaining clock speed bonus points!
      const timeBonus = this.timeRemaining * 10;
      this.score += timeBonus;
      this.updateStatsDisplay();

      // Launch congratulations modal
      this.finalScoreText.innerText = String(this.score).padStart(5, '0');
      this.playerNameInput.value = '';
      
      // Short timeout to let the last card flip animation complete first
      setTimeout(() => {
        this.bsModal.show();
      }, 500);

    } else {
      this.sound.playDefeat();
      
      // Redout overlay show warning screen
      this.board.innerHTML = `
        <div class="text-center py-5 d-flex flex-column align-items-center justify-content-center" style="width:100%;">
          <i class="fa-solid fa-skull-crossbones text-neon-magenta fa-4x mb-3 animate-pulse"></i>
          <h3 class="font-orbitron text-neon-magenta mb-2">NEURAL CORRUPTION</h3>
          <p class="font-mono text-muted mb-4">UPLINK TIME EXPIRED. BUFFER MEMORY IS LOST.</p>
          <button class="cyber-btn cyber-btn-magenta" id="btn-retry">RETRY INTERFACE LINK</button>
        </div>
      `;
      document.getElementById('btn-retry').addEventListener('click', () => this.startGame());
    }
  }

  // Save new High Score
  submitHighScore() {
    let name = this.playerNameInput.value.trim().toUpperCase();
    if (!name) name = 'NETRUNNER';

    const newRecord = {
      name: name.replace(/[^A-Z0-9_]/g, ''), // strip special symbols
      score: this.score,
      difficulty: this.difficulty.toUpperCase(),
      date: new Date().toLocaleDateString()
    };

    // Grab logs database
    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem('cybermatch_highscores')) || [];
    } catch(e) {
      scores = [];
    }

    scores.push(newRecord);
    
    // Sort descending by score, keep top 8 entries
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 8);

    localStorage.setItem('cybermatch_highscores', JSON.stringify(scores));
    
    this.bsModal.hide();
    this.renderLeaderboard();
    
    // Reset to start status overlay
    this.board.classList.add('d-none');
    this.overlay.classList.remove('d-none');
    this.initiateBtn.innerHTML = '<i class="fa-solid fa-power-off me-1"></i> INIT SYNC';
  }

  // Render sidebar high score logs
  renderLeaderboard() {
    let scores = [];
    try {
      scores = JSON.parse(localStorage.getItem('cybermatch_highscores')) || [];
    } catch(e) {
      scores = [];
    }

    this.leaderboardContainer.innerHTML = '';

    if (scores.length === 0) {
      this.leaderboardContainer.innerHTML = `
        <div class="text-center font-mono text-muted py-3 small">// NO DECRYPTED LOGS DETECTED</div>
      `;
      return;
    }

    scores.forEach((entry, idx) => {
      const diffChar = entry.difficulty ? `[${entry.difficulty[0]}]` : '[E]';
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      item.innerHTML = `
        <span class="leaderboard-rank">#${idx + 1}</span>
        <span class="leaderboard-name">${entry.name} <span class="opacity-30 fs-7">${diffChar}</span></span>
        <span class="leaderboard-score">${String(entry.score).padStart(5, '0')}</span>
      `;
      this.leaderboardContainer.appendChild(item);
    });
  }

  // Clear leaderboard records
  clearLeaderboard() {
    if (confirm('WARNING: THIS WILL PURGE ALL HIGHSCORE REGISTRIES. PROCEED?')) {
      localStorage.removeItem('cybermatch_highscores');
      this.renderLeaderboard();
    }
  }
}

// Instantiate game context on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.game = new CyberMatchGame();
});
