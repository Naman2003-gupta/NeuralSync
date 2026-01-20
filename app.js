// ========= Performance knobs =========
const CFG = {
  floatingDots: 40,          // was 200
  dataFlowH: 6,              // was 10
  dataFlowV: 8,              // was 15
  neuralCell: 90,            // larger cell => fewer nodes
  enable3DRotation: false,   // was requestAnimationFrame loop
  metricUpdateMs: 15000      // was 5000
};

let performanceChart, resourceChart;

/* ===========================
   AI CHAT API INTEGRATION
   =========================== */
const OPENROUTER_MODEL = "openai/gpt-3.5-turbo";

function initializeCharts() {
  const perfCanvas = document.getElementById('performanceChart');
  const resCanvas = document.getElementById('resourceChart');
  if (!perfCanvas || !resCanvas) return;

  const perfCtx = perfCanvas.getContext('2d');
  const resCtx = resCanvas.getContext('2d');

  performanceChart = new Chart(perfCtx, {
    type: 'line',
    data: {
      labels: ['00:00','04:00','08:00','12:00','16:00','20:00','00:00'],
      datasets: [
        {
          label: 'CPU Usage',
          data: [65, 70, 85, 82, 78, 88, 75],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.10)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Memory Usage',
          data: [45, 52, 60, 58, 62, 70, 65],
          borderColor: '#7C3AED',
          backgroundColor: 'rgba(124, 58, 237, 0.10)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#0F172A', font: { family: 'Inter' } } } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#E2E8F0' }, ticks: { color: '#64748B' } },
        x: { grid: { color: '#E2E8F0' }, ticks: { color: '#64748B' } }
      }
    }
  });

  resourceChart = new Chart(resCtx, {
    type: 'doughnut',
    data: {
      labels: ['AI Processing','Data Storage','Model Training','Security'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#2563EB','#7C3AED','#06B6D4','#10B981'],
        borderWidth: 0,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#0F172A', font: { family: 'Inter' }, padding: 20 } } },
      cutout: '65%'
    }
  });
}

function createFloatingGrid() {
  const grid = document.getElementById('floatingGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < CFG.floatingDots; i++) {
    const el = document.createElement('div');
    el.className = 'grid-element';
    el.style.left = (Math.random() * 100) + '%';
    el.style.top = (Math.random() * 100) + '%';
    el.style.animationDelay = (Math.random() * 10) + 's';
    grid.appendChild(el);
  }
}

function createDataFlowGrid() {
  const grid = document.getElementById('dataFlowGrid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < CFG.dataFlowH; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line horizontal';
    line.style.top = ((i + 1) * (100 / (CFG.dataFlowH + 1))) + '%';
    line.style.animationDelay = (i * 0.25) + 's';
    grid.appendChild(line);
  }
  for (let i = 0; i < CFG.dataFlowV; i++) {
    const line = document.createElement('div');
    line.className = 'grid-line vertical';
    line.style.left = ((i + 1) * (100 / (CFG.dataFlowV + 1))) + '%';
    line.style.animationDelay = (i * 0.18) + 's';
    grid.appendChild(line);
  }
}

function createNeuralGrid() {
  const grid = document.getElementById('neuralGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const container = document.body;
  const cols = Math.max(1, Math.floor(container.offsetWidth / CFG.neuralCell));
  const rows = Math.max(1, Math.floor(container.offsetHeight / CFG.neuralCell));

  // Keep it small to avoid hundreds of nodes
  const maxNodes = 120;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (count++ > maxNodes) return;
      const node = document.createElement('div');
      node.className = 'neural-node';

      const connection = document.createElement('div');
      connection.className = 'node-connection';
      connection.style.animationDelay = ((r + c) * 0.12) + 's';

      const core = document.createElement('div');
      core.className = 'node-core';
      core.style.animationDelay = ((r + c) * 0.08) + 's';

      node.appendChild(connection);
      node.appendChild(core);
      grid.appendChild(node);
    }
  }
}

