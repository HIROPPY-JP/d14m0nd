(() => {
  const arena = document.getElementById('arena');
  const targetsLayer = document.getElementById('targets');
  const feedbackLayer = document.getElementById('feedback');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const accuracyEl = document.getElementById('accuracy');
  const hitsEl = document.getElementById('hits');
  const missesEl = document.getElementById('misses');
  const targetCountEl = document.getElementById('targetCount');
  const timeProgress = document.getElementById('timeProgress');
  const gameStatus = document.getElementById('gameStatus');
  const center = document.querySelector('.arena-center');
  const startPrompt = document.getElementById('startPrompt');
  const countdown = document.getElementById('countdown');
  const resultOverlay = document.getElementById('resultOverlay');
  const difficulty = document.getElementById('difficulty');

  const MODES = {
    normal: { min: 24, max: 56, targets: 1, spawn: 720, label: 'NORMAL' },
    hard:   { min: 18, max: 43, targets: 1, spawn: 610, label: 'HARD' },
    expert: { min: 13, max: 32, targets: 1, spawn: 510, label: 'EXPERT' }
  };

  let score = 0, hits = 0, misses = 0, shots = 0, timeLeft = 30;
  let active = false, countdownActive = false, startedAt = 0, lastFrame = 0;
  let spawnTimer = 0, targetId = 0, targets = new Map(), reactionTimes = [], currentTargetBorn = 0;
  let raf = 0, countdownTimer = 0;
  const TOTAL_MS = 30000;

  function fmtScore(n) { return String(n).padStart(4, '0'); }
  function accuracy() { return shots ? Math.round((hits / shots) * 100) : 100; }
  function updateHUD() {
    scoreEl.textContent = fmtScore(score);
    timeEl.textContent = Math.max(0, timeLeft).toFixed(1);
    accuracyEl.innerHTML = `${accuracy()}<small>%</small>`;
    hitsEl.textContent = hits;
    missesEl.textContent = misses;
    targetCountEl.textContent = targets.size;
    // Keep the track's geometry fixed; animate only the inner fill via transform.
    // This avoids width/flex rounding issues near the end of the round.
    const progress = Math.max(0, Math.min(1, timeLeft / 30));
    timeProgress.style.transform = `scaleX(${progress})`;
    timeProgress.classList.toggle('is-danger', timeLeft <= 5 && timeLeft > 0);
  }

  function targetSVG(size) {
    const pad = 4, w = size + pad * 2, h = size + pad * 2;
    const cx = w / 2, cy = h / 2, outerR = size / 2;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <circle class="target-fill" cx="${cx}" cy="${cy}" r="${outerR}"/>
      <circle class="target-inner" cx="${cx}" cy="${cy}" r="${outerR * .62}"/>
      <circle cx="${cx}" cy="${cy}" r="${Math.max(2, size * .055)}" fill="currentColor" opacity=".8"/>
    </svg>`;
  }

  function spawnTarget() {
    if (!active) return;
    const mode = MODES[difficulty.value];
    const size = Math.round(mode.min + Math.random() * (mode.max - mode.min));
    const rect = arena.getBoundingClientRect();
    const margin = size + 15;
    const x = margin + Math.random() * Math.max(1, rect.width - margin * 2);
    const y = margin + Math.random() * Math.max(1, rect.height - margin * 2);
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'target';
    el.setAttribute('aria-label', `円形ターゲット、直径${size}px`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = 'var(--cyan)';
    el.innerHTML = targetSVG(size);
    const id = ++targetId;
    const born = performance.now();
    el.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!active) return;
      const points = Math.max(10, Math.round(1600 / size));
      score += points;
      hits++;
      shots++;
      reactionTimes.push(performance.now() - born);
      el.classList.add('hit');
      popText(`+${points}`, x, y, false);
      setTimeout(() => el.remove(), 150);
      targets.delete(id);
      updateHUD();
      if (active && targets.size === 0) spawnTarget();
    });
    targetsLayer.appendChild(el);
    targets.set(id, el);
    currentTargetBorn = born;
    updateHUD();
  }

  function popText(text, x, y, isMiss) {
    const el = document.createElement('span');
    el.className = `float-score${isMiss ? ' miss' : ''}`;
    el.textContent = text;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    feedbackLayer.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  function clearTargets() {
    targets.forEach(el => el.remove());
    targets.clear();
    feedbackLayer.replaceChildren();
    updateHUD();
  }

  function startCountdown() {
    if (active || countdownActive) return;
    resetState();
    countdownActive = true;
    center.classList.add('hidden');
    countdown.classList.remove('hidden');
    let count = 3;
    countdown.textContent = count;
    gameStatus.textContent = 'GET READY';
    const tick = () => {
      if (count > 1) {
        count--;
        countdown.textContent = count;
        countdownTimer = setTimeout(tick, 650);
      } else {
        countdown.textContent = 'GO!';
        countdownTimer = setTimeout(() => {
          countdown.classList.add('hidden');
          countdownActive = false;
          startGame();
        }, 450);
      }
    };
    countdownTimer = setTimeout(tick, 650);
  }

  function resetState() {
    cancelAnimationFrame(raf);
    clearTimeout(countdownTimer);
    clearTargets();
    score = hits = misses = shots = 0;
    timeLeft = 30; spawnTimer = 0; reactionTimes = [];
    active = false;
    resultOverlay.classList.add('hidden');
    center.classList.remove('hidden');
    countdown.classList.add('hidden');
    updateHUD();
  }

  function startGame() {
    active = true;
    startedAt = performance.now();
    lastFrame = startedAt;
    gameStatus.textContent = 'SESSION IN PROGRESS';
    center.classList.add('hidden');
    spawnTarget();
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    if (!active) return;
    const delta = now - lastFrame;
    lastFrame = now;
    timeLeft = Math.max(0, 30 - (now - startedAt) / 1000);
    updateHUD();
    if (timeLeft <= 0) { finishGame(); return; }
    raf = requestAnimationFrame(loop);
  }

  function finishGame() {
    active = false;
    cancelAnimationFrame(raf);
    clearTargets();
    timeLeft = 0;
    updateHUD();
    gameStatus.textContent = 'SESSION COMPLETE';
    document.getElementById('finalScore').textContent = score.toLocaleString('ja-JP');
    document.getElementById('finalHits').textContent = hits;
    document.getElementById('finalAccuracy').textContent = `${accuracy()}%`;
    const avg = reactionTimes.length ? reactionTimes.reduce((a,b) => a+b, 0) / reactionTimes.length : 0;
    document.getElementById('finalReaction').textContent = avg ? `${(avg / 1000).toFixed(2)}s` : '—';
    resultOverlay.classList.remove('hidden');
  }

  startPrompt.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    startCountdown();
  });

  arena.addEventListener('click', (event) => {
    // ゲーム開始・再開は専用ボタンからのみ。待機中や終了後の背景クリックでは開始しない。
    if (!active) return;
    if (event.target.closest('.target')) return;
    const rect = arena.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    misses++; shots++;
    popText('MISS', x, y, true);
    updateHUD();
  });

  document.getElementById('againBtn').addEventListener('click', (event) => {
    event.stopPropagation();
    startCountdown();
  });
  // 開始・再開は startPrompt / againBtn のクリック操作に限定する。
  difficulty.addEventListener('change', () => {
    if (!active && !countdownActive) gameStatus.textContent = `READY TO ENGAGE · ${MODES[difficulty.value].label}`;
  });
  updateHUD();
})();
