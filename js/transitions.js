// ============================================
// TRANSITIONS MANAGER - Gestion des transitions fluides entre pages
// ============================================

class TransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 400; // ms
        this.init();
    }
    
    init() {
        // Créer l'overlay de transition
        this.createOverlay();
        
        // Intercepter les clics sur les liens
        this.setupLinkInterception();
        
        // Gérer le chargement initial
        this.handleInitialLoad();
        
        // Pré-charger les pages
        this.preloadPages();
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'page-transition-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity ${this.transitionDuration}ms ease-in-out;
        `;
        
        this.loader = document.createElement('div');
        this.loader.style.cssText = `
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        this.overlay.appendChild(this.loader);
        document.body.appendChild(this.overlay);
        
        // Ajouter le keyframe pour le spin
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupLinkInterception() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Ignorer les ancres, liens externes, etc.
            if (this.shouldIgnoreLink(link, href)) {
                return;
            }
            
            e.preventDefault();
            this.startTransition(href);
        });
    }
    
    shouldIgnoreLink(link, href) {
        if (!href) return true;
        if (href.startsWith('#')) return true;
        if (href.startsWith('http')) return true;
        if (href.startsWith('mailto:')) return true;
        if (href.startsWith('tel:')) return true;
        if (href.startsWith('javascript:')) return true;
        if (link.target === '_blank' || link.target === '_new') return true;
        return false;
    }
    
    startTransition(href) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Activer l'overlay
        this.overlay.style.opacity = '1';
        this.overlay.style.pointerEvents = 'all';
        
        // Attendre que l'overlay soit visible
        setTimeout(() => {
            // Changer la couleur de fond selon la page destination
            this.updateOverlayColor(href);
            
            // Naviguer après un délai
            setTimeout(() => {
                window.location.href = href;
            }, this.transitionDuration);
        }, 50);
    }
    
    updateOverlayColor(href) {
        // Déterminer la couleur selon la page destination
        if (href.includes('cyber') || href.includes('ctf') || href.includes('secure')) {
            this.overlay.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
            this.loader.style.borderTopColor = '#00ff88';
            this.loader.style.borderRightColor = '#00d4ff';
        } else if (href.includes('electronique') || href.includes('esp32') || href.includes('electro')) {
            this.overlay.style.background = 'linear-gradient(135deg, #00b8d4 0%, #009688 100%)';
            this.loader.style.borderTopColor = '#00b8d4';
            this.loader.style.borderRightColor = '#009688';
        } else if (href.includes('developpement') || href.includes('gestionpro')) {
            this.overlay.style.background = 'linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)';
            this.loader.style.borderTopColor = '#2c5aa0';
            this.loader.style.borderRightColor = '#4a90e2';
        } else if (href.includes('experience')) {
            this.overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.loader.style.borderTopColor = '#667eea';
            this.loader.style.borderRightColor = '#764ba2';
        } else {
            this.overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.loader.style.borderTopColor = '#667eea';
        }
    }
    
    handleInitialLoad() {
        // Supprimer l'overlay au chargement initial
        setTimeout(() => {
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
        }, 500);
    }
    
    preloadPages() {
        const pages = [
            'index.html',
            'projects.html',
            'experiences.html',
            'projects/ctf-challenge.html',
            'projects/gestionpro.html',
            'projects/esp32-automation.html',
            'experiences/experience-securetech.html',
            'experiences/experience-techinnov.html',
            'experiences/experience-electrosystems.html'
        ];
        
        pages.forEach(page => {
            if (!window.location.pathname.includes(page)) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    }
}

// ============================================
// INITIALISATION
// ============================================

// Initialiser le gestionnaire de transitions quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const transitionManager = new TransitionManager();
    window.TransitionManager = transitionManager;
});

// Gérer les erreurs de chargement d'images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };
    });
});
