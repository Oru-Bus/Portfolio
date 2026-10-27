// ============================================
// TRANSITIONS MANAGER - Gestion des transitions entre pages
// ============================================

class TransitionManager {
    constructor() {
        this.currentTransition = null;
        this.isTransitioning = false;
        this.categoryTransitions = {
            // Catégories de projets
            'Cybersécurité': 'transition-cybersecurity',
            'Cybersecurite': 'transition-cybersecurity',
            'Cybersécurité': 'transition-cybersecurity',
            'Développement': 'transition-developpement',
            'Développement': 'transition-developpement',
            'Électronique': 'transition-electronique',
            'Electronique': 'transition-electronique',
            'Web Design': 'transition-webdesign',
            'Entrepreneuriat': 'transition-entrepreneuriat',
            
            // Expériences
            'SecureTech': 'transition-securetech',
            'SecureTech Solutions': 'transition-securetech',
            'TechInnov': 'transition-techinnov',
            'ElectroSystems': 'transition-electrosystems',
            'Ingénieur Cybersécurité': 'transition-securetech',
            'Développeur Full Stack': 'transition-techinnov',
            'Stagiaire en Électronique': 'transition-electrosystems'
        };
        
        this.transitionTypes = {
            'default': 'transition-cybersecurity',
            'home': 'page-zoom-in',
            'projects': 'page-slide-in-right',
            'experiences': 'page-slide-in-left'
        };
        
        this.init();
    }
    
    init() {
        // Créer l'overlay de transition
        this.createTransitionOverlay();
        
        // Intercepter les clics sur les liens
        this.setupLinkInterception();
        
        // Gérer le chargement initial de la page
        this.handlePageLoad();
        
        // Pré-charger les ressources
        this.preloadResources();
    }
    
    createTransitionOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'transition-overlay';
        this.overlay.innerHTML = '<div class="transition-loader"></div>';
        document.body.appendChild(this.overlay);
    }
    
    setupLinkInterception() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            const category = link.dataset.category || 
                           link.closest('[data-category]')?.dataset.category ||
                           this.getCategoryFromHref(href);
            
            // Ignorer les ancres, liens externes, etc.
            if (this.shouldIgnoreLink(link, href)) {
                return;
            }
            
            e.preventDefault();
            this.startTransition(link, href, category);
        });
    }
    
    shouldIgnoreLink(link, href) {
        // Ignorer les liens avec target=_blank
        if (link.target === '_blank' || link.target === '_new') {
            return true;
        }
        
        // Ignorer les ancres
        if (!href || href.startsWith('#')) {
            return true;
        }
        
        // Ignorer les liens externes
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return true;
        }
        
        // Ignorer les liens mailto, tel, etc.
        if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
            return true;
        }
        
        return false;
    }
    
    getCategoryFromHref(href) {
        // Extraire la catégorie à partir de l'URL
        if (href.includes('cyber') || href.includes('ctf') || href.includes('secure')) {
            return 'Cybersécurité';
        }
        if (href.includes('electronique') || href.includes('esp32') || href.includes('electro')) {
            return 'Électronique';
        }
        if (href.includes('developpement') || href.includes('gestionpro')) {
            return 'Développement';
        }
        if (href.includes('web-design') || href.includes('portfolio')) {
            return 'Web Design';
        }
        if (href.includes('entrepreneuriat')) {
            return 'Entrepreneuriat';
        }
        return null;
    }
    
    startTransition(link, href, category) {
        if (this.isTransitioning) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Déterminer le type de transition
        const transitionClass = this.getTransitionClass(category);
        
        // Appliquer la transition
        this.applyTransition(transitionClass, () => {
            window.location.href = href;
        });
    }
    
    getTransitionClass(category) {
        if (category && this.categoryTransitions[category]) {
            return this.categoryTransitions[category];
        }
        return this.transitionTypes['default'];
    }
    
    applyTransition(transitionClass, callback) {
        // Nettoyer les classes précédentes
        this.overlay.className = 'transition-overlay';
        
        // Ajouter la classe de transition spécifique
        this.overlay.classList.add(transitionClass);
        
        // Activer l'overlay
        this.overlay.classList.add('active');
        
        // Attendre la fin de l'animation avant de naviguer
        setTimeout(() => {
            this.overlay.classList.remove('active');
            this.isTransitioning = false;
            callback();
        }, 1000); // Durée de la transition
    }
    
    handlePageLoad() {
        // Appliquer un effet d'apparition au chargement
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 50);
        
        // Ajouter une classe pour indiquer que la page est chargée
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 600);
    }
    
    preloadResources() {
        // Pré-charger les images et ressources communes
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.dataset.src;
            if (src) {
                const preloadImg = new Image();
                preloadImg.src = src;
            }
        });
        
        // Pré-charger les pages liées
        const links = document.querySelectorAll('a[href^="projects/"], a[href^="experiences/"], a[href="projects.html"], a[href="experiences.html"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // Utiliser fetch pour pré-charger les pages
                fetch(href, { method: 'HEAD' }).catch(() => {});
            }
        });
    }
    
    // Méthode pour déclencher une transition spécifique
    triggerTransition(category) {
        const transitionClass = this.getTransitionClass(category);
        this.applyTransition(transitionClass, () => {});
    }
}

