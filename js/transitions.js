// ============================================
// TRANSITIONS THÉMATIQUES ENTRE PAGES
// - Clic sur un lien vers une page projet / expérience :
//   une animation aux couleurs du thème de la page cible se lance.
// - Pendant l'animation, la page cible (HTML, CSS, scripts, images) est préchargée.
// - Quand l'animation ET le chargement sont terminés, on navigue ;
//   la page d'arrivée reprend la même animation puis la révèle.
// Seul ce fichier gère les transitions (main.js n'en gère plus).
// ============================================

(function () {
    const SCRIPT = document.currentScript;
    const ROOT = SCRIPT && SCRIPT.src
        ? new URL('../', SCRIPT.src)
        : new URL('./', window.location.href);

    const FLAG = 'ptm-arriving';
    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // ---------- Thèmes ----------
    const THEMES = {
        cyber: {
            bg: '#050505',
            accent: '#00ff88',
            accent2: '#00d4ff',
            text: '#00ff88',
            panel: 'rgba(0, 0, 0, 0.78)',
            font: "'Orbitron', 'Share Tech Mono', monospace",
            fontsUrl: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Share+Tech+Mono&display=swap',
            min: 2000,
            statuses: (n) => ['> initialisation de la connexion sécurisée...', `> chargement du module « ${n} »...`, '> accès autorisé']
        },
        electro: {
            bg: '#0a0a0a',
            accent: '#00b8d4',
            accent2: '#ff9800',
            text: '#00e5ff',
            panel: 'rgba(8, 12, 14, 0.78)',
            font: "'Rajdhani', 'Roboto Mono', monospace",
            fontsUrl: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap',
            min: 2000,
            statuses: (n) => ['Initialisation de l\'ESP32...', `Câblage du circuit « ${n} »...`, 'Circuit prêt']
        },
        business: {
            bg: 'linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)',
            accent: '#ffffff',
            accent2: '#e67e22',
            text: '#ffffff',
            panel: 'rgba(20, 50, 100, 0.55)',
            font: "'Montserrat', 'Segoe UI', sans-serif",
            fontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap',
            min: 1800,
            statuses: (n) => ['Préparation de la page...', `Chargement de « ${n} »...`, 'Terminé']
        },
        default: {
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            accent: '#ffffff',
            accent2: '#ffffff',
            text: '#ffffff',
            panel: 'transparent',
            font: "'Poppins', sans-serif",
            min: 450,
            statuses: () => ['', '', '']
        }
    };

    const PAGES = {
        'hack-ton-lycee': { theme: 'cyber', name: 'HACK TON LYCÉE' },
        'cyber-experience': { theme: 'cyber', name: 'CYBER EXPERIENCE' },
        'reflex': { theme: 'electro', name: 'REFLEX' },
        'quosi': { theme: 'business', name: 'QUOSI' },
        'clarins': { theme: 'business', name: 'LABORATOIRES CLARINS' }
    };

    // Seules les pages des sous-dossiers projects/ et experiences/ ont un thème spécial
    function resolvePage(pathname) {
        const m = pathname.match(/\/(projects|experiences)\/([^\/.]+)(\.html)?$/);
        if (m && PAGES[m[2]]) return PAGES[m[2]];
        return { theme: 'default', name: '' };
    }

    // ---------- Styles ----------
    function injectStyles() {
        if (document.getElementById('ptm-style')) return;
        const style = document.createElement('style');
        style.id = 'ptm-style';
        style.textContent = `
            #ptm-overlay { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center;
                opacity: 0; pointer-events: none; transition: opacity 300ms ease-in-out, transform 600ms ease-in-out; overflow: hidden; }
            #ptm-overlay.ptm-on { opacity: 1; pointer-events: all; }
            #ptm-overlay.ptm-reveal { opacity: 0; transform: scale(1.04); transition: opacity 650ms ease-in-out, transform 650ms ease-in-out; pointer-events: none; }
            #ptm-overlay canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
            #ptm-overlay.ptm-cyber::after { content: ''; position: absolute; inset: 0; pointer-events: none;
                background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,255,136,0.05) 3px, rgba(0,0,0,0) 4px); }
            .ptm-box { position: relative; z-index: 2; width: min(520px, 86vw); padding: 1.6rem 1.8rem; border-radius: 10px; text-align: center; }
            .ptm-cyber .ptm-box { border: 1px solid rgba(0,255,136,0.45); box-shadow: 0 0 30px rgba(0,255,136,0.25); }
            .ptm-electro .ptm-box { border: 1px solid rgba(0,184,212,0.5); box-shadow: 0 0 30px rgba(0,184,212,0.25); }
            .ptm-business .ptm-box { border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(4px); }
            .ptm-title { font-size: clamp(1.2rem, 4.5vw, 1.9rem); font-weight: 700; letter-spacing: 0.12em; margin: 0 0 1rem; line-height: 1.2; }
            .ptm-cyber .ptm-title { text-shadow: 0 0 14px rgba(0,255,136,0.7); }
            .ptm-electro .ptm-title { text-shadow: 0 0 14px rgba(0,184,212,0.7); }
            .ptm-status { min-height: 1.4em; font-size: 0.95rem; margin-bottom: 1rem; font-family: 'Share Tech Mono', 'Roboto Mono', monospace; }
            .ptm-business .ptm-status { font-family: 'Roboto', 'Segoe UI', sans-serif; }
            .ptm-cyber .ptm-status::after, .ptm-electro .ptm-status::after { content: '▌'; margin-left: 2px; animation: ptm-blink 0.8s steps(1) infinite; }
            .ptm-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.15); overflow: hidden; }
            .ptm-bar { height: 100%; width: 0%; border-radius: 3px; transition: width 180ms linear; }
            .ptm-cyber .ptm-bar { background: linear-gradient(90deg, #00ff88, #00d4ff); box-shadow: 0 0 12px #00ff88; }
            .ptm-electro .ptm-bar { background: linear-gradient(90deg, #00b8d4, #ff9800); box-shadow: 0 0 12px #00b8d4; }
            .ptm-business .ptm-bar { background: #fff; }
            .ptm-spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: ptm-spin 1s linear infinite; }
            @keyframes ptm-spin { to { transform: rotate(360deg); } }
            @keyframes ptm-blink { 50% { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    function loadThemeFonts(theme) {
        if (!theme.fontsUrl || document.querySelector(`link[href="${theme.fontsUrl}"]`)) return;
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = theme.fontsUrl;
        document.head.appendChild(l);
    }

    // ---------- Animations canvas ----------
    const ANIMATIONS = {
        // Pluie de caractères façon terminal
        cyber(ctx, w, h) {
            const size = 16;
            const cols = Math.ceil(w / size);
            const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -40));
            const chars = '01ABCDEF<>/{}[]$#%=+*ｱｲｳｴｵｶｷｸｹｺ';
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);
            return () => {
                ctx.fillStyle = 'rgba(5, 5, 5, 0.12)';
                ctx.fillRect(0, 0, w, h);
                ctx.font = size + 'px monospace';
                for (let i = 0; i < cols; i++) {
                    const ch = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillStyle = Math.random() > 0.96 ? '#00d4ff' : '#00ff88';
                    ctx.fillText(ch, i * size, drops[i] * size);
                    if (drops[i] * size > h && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                }
            };
        },

        // Pistes de circuit imprimé qui se dessinent
        electro(ctx, w, h) {
            const grid = 14;
            const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];
            const spawn = () => ({
                x: Math.round(Math.random() * w / grid) * grid,
                y: Math.round(Math.random() * h / grid) * grid,
                d: Math.floor(Math.random() * 4) * 1,
                life: 25 + Math.floor(Math.random() * 60),
                color: Math.random() > 0.8 ? '#ff9800' : '#00b8d4'
            });
            const walkers = Array.from({ length: 18 }, spawn);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, w, h);
            return () => {
                ctx.fillStyle = 'rgba(10, 10, 10, 0.045)';
                ctx.fillRect(0, 0, w, h);
                walkers.forEach((k, i) => {
                    const [dx, dy] = dirs[k.d];
                    const nx = k.x + dx * grid, ny = k.y + dy * grid;
                    ctx.strokeStyle = k.color;
                    ctx.lineWidth = 2;
                    ctx.shadowColor = k.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.moveTo(k.x, k.y);
                    ctx.lineTo(nx, ny);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    k.x = nx; k.y = ny; k.life--;
                    if (Math.random() < 0.18) {
                        // virage à 45° ou 90°
                        const turn = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.5 ? 1 : 2);
                        k.d = (k.d + turn + 8) % 8;
                    }
                    const out = k.x < 0 || k.y < 0 || k.x > w || k.y > h;
                    if (k.life <= 0 || out) {
                        // pastille de soudure au bout de la piste
                        ctx.fillStyle = k.color;
                        ctx.shadowColor = k.color;
                        ctx.shadowBlur = 12;
                        ctx.beginPath();
                        ctx.arc(k.x, k.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        walkers[i] = spawn();
                    }
                });
            };
        },

        // Histogramme qui monte + courbe de croissance
        business(ctx, w, h, t0) {
            const values = [0.35, 0.5, 0.45, 0.7, 0.6, 0.85, 0.75, 0.95, 1];
            const n = values.length;
            const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
            return () => {
                const t = performance.now() - t0;
                ctx.clearRect(0, 0, w, h);
                const baseY = h * 0.82;
                const maxH = h * 0.5;
                const slot = w / (n + 1);
                const bw = Math.min(46, slot * 0.55);
                const pts = [];
                values.forEach((v, i) => {
                    const g = ease((t - i * 110) / 800);
                    const bh = maxH * v * g;
                    const x = slot * (i + 1) - bw / 2;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
                    ctx.fillRect(x, baseY - bh, bw, bh);
                    pts.push([x + bw / 2, baseY - bh - 14 * g]);
                });
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.lineJoin = 'round';
                ctx.beginPath();
                pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
                ctx.stroke();
                ctx.fillStyle = '#e67e22';
                pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); });
            };
        }
    };

    // ---------- Overlay ----------
    class Overlay {
        constructor(info, arriving) {
            this.info = info;
            this.theme = THEMES[info.theme];
            this.themeKey = info.theme;
            this.arriving = arriving;
            this.statuses = this.theme.statuses(info.name);
            this.typeTimer = null;
            this.raf = null;
            this.build();
        }

        build() {
            const old = document.getElementById('ptm-overlay');
            if (old) old.remove();

            const el = document.createElement('div');
            el.id = 'ptm-overlay';
            el.className = 'ptm-' + this.themeKey;
            el.style.background = this.theme.bg;
            el.style.color = this.theme.text;
            el.style.fontFamily = this.theme.font;
            this.el = el;

            if (this.themeKey === 'default') {
                const sp = document.createElement('div');
                sp.className = 'ptm-spinner';
                el.appendChild(sp);
            } else {
                this.canvas = document.createElement('canvas');
                el.appendChild(this.canvas);

                const box = document.createElement('div');
                box.className = 'ptm-box';
                box.style.background = this.theme.panel;
                box.innerHTML = '<h2 class="ptm-title"></h2><div class="ptm-status"></div><div class="ptm-track"><div class="ptm-bar"></div></div>';
                box.querySelector('.ptm-title').textContent = this.info.name;
                el.appendChild(box);
                this.statusEl = box.querySelector('.ptm-status');
                this.barEl = box.querySelector('.ptm-bar');
            }
            document.body.appendChild(el);
            this.startCanvas();
        }

        startCanvas() {
            if (!this.canvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth, h = window.innerHeight;
            this.canvas.width = w * dpr;
            this.canvas.height = h * dpr;
            const ctx = this.canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            // À l'arrivée, l'histogramme est déjà "monté"
            const t0 = performance.now() - (this.arriving ? 4000 : 0);
            const frame = ANIMATIONS[this.themeKey](ctx, w, h, t0);
            const interval = this.themeKey === 'business' ? 0 : 45;
            let last = 0;
            const loop = (now) => {
                if (now - last >= interval) { frame(); last = now; }
                this.raf = requestAnimationFrame(loop);
            };
            this.raf = requestAnimationFrame(loop);
        }

        setProgress(p) {
            if (this.barEl) this.barEl.style.width = Math.round(p * 100) + '%';
        }

        setStatus(i) {
            if (!this.statusEl) return;
            const text = this.statuses[i] || '';
            clearInterval(this.typeTimer);
            if (REDUCED) { this.statusEl.textContent = text; return; }
            let n = 0;
            this.statusEl.textContent = '';
            this.typeTimer = setInterval(() => {
                n++;
                this.statusEl.textContent = text.slice(0, n);
                if (n >= text.length) clearInterval(this.typeTimer);
            }, 22);
        }

        showNow() { this.el.classList.add('ptm-on'); }

        async fadeIn() {
            void this.el.offsetHeight; // force le reflow
            this.el.classList.add('ptm-on');
            await sleep(this.themeKey === 'default' ? 300 : 350);
        }

        async reveal() {
            this.el.classList.remove('ptm-on');
            this.el.classList.add('ptm-reveal');
            await sleep(700);
            this.destroy();
        }

        destroy() {
            cancelAnimationFrame(this.raf);
            clearInterval(this.typeTimer);
            if (this.el && this.el.parentNode) this.el.remove();
        }
    }

    // ---------- Préchargement de la page cible ----------
    async function preload(url) {
        try {
            const res = await fetch(url.href, { credentials: 'same-origin' });
            if (!res.ok) return;
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const jobs = [];
            doc.querySelectorAll('link[rel="stylesheet"][href], script[src], img[src]').forEach(el => {
                const raw = el.getAttribute('href') || el.getAttribute('src');
                let abs;
                try { abs = new URL(raw, url.href); } catch (e) { return; }
                if (el.tagName === 'IMG') {
                    jobs.push(new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = abs.href; }));
                } else {
                    const same = abs.origin === window.location.origin;
                    jobs.push(fetch(abs.href, same ? { credentials: 'same-origin' } : { mode: 'no-cors' }).catch(() => {}));
                }
            });
            await Promise.all(jobs);
        } catch (e) { /* hors-ligne ou file:// : on se contente de l'animation */ }
    }

    // ---------- Gestionnaire ----------
    class TransitionManager {
        constructor() {
            this.isTransitioning = false;
            injectStyles();
            this.setupLinkInterception();
            this.handleArrival();
            this.preloadPages();

            window.addEventListener('pageshow', (e) => {
                if (e.persisted) {
                    this.isTransitioning = false;
                    const o = document.getElementById('ptm-overlay');
                    if (o) o.remove();
                }
            });
        }

        setupLinkInterception() {
            document.addEventListener('click', (e) => {
                if (e.defaultPrevented) return;
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

                const link = e.target.closest && e.target.closest('a');
                if (!link) return;

                const href = link.getAttribute('href');
                if (this.shouldIgnoreLink(link, href)) return;

                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return;
                if (url.pathname === window.location.pathname && url.search === window.location.search) return;

                e.preventDefault();
                this.startTransition(url);
            });
        }

        shouldIgnoreLink(link, href) {
            if (!href) return true;
            if (href.startsWith('#')) return true;
            if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return true;
            if (link.target === '_blank' || link.target === '_new') return true;
            if (link.hasAttribute('download')) return true;
            return false;
        }

        async startTransition(url) {
            if (this.isTransitioning) return;
            this.isTransitioning = true;

            const info = resolvePage(url.pathname);
            const theme = THEMES[info.theme];
            loadThemeFonts(theme);

            const overlay = new Overlay(info, false);
            overlay.setProgress(0);
            await overlay.fadeIn();
            overlay.setStatus(0);

            const minDuration = REDUCED ? 400 : theme.min;
            const t0 = performance.now();

            // Chargement de la page cible PENDANT l'animation
            let loaded = false;
            const loading = Promise.race([preload(url), sleep(6000)]).then(() => { loaded = true; });

            let stage = 0;
            const progressTimer = setInterval(() => {
                const elapsed = performance.now() - t0;
                const p = Math.min(0.92, (elapsed / minDuration) * 0.92);
                overlay.setProgress(p);
                if (stage === 0 && p > 0.35) { stage = 1; overlay.setStatus(1); }
            }, 60);

            await Promise.all([sleep(minDuration), loading]);
            clearInterval(progressTimer);

            overlay.setProgress(1);
            overlay.setStatus(2);
            await sleep(info.theme === 'default' ? 0 : 450);

            try { sessionStorage.setItem(FLAG, '1'); } catch (err) { /* ignoré */ }
            window.location.href = url.href;
        }

        // À l'arrivée : même animation, puis révélation de la page
        async handleArrival() {
            let arriving = false;
            try {
                arriving = sessionStorage.getItem(FLAG) === '1';
                sessionStorage.removeItem(FLAG);
            } catch (err) { /* ignoré */ }
            if (!arriving) return;

            const info = resolvePage(window.location.pathname);
            const overlay = new Overlay(info, true);
            overlay.el.style.transition = 'none';
            overlay.showNow();
            void overlay.el.offsetHeight;
            overlay.el.style.transition = '';
            overlay.setProgress(1);
            overlay.setStatus(2);

            const loadDone = document.readyState === 'complete'
                ? Promise.resolve()
                : new Promise(r => window.addEventListener('load', r, { once: true }));
            const fontsDone = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

            await Promise.race([
                Promise.all([loadDone, fontsDone]),
                sleep(4000)
            ]);
            await sleep(info.theme === 'default' ? 100 : 500);
            await overlay.reveal();
        }

        preloadPages() {
            [
                'index.html', 'projects.html', 'experiences.html',
                'projects/hack-ton-lycee.html', 'projects/quosi.html', 'projects/reflex.html',
                'experiences/clarins.html', 'experiences/cyber-experience.html'
            ].forEach(page => {
                const target = new URL(page, ROOT);
                if (target.pathname === window.location.pathname) return;
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = target.href;
                document.head.appendChild(link);
            });
        }
    }

    const start = () => { window.TransitionManager = new TransitionManager(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
