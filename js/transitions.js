// ============================================
// TRANSITIONS.JS - Transitions de page immersives, une ambiance par thème
//  - cyber      : pluie de code "Matrix", titre glitché, extinction CRT
//  - electronic : circuits imprimés qui se tracent, boot sequence, iris
//  - dev        : symboles de code, fenêtre de terminal, slide
//  - default    : fondu simple (pages de navigation)
// Le thème est déduit de la page de destination (ou de data-theme sur le lien).
// ============================================
(function () {
    'use strict';

    const STORAGE_KEY = 'pt-arrival';
    const HOLD_MS = 350;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scriptSrc = document.currentScript && document.currentScript.src;

    // ---------- Thèmes ----------
    const THEMES = {
        cyber: {
            title: 'ACCESS GRANTED',
            scene: 'matrix',
            leave: 1400,
            vars: { '--pt-bg': '#010805', '--pt-color': '#00ff88', '--pt-accent': '#00d4ff', '--pt-alert': '#ff0055', '--pt-glow': 'rgba(0,255,136,.45)' },
            lines: [
                '> init secure_channel --tls1.3',
                '> scanning open ports ........ OK',
                '> bypassing firewall ......... OK',
                '> decrypting payload ......... OK',
                '> mounting /{name}'
            ]
        },
        electronic: {
            title: 'POWER ON',
            scene: 'circuit',
            leave: 1300,
            vars: { '--pt-bg': '#03100f', '--pt-color': '#00b8d4', '--pt-accent': '#ff9800', '--pt-alert': '#ff9800', '--pt-glow': 'rgba(0,184,212,.45)' },
            lines: [
                '[ OK ] VCC 3.3V stable',
                '[ OK ] GPIO / I2C / SPI init',
                '[ OK ] WiFi + BLE radio ready',
                '[ OK ] sensors calibrated',
                '[ >> ] flashing firmware: {name}'
            ]
        },
        dev: {
            title: 'npm run dev',
            scene: 'symbols',
            leave: 1300,
            vars: { '--pt-bg': '#0b1626', '--pt-color': '#4a90e2', '--pt-accent': '#e67e22', '--pt-alert': '#e67e22', '--pt-glow': 'rgba(74,144,226,.45)' },
            lines: [
                '$ npm install',
                '✔ dependencies resolved',
                '✔ components compiled',
                '✔ API connected (200 OK)',
                '→ serving {name} on localhost:3000'
            ]
        },
        default: {
            title: '',
            scene: null,
            leave: 450,
            vars: { '--pt-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '--pt-color': '#ffffff', '--pt-accent': '#ffffff', '--pt-alert': '#ffffff', '--pt-glow': 'rgba(255,255,255,.3)' },
            lines: []
        }
    };

    // ---------- Détection du thème ----------
    function themeFor(url, link) {
        if (link && link.dataset && THEMES[link.dataset.theme]) return link.dataset.theme;
        const parts = url.pathname.toLowerCase().split('/').filter(Boolean);
        const file = parts[parts.length - 1] || '';
        const dir = parts[parts.length - 2] || '';
        if (dir !== 'projects' && dir !== 'experiences') return 'default';
        if (/ctf|secure|cyber/.test(file)) return 'cyber';
        if (/esp32|electro|domotique/.test(file)) return 'electronic';
        if (/gestionpro|techinnov|dev|web/.test(file)) return 'dev';
        return 'default';
    }

    function labelFrom(url) {
        const file = url.pathname.split('/').pop() || 'index';
        return file.replace(/\.html$/i, '').replace(/^experience-/, '');
    }

    // ---------- Styles ----------
    function injectStyles() {
        const css = `
#pt-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;display:none;overflow:hidden;background:var(--pt-bg);color:var(--pt-color);font-family:'Share Tech Mono','Roboto Mono',ui-monospace,Consolas,monospace;pointer-events:all}
#pt-overlay.pt-visible{display:block}
#pt-overlay canvas{position:absolute;top:0;left:0;width:100%;height:100%}
#pt-overlay .pt-content{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.4rem;padding:2rem}
#pt-overlay .pt-title{position:relative;font-size:clamp(1.6rem,5vw,3rem);font-weight:700;letter-spacing:.14em;text-shadow:0 0 18px var(--pt-color)}
#pt-overlay .pt-log{width:min(560px,90vw);min-height:8.5em;font-size:.95rem;line-height:1.7;text-align:left}
#pt-overlay .pt-log div{opacity:0;transform:translateX(-8px);animation:pt-line .25s ease forwards}
#pt-overlay .pt-bar{position:relative;width:min(560px,90vw);height:8px;border:1px solid var(--pt-color);border-radius:3px;overflow:hidden;box-shadow:0 0 14px var(--pt-glow)}
#pt-overlay .pt-bar span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--pt-color),var(--pt-accent));box-shadow:0 0 10px var(--pt-color)}
#pt-overlay.pt-run .pt-bar span{animation:pt-fill var(--pt-dur,1s) linear forwards}
#pt-overlay.pt-done .pt-bar span{width:100%;animation:none}
#pt-overlay.pt-done .pt-log div{animation:none;opacity:1;transform:none}
#pt-overlay .pt-spinner{display:none;width:52px;height:52px;border:4px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:pt-spin 1s linear infinite}
@keyframes pt-line{to{opacity:1;transform:none}}
@keyframes pt-fill{to{width:100%}}
@keyframes pt-spin{to{transform:rotate(360deg)}}

/* default */
#pt-overlay.pt-theme-default .pt-spinner{display:block}
#pt-overlay.pt-theme-default .pt-title,#pt-overlay.pt-theme-default .pt-log,#pt-overlay.pt-theme-default .pt-bar{display:none}

/* cyber */
#pt-overlay.pt-theme-cyber:after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 2px,rgba(0,255,136,.06) 3px)}
.pt-theme-cyber .pt-content{background:radial-gradient(ellipse at center,rgba(1,8,5,.82) 0%,rgba(1,8,5,.35) 70%,transparent 100%)}
.pt-theme-cyber .pt-title:before,.pt-theme-cyber .pt-title:after{content:attr(data-text);position:absolute;left:0;top:0;width:100%}
.pt-theme-cyber .pt-title:before{color:var(--pt-alert);clip-path:inset(0 0 55% 0);animation:pt-glitch 1.1s steps(2,end) infinite}
.pt-theme-cyber .pt-title:after{color:var(--pt-accent);clip-path:inset(55% 0 0 0);animation:pt-glitch .9s steps(2,end) infinite reverse}
@keyframes pt-glitch{0%{transform:translate(-3px,0)}25%{transform:translate(4px,-1px)}50%{transform:translate(-2px,1px)}75%{transform:translate(3px,0)}100%{transform:translate(-4px,1px)}}

/* electronic */
.pt-theme-electronic .pt-content{background:radial-gradient(ellipse at center,rgba(3,16,15,.85) 0%,rgba(3,16,15,.3) 70%,transparent 100%)}
.pt-theme-electronic .pt-bar:after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:repeating-linear-gradient(90deg,transparent 0,transparent 10px,var(--pt-bg) 10px,var(--pt-bg) 12px)}

/* dev */
.pt-theme-dev .pt-log{position:relative;background:rgba(8,20,36,.88);border:1px solid rgba(74,144,226,.5);border-radius:10px;padding:2.4rem 1.2rem 1rem;box-shadow:0 10px 40px rgba(0,0,0,.4)}
.pt-theme-dev .pt-log:before{content:'';position:absolute;top:12px;left:14px;width:10px;height:10px;border-radius:50%;background:#ff5f56;box-shadow:18px 0 #ffbd2e,36px 0 #27c93f}
.pt-theme-dev .pt-title{text-shadow:0 0 14px var(--pt-glow);letter-spacing:.05em}

/* entrées */
#pt-overlay.pt-in-cyber{animation:pt-cyber-in .4s steps(6,end) both}
#pt-overlay.pt-in-electronic{animation:pt-iris-in .55s cubic-bezier(.7,0,.2,1) both}
#pt-overlay.pt-in-dev{animation:pt-slide-in .5s cubic-bezier(.7,0,.2,1) both}
#pt-overlay.pt-in-default{animation:pt-fade-in .3s ease both}
@keyframes pt-cyber-in{0%{opacity:0}20%{opacity:1}30%{opacity:.2}50%{opacity:1}60%{opacity:.4}100%{opacity:1}}
@keyframes pt-iris-in{from{clip-path:circle(0% at var(--pt-x,50%) var(--pt-y,50%))}to{clip-path:circle(150% at var(--pt-x,50%) var(--pt-y,50%))}}
@keyframes pt-slide-in{from{transform:translateX(100%)}to{transform:none}}
@keyframes pt-fade-in{from{opacity:0}to{opacity:1}}

/* sorties (à l'arrivée sur la nouvelle page) */
#pt-overlay.pt-out-cyber{animation:pt-crt-off .65s ease-in both}
#pt-overlay.pt-out-electronic{animation:pt-iris-out .7s cubic-bezier(.7,0,.2,1) both}
#pt-overlay.pt-out-dev{animation:pt-slide-out .6s cubic-bezier(.7,0,.2,1) both}
#pt-overlay.pt-out-default{animation:pt-fade-out .35s ease both}
@keyframes pt-crt-off{0%{transform:scale(1,1);filter:brightness(1)}55%{transform:scale(1,.01);filter:brightness(4)}100%{transform:scale(0,.01);filter:brightness(4);opacity:0}}
@keyframes pt-iris-out{from{clip-path:circle(150% at 50% 50%)}to{clip-path:circle(0% at 50% 50%)}}
@keyframes pt-slide-out{from{transform:none}to{transform:translateY(-100%)}}
@keyframes pt-fade-out{from{opacity:1}to{opacity:0}}

@media (prefers-reduced-motion: reduce){
  #pt-overlay,#pt-overlay *{animation-duration:.01ms!important;animation-delay:0s!important}
}
`;
        const style = document.createElement('style');
        style.id = 'pt-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ---------- Scènes canvas ----------
    function matrixScene(S) {
        const glyphs = '01アイウエオカキクケコサシスセソ{}[]<>/$#%&=+*'.split('');
        const size = 16 * S.dpr;
        let drops = [];
        let tick = 0;
        function init() {
            drops = Array.from({ length: Math.ceil(S.w / size) }, () => -Math.random() * 40);
            S.ctx.fillStyle = S.bg;
            S.ctx.fillRect(0, 0, S.w, S.h);
        }
        init();
        return {
            resize: init,
            frame() {
                if (++tick % 2) return;
                const c = S.ctx;
                c.fillStyle = 'rgba(1,8,5,0.14)';
                c.fillRect(0, 0, S.w, S.h);
                c.font = size + 'px monospace';
                for (let i = 0; i < drops.length; i++) {
                    if (drops[i] > 0) {
                        c.fillStyle = Math.random() > 0.97 ? '#e6fff4' : '#00ff88';
                        c.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * size, drops[i] * size);
                    }
                    if (drops[i] * size > S.h && Math.random() > 0.96) drops[i] = 0;
                    drops[i] += 1;
                }
            }
        };
    }

    function circuitScene(S) {
        const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let traces = [];

        function init() {
            const g = 30 * S.dpr;
            const cols = Math.floor(S.w / g);
            const rows = Math.floor(S.h / g);
            const count = Math.max(16, Math.floor((cols * rows) / 90));
            traces = [];
            for (let i = 0; i < count; i++) {
                let x = (Math.random() * cols) | 0;
                let y = (Math.random() * rows) | 0;
                let dir = (Math.random() * 4) | 0;
                const pts = [[x * g, y * g]];
                const segs = 3 + ((Math.random() * 5) | 0);
                for (let s = 0; s < segs; s++) {
                    const len = 2 + ((Math.random() * 6) | 0);
                    x = Math.max(0, Math.min(cols, x + DIRS[dir][0] * len));
                    y = Math.max(0, Math.min(rows, y + DIRS[dir][1] * len));
                    pts.push([x * g, y * g]);
                    dir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
                }
                const lens = [];
                let total = 0;
                for (let k = 1; k < pts.length; k++) {
                    const l = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
                    lens.push(l);
                    total += l;
                }
                if (total > 0) traces.push({ pts, lens, total, p: -Math.random() * 0.8, speed: 0.008 + Math.random() * 0.01 });
            }
        }
        init();

        // Trace le chemin jusqu'à la distance d et renvoie la position de la "tête"
        function pathTo(c, t, d) {
            c.beginPath();
            c.moveTo(t.pts[0][0], t.pts[0][1]);
            let acc = 0;
            let head = t.pts[0];
            for (let i = 1; i < t.pts.length; i++) {
                const l = t.lens[i - 1];
                if (acc + l <= d) {
                    c.lineTo(t.pts[i][0], t.pts[i][1]);
                    acc += l;
                    head = t.pts[i];
                } else {
                    const f = l ? (d - acc) / l : 0;
                    head = [t.pts[i - 1][0] + (t.pts[i][0] - t.pts[i - 1][0]) * f, t.pts[i - 1][1] + (t.pts[i][1] - t.pts[i - 1][1]) * f];
                    c.lineTo(head[0], head[1]);
                    break;
                }
            }
            return head;
        }

        function dot(c, p, r, color, blur) {
            c.save();
            c.shadowColor = color;
            c.shadowBlur = blur;
            c.fillStyle = color;
            c.beginPath();
            c.arc(p[0], p[1], r, 0, 6.2832);
            c.fill();
            c.restore();
        }

        return {
            resize: init,
            frame() {
                const c = S.ctx;
                c.fillStyle = S.bg;
                c.fillRect(0, 0, S.w, S.h);
                c.lineCap = 'round';
                c.lineJoin = 'round';
                for (const t of traces) {
                    t.p += t.speed;
                    const prog = Math.min(1, t.p);
                    if (prog <= 0) continue;
                    c.strokeStyle = 'rgba(0,184,212,0.45)';
                    c.lineWidth = 2 * S.dpr;
                    const head = pathTo(c, t, t.total * prog);
                    c.stroke();
                    dot(c, t.pts[0], 3.5 * S.dpr, 'rgba(0,184,212,0.9)', 0);
                    if (prog < 1) {
                        dot(c, head, 4 * S.dpr, '#00e5ff', 14 * S.dpr);
                    } else {
                        dot(c, t.pts[t.pts.length - 1], 3.5 * S.dpr, 'rgba(0,184,212,0.9)', 0);
                        const pulse = pathTo(c, t, (((t.p - 1) * 0.7) % 1) * t.total);
                        dot(c, pulse, 3 * S.dpr, '#ffb74d', 12 * S.dpr);
                    }
                }
            }
        };
    }

    function symbolsScene(S) {
        const glyphs = ['{ }', '</>', '( )', '=>', '[ ]', '&&', '//', '0x', 'fn', 'git', 'npm', '::'];
        let items = [];
        function spawn(anywhere) {
            return {
                x: Math.random() * S.w,
                y: anywhere ? Math.random() * S.h : S.h + 30,
                s: (12 + Math.random() * 20) * S.dpr,
                v: (0.4 + Math.random() * 1.2) * S.dpr,
                g: glyphs[(Math.random() * glyphs.length) | 0],
                a: 0.08 + Math.random() * 0.3
            };
        }
        function init() {
            items = Array.from({ length: 46 }, () => spawn(true));
        }
        init();
        return {
            resize: init,
            frame() {
                const c = S.ctx;
                c.fillStyle = S.bg;
                c.fillRect(0, 0, S.w, S.h);
                for (const it of items) {
                    it.y -= it.v;
                    if (it.y < -40) Object.assign(it, spawn(false));
                    c.font = it.s + 'px monospace';
                    c.fillStyle = 'rgba(74,144,226,' + it.a + ')';
                    c.fillText(it.g, it.x, it.y);
                }
            }
        };
    }

    const SCENES = { matrix: matrixScene, circuit: circuitScene, symbols: symbolsScene };

    // ---------- Overlay ----------
    let el = null, canvas = null, titleEl = null, logEl = null;
    let stopRunning = null;
    let busy = false;
    let renderedPath = window.location.pathname; // chemin de la page actuellement affichée

    function ensureOverlay() {
        if (el) return;
        injectStyles();
        el = document.createElement('div');
        el.id = 'pt-overlay';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<canvas></canvas><div class="pt-content"><div class="pt-spinner"></div><div class="pt-title"></div><div class="pt-log"></div><div class="pt-bar"><span></span></div></div>';
        document.body.appendChild(el);
        canvas = el.querySelector('canvas');
        titleEl = el.querySelector('.pt-title');
        logEl = el.querySelector('.pt-log');
    }

    function stopScene() {
        if (stopRunning) {
            stopRunning();
            stopRunning = null;
        }
    }

    function startScene(name, bg) {
        stopScene();
        const factory = SCENES[name];
        if (!factory || reduceMotion) {
            canvas.style.display = 'none';
            return;
        }
        canvas.style.display = 'block';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const S = { ctx: canvas.getContext('2d'), w: 0, h: 0, dpr, bg };
        const fit = () => {
            S.w = canvas.width = Math.floor(window.innerWidth * dpr);
            S.h = canvas.height = Math.floor(window.innerHeight * dpr);
        };
        fit();
        const scene = factory(S);
        let raf = 0;
        const loop = () => {
            scene.frame();
            raf = requestAnimationFrame(loop);
        };
        const onResize = () => {
            fit();
            scene.resize();
        };
        window.addEventListener('resize', onResize);
        raf = requestAnimationFrame(loop);
        stopRunning = () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
        };
    }

    // state : 'in' (on quitte la page) ou 'done' (on arrive, tout est déjà chargé)
    function show(key, name, state, x, y) {
        const t = THEMES[key] || THEMES.default;
        ensureOverlay();
        Object.keys(t.vars).forEach(k => el.style.setProperty(k, t.vars[k]));
        el.style.setProperty('--pt-x', x);
        el.style.setProperty('--pt-y', y);
        el.style.setProperty('--pt-dur', Math.max(t.leave - 350, 200) + 'ms');
        titleEl.textContent = t.title;
        titleEl.setAttribute('data-text', t.title);
        logEl.textContent = '';
        const step = (t.leave - 500) / Math.max(t.lines.length, 1);
        t.lines.forEach((line, i) => {
            const d = document.createElement('div');
            d.textContent = line.replace('{name}', name);
            d.style.animationDelay = Math.round(250 + i * step * 0.8) + 'ms';
            logEl.appendChild(d);
        });
        el.className = 'pt-visible pt-theme-' + key + ' ' + (state === 'in' ? 'pt-in-' + key + ' pt-run' : 'pt-done');
        startScene(t.scene, t.vars['--pt-bg']);
    }

    function dismiss(key) {
        if (!el || !el.classList.contains('pt-visible')) return;
        const done = () => {
            stopScene();
            el.className = '';
            busy = false;
        };
        if (reduceMotion) {
            done();
            return;
        }
        el.classList.remove('pt-in-' + key);
        el.classList.add('pt-out-' + key);
        let finished = false;
        const fin = () => {
            if (finished) return;
            finished = true;
            el.removeEventListener('animationend', onEnd);
            done();
        };
        const onEnd = e => {
            if (e.target === el) fin();
        };
        el.addEventListener('animationend', onEnd);
        setTimeout(fin, 1200);
    }

    // ---------- Départ ----------
    function leave(url, key, e) {
        busy = true;
        const t = THEMES[key];
        const name = labelFrom(url);
        const x = e && e.clientX ? e.clientX + 'px' : '50%';
        const y = e && e.clientY ? e.clientY + 'px' : '50%';

        // 1) L'animation démarre sur la page actuelle
        show(key, name, 'in', x, y);

        // 2) Pendant l'animation, on charge la page suivante en arrière-plan
        const canSwap = window.location.protocol !== 'file:' && window.fetch && window.history && history.pushState;
        const pageReq = canSwap ? fetchPage(url).catch(() => null) : Promise.resolve(null);
        const minWait = new Promise(resolve => setTimeout(resolve, reduceMotion ? 150 : t.leave));

        // 3) À la fin de l'animation (et une fois la page chargée), on remplace le contenu
        //    derrière l'overlay, puis on le retire : la page apparaît déjà prête.
        Promise.all([minWait, pageReq])
            .then(results => {
                if (!results[1]) return false;
                return swapPage(url, results[1]).then(() => {
                    dismiss(key);
                    return true;
                });
            })
            .catch(() => false)
            .then(done => {
                if (!done) fallbackNavigate(url, key, name);
            });
    }

    function fetchPage(url) {
        return fetch(url.href, { credentials: 'same-origin' })
            .then(r => {
                if (!r.ok) throw new Error('http ' + r.status);
                return r.text();
            })
            .then(html => new DOMParser().parseFromString(html, 'text/html'));
    }

    function waitMax(promise, ms) {
        return Promise.race([promise, new Promise(resolve => setTimeout(resolve, ms))]);
    }

    // Remplace le <head> (styles) et le <body> de la page par ceux de `doc`, sans rechargement
    function swapPage(url, doc) {
        // L'URL change d'abord : les chemins relatifs du nouveau contenu se résolvent ensuite
        // par rapport à la nouvelle page (ex. ../css/global.css dans un sous-dossier).
        history.pushState({ pt: true }, '', url.href);
        renderedPath = window.location.pathname;
        if (doc.title) document.title = doc.title;

        const SHEETS = 'link[rel="stylesheet"], style';
        const oldSheets = Array.from(document.head.querySelectorAll(SHEETS)).filter(n => n.id !== 'pt-styles');
        const keep = new Set();
        const loads = [];

        Array.from(doc.head.querySelectorAll(SHEETS)).forEach(n => {
            if (n.tagName === 'LINK') {
                const abs = new URL(n.getAttribute('href'), url.href).href;
                const same = oldSheets.find(o => o.tagName === 'LINK' && o.href === abs);
                if (same) {
                    keep.add(same);
                    return;
                }
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                loads.push(new Promise(resolve => {
                    link.onload = resolve;
                    link.onerror = resolve;
                }));
                link.href = abs;
                document.head.appendChild(link);
            } else {
                const style = document.createElement('style');
                style.textContent = n.textContent;
                document.head.appendChild(style);
            }
        });

        return waitMax(Promise.all(loads), 2500).then(() => {
            oldSheets.forEach(o => {
                if (!keep.has(o)) o.remove();
            });

            // Contenu : on garde uniquement l'overlay
            Array.from(document.body.childNodes).forEach(n => {
                if (n !== el) n.remove();
            });
            const frag = document.createDocumentFragment();
            Array.from(doc.body.childNodes).forEach(n => frag.appendChild(document.importNode(n, true)));
            frag.querySelectorAll('script').forEach(s => s.remove());
            document.body.insertBefore(frag, el);
            document.body.className = doc.body.className;

            // Défilement (ancre éventuelle, sans animation)
            const root = document.documentElement;
            root.style.scrollBehavior = 'auto';
            const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
            if (target) target.scrollIntoView();
            else window.scrollTo(0, 0);
            root.style.scrollBehavior = '';

            // Réinitialise les scripts de la page (menu, projets, images...)
            if (typeof window.initPage === 'function') window.initPage();

            // On attend les images visibles et les polices (avec une limite de temps)
            const pending = Array.from(document.images).filter(i => !i.complete && i.getBoundingClientRect().top < window.innerHeight);
            const imgs = Promise.all(pending.map(i => new Promise(resolve => {
                i.addEventListener('load', resolve);
                i.addEventListener('error', resolve);
            })));
            return waitMax(Promise.all([imgs, document.fonts ? document.fonts.ready : null]), 1500);
        });
    }

    // Plan B (file://, erreur réseau...) : l'animation a joué, on navigue normalement
    function fallbackNavigate(url, key, name) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ key, name, t: Date.now() }));
        } catch (err) { /* ignore */ }
        window.location.href = url.href;
    }

    function onClick(e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const link = e.target.closest && e.target.closest('a[href]');
        if (!link) return;
        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;
        const href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#') return;
        let url;
        try {
            url = new URL(link.href, window.location.href);
        } catch (err) {
            return;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:' && url.protocol !== 'file:') return;
        if (url.protocol !== window.location.protocol || url.host !== window.location.host) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
        e.preventDefault();
        if (busy) return;
        leave(url, themeFor(url, link), e);
    }

    // ---------- Arrivée ----------
    function arrive() {
        let data = null;
        try {
            data = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (err) { data = null; }
        if (!data || !THEMES[data.key] || Date.now() - data.t > 10000) return;
        // Plan B uniquement : l'animation a déjà joué sur l'ancienne page, on la montre
        // à l'état final jusqu'au chargement de la page, puis on la retire.
        busy = true;
        show(data.key, data.name, 'done', '50%', '50%');
        let fired = false;
        const go = () => {
            if (fired) return;
            fired = true;
            setTimeout(() => dismiss(data.key), reduceMotion ? 0 : (data.key === 'default' ? 0 : HOLD_MS));
        };
        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go);
        setTimeout(go, 3000);
    }

    // ---------- Préchargement ----------
    function prefetch() {
        if (!scriptSrc) return;
        const root = new URL('../', scriptSrc);
        [
            'index.html', 'projects.html', 'experiences.html',
            'projects/ctf-challenge.html', 'projects/gestionpro.html', 'projects/esp32-automation.html',
            'experiences/experience-securetech.html', 'experiences/experience-techinnov.html', 'experiences/experience-electrosystems.html'
        ].forEach(p => {
            const u = new URL(p, root);
            if (u.pathname === window.location.pathname) return;
            const l = document.createElement('link');
            l.rel = 'prefetch';
            l.href = u.href;
            document.head.appendChild(l);
        });
    }

    // ---------- Init ----------
    document.addEventListener('click', onClick);

    // Retour / avant du navigateur : le contenu a été remplacé sans rechargement,
    // on recharge simplement la page correspondant à l'URL
    window.addEventListener('popstate', () => {
        // (les simples ancres #... déclenchent aussi popstate : on les ignore)
        if (window.location.pathname !== renderedPath) window.location.reload();
    });

    // Retour arrière (bfcache) : on ne doit pas rester bloqué sous l'overlay
    window.addEventListener('pageshow', e => {
        if (e.persisted) {
            busy = false;
            if (el) {
                stopScene();
                el.className = '';
            }
        }
    });

    function init() {
        arrive();
        prefetch();
    }
    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init);
})();
