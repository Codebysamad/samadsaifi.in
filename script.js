/* ==========================================================================
   SAMAD SAIFI // FUTURISTIC PORTFOLIO MAIN CONTROLLER (PURE VANILLA JS)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. WEB AUDIO SYNTHESIZER SFX
// --------------------------------------------------------------------------
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function toggleAudioMute() {
  isMuted = !isMuted;
  return isMuted;
}

function getMuteState() {
  return isMuted;
}

// Sci-Fi UI Click Sound
function playClickSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

// Hover Pulse Sound
function playHoverSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

// Terminal Keystroke Sound
function playTerminalKeySound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
}

// Success Execution Sound
function playSuccessSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.1, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.15);
    });
  } catch (e) {}
}


// --------------------------------------------------------------------------
// 2. INTERACTIVE CYBER CANVAS PARTICLE SYSTEM
// --------------------------------------------------------------------------
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2, active: false };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function getPrimaryColorRGB() {
    const computed = getComputedStyle(document.body).getPropertyValue('--primary-rgb').trim();
    if (computed) return computed;
    return '0, 243, 255';
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x -= (dx / dist) * 0.5;
          this.y -= (dy / dist) * 0.5;
        }
      }
    }

    draw(primaryRGB) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${primaryRGB}, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgb(${primaryRGB})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const particleCount = Math.floor(Math.min(width, height) / 12);
  const particles = Array.from({ length: particleCount }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const primaryRGB = getPrimaryColorRGB();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(primaryRGB);

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${primaryRGB}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.active) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${primaryRGB}, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}


// --------------------------------------------------------------------------
// 3. INTERACTIVE CLI TERMINAL ENGINE
// --------------------------------------------------------------------------
function initTerminal() {
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  const body = document.getElementById('term-body');
  const clearBtn = document.getElementById('clear-term-btn');
  const chips = document.querySelectorAll('.cmd-chip');

  if (!form || !input || !body) return;

  const commands = {
    help: `
<span class="highlight">AVAILABLE SYSTEM COMMANDS:</span>
    <span class="highlight">bio</span>       : Summary of credentials & Stanford AI PhD research
    <span class="highlight">research</span>  : Overview of research labs & publication matrix
    <span class="highlight">stanford</span>  : Stanford HAI Autonomous AI Agents & Ethics details
    <span class="highlight">nasa</span>      : NASA Aerospace AI & Flight Optimization details
    <span class="highlight">skills</span>    : Technical competencies & global language list
    <span class="highlight">contact</span>   : Direct email, LinkedIn, and San Jose location
    <span class="highlight">matrix</span>    : Initiate neural matrix streaming visualizer
    <span class="highlight">download</span>  : Trigger full curriculum vitae download
    <span class="highlight">clear</span>     : Clear CLI output buffer
    `,

    bio: `
<span class="highlight">SAMAD SAIFI // BIOGRAPHY</span>
--------------------------------------------------
Role: Artificial Intelligence Research Fellow @ Stanford University
Status: PhD Scholar in Artificial Intelligence (Stanford / ASU / Oxford)
Location: San Jose, California, United States

Summary:
Focusing on ethical AI, foundation model research, autonomous agent orchestration,
and privacy-preserving machine learning via Zero-Knowledge Proofs (ZKP).
Former NASA Specialist & Contributor to Android Open Source Project (AOSP).
    `,

    research: `
<span class="highlight">RESEARCH & INITIATIVES MATRIX</span>
--------------------------------------------------
[01] Stanford HAI: Human-Centered Foundation Models & Autonomous Agents
[02] Stanford AI & Web3 Lab: Trustless ZKP Frameworks & GPU Compute Markets
[03] NASA Aerospace: AI Applications for Autonomous Flight & System Optimization
[04] Android AOSP: Custom ROM Kernel Stability, Bootloader & System Customization
[05] AWS & GCP: Scalable GenAI Cloud Architecture & Educational Mentorship
    `,

    stanford: `
<span class="highlight">STANFORD UNIVERSITY AI RESEARCH FELLOWSHIP</span>
--------------------------------------------------
Lab: Stanford Institute for Human-Centered Artificial Intelligence (HAI)
Focus Areas:
    Autonomous AI agent orchestration workflows
    Ethical guardrails & prompt engineering optimization
    Human-in-the-loop AI governance & policy frameworks
    `,

    nasa: `
<span class="highlight">NASA AEROSPACE AI & LEARNING DEVELOPMENT</span>
--------------------------------------------------
Organization: National Aeronautics and Space Administration (NASA)
Focus Areas:
    Autonomous flight control neural models & trajectory planning
    High-reliability aerospace systems optimization
    Mentoring & aerospace engineering technical curriculum development
    `,

    skills: `
<span class="highlight">CORE TECHNICAL COMPETENCIES</span>
--------------------------------------------------
    Foundation Model Research    [98%]
    AI Agent Orchestration       [96%]
    Prompt Engineering & Strategy [99%]
    Zero-Knowledge Proofs (ZKP)  [92%]
    AOSP Kernel & Custom Firmware [95%]
    Scalable Cloud Architecture   [94%]

Global Languages:
    English (Full Professional)
    Hindi (Full Professional)
    Chinese (Limited Working)
    Japanese (Elementary)
    Russian (Elementary)
    `,

    contact: `
<span class="highlight">DIRECT TRANSMISSION CHANNELS</span>
--------------------------------------------------
    Email   : iamsamadsaifi09@gmail.com
    LinkedIn: linkedin.com/in/samadsaifi09
    Web     : samadsaifi.tech
    Location: San Jose, CA, USA
    `,

    matrix: `
<span class="highlight">[NEURAL MATRIX STREAM INITIATED]</span>
01010011 01000001 01001101 01000001 01000100 // STANFORD_AI_NODE_ONLINE
01010011 01000001 01001001 01000110 01001001 // ZKP_PROOF_VERIFIED_100%
01001110 01000001 01000011 01000001 00100000 // NASA_AEROSPACE_STABLE
    `,

    download: `
<span class="highlight">INITIATING RESUME TRANSMISSION...</span>
Triggering PDF modal window download...
    `
  };

  function appendOutput(cmdText, responseHtml) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `
      <div><span class="term-prompt">samad@stanford-hai:~$</span> <strong>${escapeHtml(cmdText)}</strong></div>
      <div class="term-response">${responseHtml}</div>
    `;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function handleCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    playTerminalKeySound();

    if (!cmd) return;

    if (cmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    if (commands[cmd]) {
      appendOutput(cmdRaw, commands[cmd]);
      playSuccessSound();
      if (cmd === 'download') {
        const cvBtn = document.getElementById('download-cv-btn');
        if (cvBtn) cvBtn.click();
      }
    } else {
      appendOutput(
        cmdRaw,
        `<span style="color: #ff5f56;">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="highlight">'help'</span> for command index.</span>`
      );
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    handleCommand(val);
    input.value = '';
  });

  input.addEventListener('keydown', () => {
    playTerminalKeySound();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      body.innerHTML = '';
      playTerminalKeySound();
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const commandStr = chip.getAttribute('data-cmd');
      if (commandStr) {
        input.value = commandStr;
        handleCommand(commandStr);
        input.value = '';
      }
    });
  });
}


// --------------------------------------------------------------------------
// 4. AUTONOMOUS AI AGENT WORKFLOW SIMULATOR ENGINE
// --------------------------------------------------------------------------
function initAgentSimulator() {
  const runBtn = document.getElementById('run-sim-btn');
  const taskSelect = document.getElementById('agent-task');
  const modelSelect = document.getElementById('agent-model');
  const swarmSlider = document.getElementById('swarm-scale');
  const swarmVal = document.getElementById('swarm-count-val');
  const logOutput = document.getElementById('sim-log-output');
  const clearLogsBtn = document.getElementById('clear-sim-logs');
  const statusDot = document.getElementById('sim-status-dot');
  const latencyVal = document.getElementById('sim-latency');

  if (!runBtn || !logOutput) return;

  if (swarmSlider && swarmVal) {
    swarmSlider.addEventListener('input', (e) => {
      swarmVal.textContent = e.target.value;
    });
  }

  function addLog(message, type = 'info') {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    const logLine = document.createElement('div');
    logLine.className = `log-line ${type}`;
    logLine.innerHTML = `<span style="color: var(--text-muted);">[${timestamp}]</span> ${message}`;
    logOutput.appendChild(logLine);
    logOutput.scrollTop = logOutput.scrollHeight;
    playTerminalKeySound();
  }

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      logOutput.innerHTML = '';
      playClickSound();
    });
  }

  let isRunning = false;

  runBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    playClickSound();

    const selectedTask = taskSelect.options[taskSelect.selectedIndex].text;
    const selectedModel = modelSelect.options[modelSelect.selectedIndex].text;
    const swarmScale = swarmSlider ? swarmSlider.value : 5;
    const execMode = document.querySelector('input[name="exec-mode"]:checked')?.value || 'strict';

    if (statusDot) statusDot.innerHTML = '⚡ SIMULATING...';
    runBtn.disabled = true;
    runBtn.style.opacity = '0.6';

    const nodes = [
      document.getElementById('node-input'),
      document.querySelector('.conn-1'),
      document.getElementById('node-orchestrator'),
      document.querySelector('.conn-2'),
      document.getElementById('node-guardrail'),
      document.querySelector('.conn-3'),
      document.getElementById('node-output')
    ];

    nodes.forEach((n) => n && n.classList.remove('active'));

    addLog(`INITIATING WORKFLOW PIPELINE // OBJECTIVE: "${selectedTask}"`, 'info');
    addLog(`ENGINE CORE: ${selectedModel} | SWARM SIZE: ${swarmScale} Agents | MODE: ${execMode.toUpperCase()}`, 'info');

    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < nodes.length) {
        if (nodes[step]) nodes[step].classList.add('active');
        playTerminalKeySound();

        if (step === 0) {
          addLog(`[STEP 1/4] Ingesting task context payload...`, 'info');
        } else if (step === 2) {
          addLog(`[STEP 2/4] Swarm orchestrator active. Spawning ${swarmScale} parallel sub-agent workers...`, 'info');
        } else if (step === 4) {
          if (execMode === 'strict') {
            addLog(`[STEP 3/4] Ethical guardrail verified. Zero-Knowledge proof compliance confirmed.`, 'success');
          } else {
            addLog(`[STEP 3/4] Autonomous swarm self-optimizing across nodes...`, 'warn');
          }
        } else if (step === 6) {
          const lat = Math.floor(Math.random() * 8 + 8);
          if (latencyVal) latencyVal.textContent = `LATENCY: ${lat}ms`;
          addLog(`[STEP 4/4] Pipeline dispatch complete! Objective executed with 99.8% precision.`, 'success');
          playSuccessSound();
        }
        step++;
      } else {
        clearInterval(stepInterval);
        isRunning = false;
        runBtn.disabled = false;
        runBtn.style.opacity = '1';
        if (statusDot) statusDot.innerHTML = '⚡ COMPLETED';
      }
    }, 450);
  });
}


// --------------------------------------------------------------------------
// 5. MAIN CONTROLLER & INTERACTION INITIALIZATION
// --------------------------------------------------------------------------
const projectSpecs = {
  proj1: {
    title: "Human-Centered Ethical AI & Autonomous Agent Orchestration",
    badge: "STANFORD HAI RESEARCH",
    details: `
      <p><strong>Primary Objective:</strong> Develop multi-agent orchestration frameworks prioritizing human agency, ethical guardrails, and transparency in foundation model deployments.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Implemented "Human-in-the-Loop" (HITL) prompt engineering pipelines for large foundation models.</li>
        <li>Designed automated safety evaluation suites that audit agent decisions against Stanford HAI ethical criteria.</li>
        <li>Optimized enterprise business workflows, reducing manual decision latency by 64%.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Foundation Models (70B+), Autonomous Agent Swarms, Python, PyTorch, Ethical Alignment Guardrails.</p>
    `
  },
  proj2: {
    title: "Trustless Frameworks & ZKP Machine Learning",
    badge: "STANFORD AI & WEB3 LAB",
    details: `
      <p><strong>Primary Objective:</strong> Integrate Zero-Knowledge Proofs (zk-SNARKs) with machine learning inference to guarantee privacy and verifiable computation in decentralized networks.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Architected privacy-preserving data pipelines where model weights and input data remain encrypted.</li>
        <li>Developed decentralized GPU compute marketplace protocols to democratize AI compute access.</li>
        <li>Published trustless frameworks for sovereign data ownership and transparent AI governance.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Zero-Knowledge Proofs (ZKP), zk-SNARKs, Solidity, Web3, Distributed GPU Grid, Generative AI.</p>
    `
  },
  proj3: {
    title: "Autonomous Flight Control & Neural Systems",
    badge: "NASA AEROSPACE FELLOWSHIP",
    details: `
      <p><strong>Primary Objective:</strong> Formulate autonomous flight control algorithms and machine learning trajectory models for next-generation aerospace vehicles.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Engineered real-time telemetry processing modules delivering sub-millisecond dynamic adjustments.</li>
        <li>Implemented failure-resistant fallback routines for high-stress aerospace environments.</li>
        <li>Created technical curriculum and trained hundreds of student engineers in aerospace AI tools.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Flight Simulation, Neural Trajectory Optimization, C++, Python, Embedded Control Systems.</p>
    `
  },
  proj4: {
    title: "Custom Android ROM & Kernel Engineering",
    badge: "AOSP GLOBAL COMMUNITY",
    details: `
      <p><strong>Primary Objective:</strong> Deliver customized Android Open Source Project (AOSP) ROMs, low-level Linux kernel optimizations, and custom system security features across 10M+ active deployments.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Optimized memory allocation routines and CPU governor parameters, boosting battery efficiency by 22%.</li>
        <li>Built custom bootloaders, kernel modules, and hardware-abstracted driver interfaces.</li>
        <li>Maintained public open-source repositories and managed community feature feedback loops.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Android Open Source Project (AOSP), C/C++, Linux Kernel, Custom Drivers, ARM64 Architecture.</p>
    `
  },
  proj5: {
    title: "Scalable GenAI Cloud Architecture",
    badge: "AWS EDUCATOR & GCP LEAD",
    details: `
      <p><strong>Primary Objective:</strong> Design enterprise-scale cloud architectures supporting high-throughput Generative AI model inference and distributed training pipelines.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Served as AWS Educator & Google Cloud Study Jam lead, training thousands of cloud engineers.</li>
        <li>Architected automated infrastructure-as-code (IaC) deployments for low-latency AI inference endpoints.</li>
        <li>Implemented strict zero-trust security controls and automated failover protocols.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>AWS Lambda/EC2/ECS, Google Cloud Platform (GCP), Terraform, Docker, Kubernetes, CI/CD.</p>
    `
  },
  proj6: {
    title: "Scalable Human-Centered Data Strategy",
    badge: "ARIZONA STATE & OXFORD",
    details: `
      <p><strong>Primary Objective:</strong> Conduct interdisciplinary research on data strategy and computer science frameworks to empower human leadership in AI ecosystems.</p>
      <h4>Key Highlights & Architecture:</h4>
      <ul>
        <li>Explored advanced data governance standards and cross-institutional academic research models.</li>
        <li>Prepared scalable engineering frameworks for complex business and space technology applications.</li>
      </ul>
      <h4>Tech Stack:</h4>
      <p>Data Analytics, Cloud Architecture, Human-Centered Design, AI Governance.</p>
    `
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTerminal();
  initAgentSimulator();

  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const muted = toggleAudioMute();
      const label = soundBtn.querySelector('.btn-label');
      const icon = soundBtn.querySelector('.btn-icon');
      if (muted) {
        if (label) label.textContent = 'SFX: OFF';
        if (icon) icon.textContent = '🔇';
      } else {
        if (label) label.textContent = 'SFX: ON';
        if (icon) icon.textContent = '🔊';
        playSuccessSound();
      }
    });
  }

  document.querySelectorAll('.cyber-btn, .nav-item, .hud-btn, .filter-btn, .cmd-chip').forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSound());
  });

  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOpts = document.querySelectorAll('.theme-opt');

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('show');
      playClickSound();
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });

    themeOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.getAttribute('data-set-theme');
        document.body.setAttribute('data-theme', theme);

        themeOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        themeMenu.classList.remove('show');
        playSuccessSound();
      });
    });
  }

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      playClickSound();
    });

    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        playClickSound();
      });
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close-btn');

  document.querySelectorAll('.card-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const projKey = btn.getAttribute('data-project');
      const data = projectSpecs[projKey];

      if (data && modal && modalContent) {
        modalContent.innerHTML = `
          <div class="card-badge" style="font-size:0.8rem;">${data.badge}</div>
          <h2 style="margin: 12px 0; color: var(--primary); font-size:1.6rem;">${data.title}</h2>
          <div class="modal-body-text">${data.details}</div>
        `;
        modal.classList.add('show');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      playClickSound();
      modal.classList.remove('show');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('contact-form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSuccessSound();

      formStatus.style.color = 'var(--primary)';
      formStatus.innerHTML = `⚡ TRANSMISSION SENT SUCCESSFULLY! Samad will respond shortly.`;
      contactForm.reset();

      setTimeout(() => {
        formStatus.innerHTML = '';
      }, 5000);
    });
  }

  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      playSuccessSound();
      alert("Samad Saifi's Curriculum Vitae (PDF) transmission initiated! Direct email contact: iamsamadsaifi09@gmail.com");
    });
  }

  const metricValues = document.querySelectorAll('.metric-value');
  let animated = false;

  function animateCounters() {
    metricValues.forEach(el => {
      const targetStr = el.getAttribute('data-target');
      if (!targetStr) return;
      const target = parseInt(targetStr);
      let count = 0;
      const speed = Math.ceil(target / 40);

      const timer = setInterval(() => {
        count += speed;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        const suffix = el.textContent.replace(/[0-9]/g, '');
        el.textContent = count + suffix;
      }, 30);
    });
  }

  window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    if (heroSection && !animated) {
      const rect = heroSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        animateCounters();
        animated = true;
      }
    }
  });

  animateCounters();
  animated = true;

  const clockEl = document.getElementById('system-time');
  function updateClock() {
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `UTC: ${now.toUTCString().split(' ')[4]} | SYSTEM ONLINE`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();
});