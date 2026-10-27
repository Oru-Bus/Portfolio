// ============================================
// MAIN.JS - Point d'entrée principal du portfolio
// ============================================

// Charger le module de transitions
const transitionsScript = document.createElement('script');
transitionsScript.src = 'js/transitions.js';
transitionsScript.async = false;
document.head.appendChild(transitionsScript);

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== SCROLL ANIMATIONS =====
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-fadeInUp');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ===== PROJECT FILTERING & SORTING =====
const projectsData = [
    {
        id: 1,
        title: 'CTF Security Challenge',
        description: 'Participation à un concours de cybersécurité avec résolution de défis variés',
        date: '2024-03-15',
        category: 'Cybersécurité',
        tags: ['CTF', 'Pentest', 'Python', 'Cryptographie', 'Réseau'],
        image: 'images/project-ctf.jpg',
        page: 'projects/ctf-challenge.html',
        transition: 'transition-cybersecurity'
    },
    {
        id: 2,
        title: 'GestionPro - Application Bureautique',
        description: 'Création d\'une application de gestion pour PME avec suivi client et facturation',
        date: '2023-11-20',
        category: 'Développement',
        tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Bootstrap'],
        image: 'images/project-gestionpro.jpg',
        page: 'projects/gestionpro.html',
        transition: 'transition-developpement'
    },
    {
        id: 3,
        title: 'ESP32 Home Automation',
        description: 'Système domotique complet basé sur ESP32 avec contrôle à distance',
        date: '2023-07-10',
        category: 'Électronique',
        tags: ['ESP32', 'Arduino', 'IoT', 'MQTT', 'C++', 'WiFi'],
        image: 'images/project-esp32.jpg',
        page: 'projects/esp32-automation.html',
        transition: 'transition-electronique'
    },
    {
        id: 4,
        title: 'Bug Bounty Platform',
        description: 'Plateforme de signalement de vulnérabilités pour entreprises',
        date: '2024-01-05',
        category: 'Cybersécurité',
        tags: ['Security', 'Web', 'API', 'Vulnerability', 'Python', 'Flask'],
        image: 'images/project-bugbounty.jpg',
        page: '#',
        transition: 'transition-cybersecurity'
    },
    {
        id: 5,
        title: 'Portfolio Website',
        description: 'Création de mon site portfolio personnel avec design moderne',
        date: '2024-05-01',
        category: 'Web Design',
        tags: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Design'],
        image: 'images/project-portfolio.jpg',
        page: '#',
        transition: 'transition-webdesign'
    },
    {
        id: 6,
        title: 'Startup Entrepreneurship',
        description: 'Lancement d\'une startup dans le domaine de la tech avec une équipe de 5 personnes',
        date: '2023-01-15',
        category: 'Entrepreneuriat',
        tags: ['Startup', 'Business', 'Management', 'Stratégie', 'Innovation'],
        image: 'images/project-startup.jpg',
        page: '#',
        transition: 'transition-entrepreneuriat'
    }
];

