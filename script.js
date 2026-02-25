lucide.createIcons();

/* ── HAMBURGER NAV ─────────────────────────────────── */
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");

toggle.addEventListener("click", () => {
  toggle.classList.toggle("open");
  links.classList.toggle("open");
});

// Close menu on link click
document.querySelectorAll(".nav-link").forEach((a) => {
  a.addEventListener("click", () => {
    toggle.classList.remove("open");
    links.classList.remove("open");
  });
});

/* ── PARTICLES ─────────────────────────────────────── */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", () => {
  resize();
});

// Reduce count on mobile for performance
const isMobile = () => window.innerWidth < 600;

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(init) {
    this.x = init ? Math.random() * W : Math.random() > 0.5 ? 0 : W;
    this.y = init ? Math.random() * H : Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5 + 0.4;
    const c = [
      "rgba(123,92,245,",
      "rgba(79,142,247,",
      "rgba(167,139,250,",
      "rgba(109,40,217,",
    ];
    this.color = c[Math.floor(Math.random() * c.length)];
    this.alpha = Math.random() * 0.45 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.007 + Math.random() * 0.015;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += this.pulseSpeed;
    if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5)
      this.reset(false);
  }
  draw() {
    const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + a + ")";
    ctx.fill();
  }
}

function buildParticles() {
  particles = [];
  const count = isMobile() ? 55 : 100;
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
buildParticles();
window.addEventListener("resize", buildParticles);

const CONNECT_DIST = () => (isMobile() ? 80 : 110);

function connectParticles() {
  const dist = CONNECT_DIST();
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < dist) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(123,92,245,${(1 - d / dist) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

let lastTime = 0;
function animate(ts) {
  if (ts - lastTime > 22) {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    lastTime = ts;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* ── SCROLL REVEAL ─────────────────────────────────── */
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
setTimeout(
  () =>
    document
      .querySelectorAll("#hero .fade-up")
      .forEach((el) => el.classList.add("visible")),
  80,
);