function create3DNeuralNetwork() {
  const container = document.getElementById('neuralAnimation');
  if (!container) return;
  container.innerHTML = '';

  // Reduced neurons per layer vs original 8/6/4/6/8
  const layers = [
    { neurons: 4, x: 90 },
    { neurons: 3, x: 230 },
    { neurons: 3, x: 370 },
    { neurons: 3, x: 510 },
    { neurons: 4, x: 650 }
  ];

  layers.forEach((layer, layerIndex) => {
    const layerDiv = document.createElement('div');
    layerDiv.className = 'layer';
    layerDiv.style.width = '100%';
    layerDiv.style.height = '100%';
    layerDiv.style.left = layer.x + 'px';

    const neuronPositions = [];

    for (let i = 0; i < layer.neurons; i++) {
      const neuron = document.createElement('div');
      neuron.className = 'neuron-3d';
      neuron.style.animationDelay = (layerIndex * 0.2 + i * 0.1) + 's';

      const yPos = 70 + i * 70;
      neuron.style.transform = `translateY(${yPos}px)`;
      neuronPositions.push(yPos);

      layerDiv.appendChild(neuron);
    }

    // Connections
    if (layerIndex < layers.length - 1) {
      const nextLayer = layers[layerIndex + 1];
      for (let i = 0; i < layer.neurons; i++) {
        for (let j = 0; j < nextLayer.neurons; j++) {
          const connection = document.createElement('div');
          connection.className = 'connection-3d';

          const dx = nextLayer.x - layer.x;
          const dy = (70 + j * 70) - neuronPositions[i];
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          connection.style.width = length + 'px';
          connection.style.transform = `rotate(${angle}deg)`;
          connection.style.left = '0px';
          connection.style.top = neuronPositions[i] + 'px';
          connection.style.animationDelay = (Math.random() * 2) + 's';

          layerDiv.appendChild(connection);
        }
      }
    }

    container.appendChild(layerDiv);
  });

  // Rotation loop disabled by default (big win)
  if (CFG.enable3DRotation) {
    let angle = 0;
    const tick = () => {
      angle = (angle + 0.08) % 360;
      container.style.transform = `perspective(1000px) rotateY(${angle}deg)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

function openDemo() { document.getElementById('demoModal')?.classList.add('active'); }
function closeDemo() { document.getElementById('demoModal')?.classList.remove('active'); }

function startAIDemo() {
  closeDemo();
  document.getElementById('chatInput')?.focus();
  document.querySelector('.ai-chat-section')?.scrollIntoView({ behavior: 'smooth' });
}

function startNeuralTraining() {
  closeDemo();
  window.location.href = "neural.html";
}

function openCryptographyLab() {
  window.location.href = "./cryptography.html";
}

function openAIChat() {
  document.getElementById('chatInput')?.focus();
  document.querySelector('.ai-chat-section')?.scrollIntoView({ behavior: 'smooth' });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--light);
    color: var(--text);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    border-left: 4px solid var(--primary);
    z-index: 10000;
    transform: translateX(120%);
    transition: transform 0.25s ease;
    max-width: 300px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 80);
  setTimeout(() => {
    notification.style.transform = 'translateX(120%)';
    setTimeout(() => notification.remove(), 250);
  }, 2500);
}

/* ===========================
   Chat UI helpers
   =========================== */
function addChatBubble(role, text) {
  const chat = document.getElementById('chatMessages');
  if (!chat) return null;

  const wrap = document.createElement('div');
  wrap.className = 'message ' + (role === 'ai' ? 'ai' : 'user');

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.innerHTML = role === 'ai'
    ? '<i class="fas fa-robot"></i>'
    : '<i class="fas fa-user"></i>';

  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = 'Just now';
  content.appendChild(time);

  wrap.appendChild(avatar);
  wrap.appendChild(content);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;

  return wrap;
}

/* ===========================
   BACKEND PROXY chat
   =========================== */
async function sendAIMessage() {
  const input = document.getElementById('chatInput');
  const chat = document.getElementById('chatMessages');
  if (!input || !chat) return;

  const text = input.value.trim();
  if (!text) return;

  addChatBubble('user', text);
  input.value = '';

  const thinkingBubble = addChatBubble('ai', 'Thinking...');

  try {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: text }]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (thinkingBubble) thinkingBubble.remove();

    const reply = data?.choices?.[0]?.message?.content ?? "(No reply)";
    addChatBubble('ai', reply);

  } catch (error) {
    console.error(error);
    if (thinkingBubble) thinkingBubble.remove();
    addChatBubble('ai', 'Error connecting to AI.');
  }
}

// ======= Throttled scroll + debounced resize (important) =======
let lastScrollRun = 0;
window.addEventListener('scroll', () => {
  const now = performance.now();
  if (now - lastScrollRun < 60) return; // ~16 fps max
  lastScrollRun = now;

  const scrolled = window.pageYOffset || 0;
  const rate = scrolled * -0.25;

  document.querySelectorAll('.grid-background, .hero-grid-overlay').forEach(el => {
    el.style.transform = `translateY(${rate}px)`;
  });
}, { passive: true });

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    createNeuralGrid();
    if (performanceChart) performanceChart.resize();
    if (resourceChart) resourceChart.resize();
  }, 200);
});

// ======= Demo "real-time" updates slowed down =======
function startMetricSimulation() {
  setInterval(() => {
    if (document.hidden) return;

    document.querySelectorAll('.metric-value').forEach(el => {
      if (!el.textContent.includes('.')) return;
      const current = parseFloat(el.textContent);
      const change = (Math.random() - 0.5) * 0.4;
      const next = Math.min(100, Math.max(90, current + change));
      el.textContent = next.toFixed(1);

      const progressFill = el.closest('.metric-card')?.querySelector('.progress-fill');
      if (progressFill) progressFill.style.width = next + '%';
    });

    if (performanceChart?.data?.datasets) {
      performanceChart.data.datasets.forEach(ds => {
        ds.data = ds.data.map(() => Math.floor(Math.random() * 30 + 50));
      });
      performanceChart.update('none');
    }
  }, CFG.metricUpdateMs);
}

document.addEventListener('DOMContentLoaded', () => {
  createFloatingGrid();
  createDataFlowGrid();
  createNeuralGrid();
  create3DNeuralNetwork();
  initializeCharts();
  startMetricSimulation();

  setTimeout(() => showNotification('Welcome to NEURALSYNC! Optimizations enabled.'), 700);

  // Enter key support
  document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAIMessage();
  });

  // Keep your existing time button behavior
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
