
const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  const y = window.scrollY + 140;
  sections.forEach(sec => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (a) a.classList.add('active');
    }
  });
});

/* ── Burger mobile ── */
const burger = document.getElementById('burger');
const navLinksEl = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ── Typewriter ── */
const words = ['Web Designer', 'Estudiante Ing. Software', 'UX/UI Designer', 'Data science'];
let wi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const word = words[wi];
  if (!del) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { setTimeout(() => del = true, 1800); return setTimeout(type, 50); }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { del = false; wi = (wi + 1) % words.length; return setTimeout(type, 350); }
  }
  setTimeout(type, del ? 28 : 55);
}
type();

/* ── Skill bars on scroll ── */
let barsAnimated = false;
const skillsSection = document.getElementById('skills');

function animateBars() {
  document.querySelectorAll('.skill-row').forEach(row => {
    const pct = row.getAttribute('data-p');
    const bar = row.querySelector('.sk-bar');
    if (bar) bar.style.width = pct + '%';
  });
}

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      animateBars();
    }
  });
}, { threshold: 0.15 });
if (skillsSection) io.observe(skillsSection);

/* ── Fade-up reveal ── */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.06) + 's';
      e.target.classList.add('visible');
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => fadeObs.observe(el));

/* ── Animated background canvas ── */
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); init(); });

class Dot {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .25;
    this.vy = (Math.random() - .5) * .25;
    this.r  = Math.random() * 1.5 + .5;
    this.a  = Math.random() * .35 + .05;
  }
  step() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.a})`;
    ctx.fill();
  }
}

let dots = [];
function init() { dots = Array.from({length:60}, () => new Dot()); }
init();

function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const d  = Math.hypot(dx, dy);
      if (d < 120) {
        ctx.strokeStyle = `rgba(0,229,255,${.08 * (1 - d/120)})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach(d => { d.step(); d.draw(); });
  connectDots();
  requestAnimationFrame(loop);
}
loop();

/* ── Add fade-up to elements on load ── */
document.querySelectorAll('.sobre-grid, .skills-main, .proj-featured, .proj-card, .contacto-inner, .hstat, .c-link').forEach(el => {
  el.classList.add('fade-up');
  fadeObs.observe(el);
});