// ============================================
// EFFETS DE SCROLL AMÉLIORÉS
// ============================================

class ScrollEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Effets de scroll fluides
        this.setupSmoothScroll();
        
        // Animations au scroll
        this.setupScrollAnimations();
        
        // Parallax pour les héros
        this.setupParallax();
    }
    
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    
                    // Déclencher des animations personnalisées selon la catégorie
                    const category = entry.target.dataset.category;
                    if (category) {
                        this.applyCategoryAnimation(entry.target, category);
                    }
                }
            });
        }, observerOptions);
        
        // Observer tous les éléments avec classe animate-*
        document.querySelectorAll('.animate-fadeInUp, .card, .project-card, .experience-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    applyCategoryAnimation(element, category) {
        // Animations spécifiques par catégorie
        switch(category.toLowerCase()) {
            case 'cybersécurité':
            case 'cybersecurite':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards, glow-cyber 2s ease-in-out infinite';
                break;
            case 'développement':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards, slideFromLeft 0.8s ease-out';
                break;
            case 'électronique':
            case 'electronique':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards, pulse-electronic 1.5s ease-in-out infinite';
                break;
            case 'web design':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards, gradient-shift 3s ease infinite';
                break;
            case 'entrepreneuriat':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards, bounce 0.5s ease';
                break;
            default:
                element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    }
    
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.page-header, .hero');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallaxSpeed || 0.5;
                el.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
}

// ============================================
// GESTIONNAIRE DE CACHE POUR LES PAGES
// ============================================

class PageCache {
    constructor() {
        this.cache = new Map();
        this.init();
    }
    
    init() {
        // Écouter les événements de navigation
        window.addEventListener('popstate', () => {
            this.handleNavigation();
        });
    }
    
    cachePage(url, content) {
        this.cache.set(url, {
            content: content,
            timestamp: Date.now()
        });
    }
    
    getCachedPage(url) {
        const cached = this.cache.get(url);
        if (cached && (Date.now() - cached.timestamp) < 300000) { // 5 minutes
            return cached.content;
        }
        return null;
    }
    
    handleNavigation() {
        // Gérer la navigation via les boutons avant/arrière
        const currentUrl = window.location.pathname;
        const cachedContent = this.getCachedPage(currentUrl);
        
        if (cachedContent) {
            // Remplacer le contenu avec la version cache
            document.documentElement.innerHTML = cachedContent;
        }
    }
}

// ============================================
// INITIALISATION
// ============================================

// Initialiser les managers quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le gestionnaire de transitions
    const transitionManager = new TransitionManager();
    
    // Initialiser les effets de scroll
    const scrollEffects = new ScrollEffects();
    
    // Initialiser le cache de pages
    const pageCache = new PageCache();
    
    // Exposer les instances pour accès global
    window.TransitionManager = transitionManager;
    window.ScrollEffects = scrollEffects;
    window.PageCache = pageCache;
    
    // Ajouter des classes utilitaires
    document.body.classList.add('transition-enabled');
});

// Améliorer la navigation avec pré-chargement
window.addEventListener('load', () => {
    // Pré-charger les pages principales
    const mainPages = ['index.html', 'projects.html', 'experiences.html'];
    mainPages.forEach(page => {
        if (!window.location.pathname.includes(page)) {
            fetch(page, { method: 'HEAD' }).catch(() => {});
        }
    });
    
    // Ajouter un indicateur de chargement
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'progress-bar-container';
    loadingIndicator.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(loadingIndicator);
    
    // Animer la barre de progression
    const progressBar = loadingIndicator.querySelector('.progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.remove();
                }, 300);
            }, 200);
        }
        progressBar.style.width = `${progress}%`;
    }, 100);
});

// Gérer les erreurs de chargement d'images
window.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };
        
        // Forcer le déclenchement si l'image n'existe pas localement
        if (!img.complete && img.src.includes('images/')) {
            const originalSrc = img.src;
            img.src = originalSrc;
        }
    });
});

// Exporter pour utilisation dans main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TransitionManager, ScrollEffects, PageCache };
}
