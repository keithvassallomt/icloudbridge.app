// Background Animation System for iCloudBridge
// Creates a syncing data visualization with particle clusters and animated pulses

// Configuration
const CONFIG = {
  // Cluster settings
  nodeCount: 30, // Nodes per cluster
  nodeRadius: 2,
  nodeGlowRadius: 8,
  clusterSpread: 150, // Vertical spread of cluster
  clusterDepth: 80, // Horizontal depth from edge

  // Arc settings
  arcCount: 16, // Number of connecting arcs
  arcCurveStrength: 0.3, // Bézier curve intensity
  arcOpacity: 0.15,
  arcWidth: 1.5,

  // Pulse settings
  pulseSpeed: 0.003, // Base speed (0-1 per frame)
  pulseRadius: 3,
  pulseGlowRadius: 12,
  pulseSpacing: 0.25, // Minimum spacing between pulses on same arc
  pulsesPerArc: 2, // Number of pulses per arc

  // Interaction
  parallaxStrength: 0.1,
  hoverSpeedMultiplier: 2.5,

  // Animation
  jitterAmount: 0.5, // Node micro-jitter
  jitterSpeed: 0.02,

  // Color channels (Notes, Reminders, Photos, Passwords)
  channels: [
    { name: 'Notes', color: '#FFD60A', glow: '#FFD60A88' }, // Soft yellow
    { name: 'Reminders', color: '#00C7BE', glow: '#00C7BE88' }, // Cyan/blue
    { name: 'Photos', color: '#BF5AF2', glow: '#BF5AF288' }, // Violet/pink
    { name: 'Passwords', color: '#8B6FFF', glow: '#8B6FFF88' }, // Purple/light-violet
  ]
};

class BackgroundAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;

    // Animation state
    this.leftCluster = [];
    this.rightCluster = [];
    this.arcs = [];
    this.pulses = [];

    // Mouse tracking
    this.mouse = { x: 0, y: 0, normalizedX: 0, normalizedY: 0 };
    this.isHoveringButton = false;

    // Animation frame
    this.animationFrame = null;
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    this.createClusters();
    this.createArcs();
    this.createPulses();
    this.setupEventListeners();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.ctx.scale(dpr, dpr);

    // Recreate clusters and arcs on resize
    if (this.leftCluster.length > 0) {
      this.createClusters();
      this.createArcs();
    }
  }

  createClusters() {
    this.leftCluster = [];
    this.rightCluster = [];

    const centerY = this.height / 2;

    // Left cluster
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      this.leftCluster.push({
        x: CONFIG.clusterDepth * Math.random(),
        y: centerY + (Math.random() - 0.5) * CONFIG.clusterSpread,
        baseX: CONFIG.clusterDepth * Math.random(),
        baseY: centerY + (Math.random() - 0.5) * CONFIG.clusterSpread,
        jitterOffset: Math.random() * Math.PI * 2,
      });
    }

    // Right cluster
    for (let i = 0; i < CONFIG.nodeCount; i++) {
      this.rightCluster.push({
        x: this.width - CONFIG.clusterDepth * Math.random(),
        y: centerY + (Math.random() - 0.5) * CONFIG.clusterSpread,
        baseX: this.width - CONFIG.clusterDepth * Math.random(),
        baseY: centerY + (Math.random() - 0.5) * CONFIG.clusterSpread,
        jitterOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  createArcs() {
    this.arcs = [];

    for (let i = 0; i < CONFIG.arcCount; i++) {
      // Pick random nodes from each cluster
      const startNode = this.leftCluster[Math.floor(Math.random() * this.leftCluster.length)];
      const endNode = this.rightCluster[Math.floor(Math.random() * this.rightCluster.length)];

      // Assign a channel color
      const channel = CONFIG.channels[i % CONFIG.channels.length];

      // Create control points for Bézier curve
      const midX = this.width / 2;
      const curveOffset = (Math.random() - 0.5) * this.height * CONFIG.arcCurveStrength;

      this.arcs.push({
        startNode,
        endNode,
        channel,
        controlPoint1: {
          x: midX - this.width * 0.1,
          y: startNode.baseY + curveOffset
        },
        controlPoint2: {
          x: midX + this.width * 0.1,
          y: endNode.baseY + curveOffset
        }
      });
    }
  }

  createPulses() {
    this.pulses = [];

    this.arcs.forEach((arc, arcIndex) => {
      for (let i = 0; i < CONFIG.pulsesPerArc; i++) {
        // Half pulses go forward (left to right), half go backward (right to left)
        const direction = i % 2 === 0 ? 1 : -1;
        this.pulses.push({
          arc,
          progress: i * CONFIG.pulseSpacing,
          speed: CONFIG.pulseSpeed * (0.8 + Math.random() * 0.4), // Slight variation
          direction, // 1 = forward (left to right), -1 = backward (right to left)
        });
      }
    });
  }

  setupEventListeners() {
    // Mouse move for parallax
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.normalizedX = (e.clientX / this.width) * 2 - 1; // -1 to 1
      this.mouse.normalizedY = (e.clientY / this.height) * 2 - 1;
    });

    // Button hover detection (only for Download button)
    const downloadButton = document.querySelector('.btn-primary');
    if (downloadButton) {
      downloadButton.addEventListener('mouseenter', () => {
        this.isHoveringButton = true;
      });
      downloadButton.addEventListener('mouseleave', () => {
        this.isHoveringButton = false;
      });
    }

    // Resize
    window.addEventListener('resize', () => this.resize());
  }

  drawGradientBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#0A0E27');
    gradient.addColorStop(0.5, '#1A1F3A');
    gradient.addColorStop(1, '#0F0D1E');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawNode(node, parallaxFactor = 1) {
    const parallaxX = this.mouse.normalizedX * CONFIG.parallaxStrength * parallaxFactor;
    const parallaxY = this.mouse.normalizedY * CONFIG.parallaxStrength * parallaxFactor;

    const x = node.x + parallaxX;
    const y = node.y + parallaxY;

    // Glow
    const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, CONFIG.nodeGlowRadius);
    glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, CONFIG.nodeGlowRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Core
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(x, y, CONFIG.nodeRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawArc(arc, parallaxFactor = 1) {
    const parallaxX = this.mouse.normalizedX * CONFIG.parallaxStrength * parallaxFactor;
    const parallaxY = this.mouse.normalizedY * CONFIG.parallaxStrength * parallaxFactor;

    const startX = arc.startNode.x + parallaxX;
    const startY = arc.startNode.y + parallaxY;
    const endX = arc.endNode.x + parallaxX;
    const endY = arc.endNode.y + parallaxY;
    const cp1X = arc.controlPoint1.x + parallaxX;
    const cp1Y = arc.controlPoint1.y + parallaxY;
    const cp2X = arc.controlPoint2.x + parallaxX;
    const cp2Y = arc.controlPoint2.y + parallaxY;

    // Draw arc with glow
    this.ctx.strokeStyle = arc.channel.glow;
    this.ctx.lineWidth = CONFIG.arcWidth + 2;
    this.ctx.globalAlpha = CONFIG.arcOpacity;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
    this.ctx.stroke();

    this.ctx.globalAlpha = 1;
  }

  getPointOnBezier(t, start, cp1, cp2, end) {
    // Cubic Bézier curve calculation
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * start.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * end.x,
      y: mt3 * start.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * end.y
    };
  }

  drawPulse(pulse, parallaxFactor = 1) {
    const arc = pulse.arc;
    const parallaxX = this.mouse.normalizedX * CONFIG.parallaxStrength * parallaxFactor;
    const parallaxY = this.mouse.normalizedY * CONFIG.parallaxStrength * parallaxFactor;

    const start = {
      x: arc.startNode.x + parallaxX,
      y: arc.startNode.y + parallaxY
    };
    const end = {
      x: arc.endNode.x + parallaxX,
      y: arc.endNode.y + parallaxY
    };
    const cp1 = {
      x: arc.controlPoint1.x + parallaxX,
      y: arc.controlPoint1.y + parallaxY
    };
    const cp2 = {
      x: arc.controlPoint2.x + parallaxX,
      y: arc.controlPoint2.y + parallaxY
    };

    const point = this.getPointOnBezier(pulse.progress, start, cp1, cp2, end);

    // Glow
    const glowGradient = this.ctx.createRadialGradient(
      point.x, point.y, 0,
      point.x, point.y, CONFIG.pulseGlowRadius
    );
    glowGradient.addColorStop(0, arc.channel.glow);
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, CONFIG.pulseGlowRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Core
    this.ctx.fillStyle = arc.channel.color;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, CONFIG.pulseRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  updateNodes() {
    // Apply jitter to nodes
    const jitterX = Math.sin(this.time * CONFIG.jitterSpeed) * CONFIG.jitterAmount;
    const jitterY = Math.cos(this.time * CONFIG.jitterSpeed * 1.3) * CONFIG.jitterAmount;

    [...this.leftCluster, ...this.rightCluster].forEach(node => {
      const offset = Math.sin(this.time * CONFIG.jitterSpeed + node.jitterOffset);
      node.x = node.baseX + offset * jitterX;
      node.y = node.baseY + offset * jitterY;
    });
  }

  updatePulses() {
    const speedMultiplier = this.isHoveringButton ? CONFIG.hoverSpeedMultiplier : 1;

    this.pulses.forEach(pulse => {
      // Move pulse in its direction
      pulse.progress += pulse.speed * speedMultiplier * pulse.direction;

      // Loop pulse when it reaches either end
      if (pulse.direction === 1 && pulse.progress >= 1) {
        pulse.progress = 0;
      } else if (pulse.direction === -1 && pulse.progress <= 0) {
        pulse.progress = 1;
      }
    });
  }

  render() {
    // Clear and draw background
    this.drawGradientBackground();

    // Draw arcs
    this.arcs.forEach(arc => this.drawArc(arc, 50));

    // Draw nodes
    this.leftCluster.forEach(node => this.drawNode(node, 30));
    this.rightCluster.forEach(node => this.drawNode(node, 30));

    // Draw pulses
    this.pulses.forEach(pulse => this.drawPulse(pulse, 50));
  }

  animate() {
    this.time++;

    this.updateNodes();
    this.updatePulses();
    this.render();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Initialize animation
export function initBackgroundAnimation() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    console.warn('Hero canvas not found');
    return null;
  }

  return new BackgroundAnimation(canvas);
}