// ===== RENDER PROJECTS =====
function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Effet de fondu sortant avant de changer le contenu
    projectsContainer.style.opacity = '0';
    projectsContainer.style.transform = 'translateY(10px)';
    projectsContainer.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    setTimeout(() => {
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'card animate-fadeInUp';
            projectCard.dataset.category = project.category;
            projectCard.innerHTML = `
                <img src="${project.image || 'images/default-project.jpg'}" alt="${project.title}" class="card-img" loading="lazy">
                <div class="card-body">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-text">${project.description}</p>
                    <p class="card-text"><small>Catégorie: ${project.category}</small></p>
                    <p class="card-text"><small>Date: ${formatDate(project.date)}</small></p>
                    <div class="card-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${project.page}" class="btn btn-outline mt-2 project-link" data-category="${project.category}" data-transition="${project.transition || 'default'}">En savoir plus</a>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });

        // Remettre l'opacité à 1 avec un effet fluide
        projectsContainer.style.opacity = '1';
        projectsContainer.style.transform = 'translateY(0)';
        
        // Déclencher les animations avec délai
        setTimeout(() => {
            projectsContainer.querySelectorAll('.card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }, 100);
    }, 400);
}

// ===== FILTER BY CATEGORY =====
function filterProjects(category) {
    const filteredProjects = category === 'all'
        ? projectsData
        : projectsData.filter(project => project.category === category);

    renderProjects(filteredProjects);

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// ===== SORT PROJECTS =====
function sortProjects(sortBy) {
    let sortedProjects = [...projectsData];

    switch(sortBy) {
        case 'date-desc':
            sortedProjects.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            sortedProjects.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name-asc':
            sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            sortedProjects.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'category':
            sortedProjects.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }

    renderProjects(sortedProjects);
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// ===== INITIALIZE PROJECTS PAGE =====
function initProjectsPage() {
    const projectsContainer = document.getElementById('projects-container');
    const filterBar = document.getElementById('filter-bar');
    const sortSelect = document.getElementById('sort-select');

    if (!projectsContainer) return;

    // Create filter buttons
    if (filterBar) {
        const categories = ['all', ...new Set(projectsData.map(p => p.category))];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
            btn.dataset.category = category;
            btn.textContent = category === 'all' ? 'Tous' : category;
            btn.addEventListener('click', () => {
                currentCategory = category;
                filterProjects(category);
            });
            filterBar.appendChild(btn);
        });
    }

    // Create sort select
    if (sortSelect) {
        const sortOptions = [
            { value: 'date-desc', label: 'Date (Récent → Ancien)' },
            { value: 'date-asc', label: 'Date (Ancien → Récent)' },
            { value: 'name-asc', label: 'Nom (A → Z)' },
            { value: 'name-desc', label: 'Nom (Z → A)' },
            { value: 'category', label: 'Catégorie (A → Z)' }
        ];

        sortOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            sortSelect.appendChild(opt);
        });

        sortSelect.addEventListener('change', () => {
            sortProjects(sortSelect.value);
        });
    }

    // Initial render
    let currentCategory = 'all';
    renderProjects(projectsData);
}

// ===== BACK TO TOP BUTTON =====
window.addEventListener('scroll', function() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    initProjectsPage();
    
    // Initialiser les transitions pour les liens existants
    setupLinkTransitions();
});

// ===== GESTION DES TRANSITIONS DE LIENS =====
function setupLinkTransitions() {
    // Ajouter des attributs data-category aux liens qui n'en ont pas
    document.querySelectorAll('a[href*="projects/"], a[href*="experiences/"]').forEach(link => {
        const href = link.getAttribute('href');
        let category = link.dataset.category;
        
        if (!category) {
            // Déduire la catégorie à partir de l'URL
            if (href.includes('ctf') || href.includes('secure')) {
                category = 'Cybersécurité';
            } else if (href.includes('esp32') || href.includes('electro')) {
                category = 'Électronique';
            } else if (href.includes('gestionpro')) {
                category = 'Développement';
            } else if (href.includes('experience-securetech')) {
                category = 'SecureTech';
            } else if (href.includes('experience-techinnov')) {
                category = 'TechInnov';
            } else if (href.includes('experience-electrosystems')) {
                category = 'ElectroSystems';
            }
            
            if (category) {
                link.dataset.category = category;
            }
        }
    });
    
    // Intercepter les clics sur les liens internes
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            const category = this.dataset.category;
            
            // Ignorer les ancres (#), liens externes ou cibles vides
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('http') || targetHref.startsWith('mailto')) {
                return;
            }
            
            // Ignorer si le lien a déjà un target
            if (this.target === '_blank' || this.target === '_new') {
                return;
            }
            
            e.preventDefault();
            
            // Déclencher la transition appropriée
            triggerCategoryTransition(category, targetHref);
        });
    });
}

// ===== DÉCLENCHER LA TRANSITION SELON LA CATÉGORIE =====
function triggerCategoryTransition(category, href) {
    // Créer l'overlay de transition
    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    
    // Déterminer la classe de transition en fonction de la catégorie
    let transitionClass = 'transition-cybersecurity'; // Par défaut
    
    if (category) {
        const categoryMap = {
            'Cybersécurité': 'transition-cybersecurity',
            'Cybersecurite': 'transition-cybersecurity',
            'Développement': 'transition-developpement',
            'Électronique': 'transition-electronique',
            'Electronique': 'transition-electronique',
            'Web Design': 'transition-webdesign',
            'Entrepreneuriat': 'transition-entrepreneuriat',
            'SecureTech': 'transition-securetech',
            'SecureTech Solutions': 'transition-securetech',
            'TechInnov': 'transition-techinnov',
            'ElectroSystems': 'transition-electrosystems'
        };
        
        transitionClass = categoryMap[category] || transitionClass;
    }
    
    overlay.classList.add(transitionClass);
    overlay.innerHTML = '<div class="transition-loader"></div>';
    document.body.appendChild(overlay);
    
    // Activer l'overlay
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Naviguer après la transition
    setTimeout(() => {
        window.location.href = href;
    }, 1000);
}

// ===== GESTION DES IMAGES =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            // Remplace l'image cassée par une image de placeholder propre
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };
        
        // Chargement lazy pour les images
        if (!img.loading) {
            img.loading = 'lazy';
        }
        
        // Force le déclencheur si l'image n'existe pas localement
        if (!img.complete && img.src.includes('images/')) {
            const originalSrc = img.src;
            img.src = originalSrc;
        }
    });
});

// ===== OPTIMISATION DES PERFORMANCES =====

// Pré-charger les pages principales
window.addEventListener('load', () => {
    const pagesToPreload = [
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
    
    pagesToPreload.forEach(page => {
        if (!window.location.pathname.includes(page)) {
            fetch(page, { method: 'HEAD' }).catch(() => {});
        }
    });
});

// ===== EFFETS DE CHARGEMENT =====

// Ajouter un indicateur de chargement global
window.addEventListener('beforeunload', () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'transition-overlay transition-cybersecurity active';
    loadingOverlay.innerHTML = '<div class="transition-loader"></div>';
    document.body.appendChild(loadingOverlay);
});

// Nettoyer au chargement de la nouvelle page
window.addEventListener('load', () => {
    const existingOverlays = document.querySelectorAll('.transition-overlay');
    existingOverlays.forEach(overlay => {
        overlay.remove();
    });
});

// ===== ANIMATIONS AU SCROLL =====

// Observer pour les animations au scroll
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            
            // Déclencher des animations spécifiques selon la catégorie
            const category = entry.target.dataset.category;
            if (category) {
                applyCategoryAnimation(entry.target, category);
            }
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

// Appliquer les animations par catégorie
function applyCategoryAnimation(element, category) {
    const animations = {
        'Cybersécurité': 'glow-cyber 2s ease-in-out infinite',
        'Cybersecurite': 'glow-cyber 2s ease-in-out infinite',
        'Développement': 'slideFromLeft 0.8s ease-out',
        'Électronique': 'pulse-electronic 1.5s ease-in-out infinite',
        'Electronique': 'pulse-electronic 1.5s ease-in-out infinite',
        'Web Design': 'gradient-shift 3s ease infinite',
        'Entrepreneuriat': 'bounce 0.5s ease'
    };
    
    const animation = animations[category];
    if (animation) {
        element.style.animation = `fadeInUp 0.6s ease-out forwards, ${animation}`;
    }
}

// Observer les cartes de projets et d'expériences
function setupScrollObservers() {
    document.querySelectorAll('.card, .project-card, .experience-card').forEach(card => {
        scrollObserver.observe(card);
    });
}

// Initialiser les observers au chargement
document.addEventListener('DOMContentLoaded', setupScrollObservers);

// ===== FONCTIONS UTILITAIRES =====

// Débounce pour les événements de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle pour les animations
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== COMPATIBILITÉ =====

// Polyfill pour les anciennes versions
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

// Exporter pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        renderProjects,
        filterProjects,
        sortProjects,
        formatDate,
        initProjectsPage,
        scrollToTop,
        triggerCategoryTransition,
        setupLinkTransitions
    };
}
