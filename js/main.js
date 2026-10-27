// ============================================
// MAIN.JS - Point d'entrée principal du portfolio
// ============================================

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
        page: 'projects/ctf-challenge.html'
    },
    {
        id: 2,
        title: 'GestionPro - Application Bureautique',
        description: 'Création d\'une application de gestion pour PME avec suivi client et facturation',
        date: '2023-11-20',
        category: 'Développement',
        tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Bootstrap'],
        image: 'images/project-gestionpro.jpg',
        page: 'projects/gestionpro.html'
    },
    {
        id: 3,
        title: 'ESP32 Home Automation',
        description: 'Système domotique complet basé sur ESP32 avec contrôle à distance',
        date: '2023-07-10',
        category: 'Électronique',
        tags: ['ESP32', 'Arduino', 'IoT', 'MQTT', 'C++', 'WiFi'],
        image: 'images/project-esp32.jpg',
        page: 'projects/esp32-automation.html'
    },
    {
        id: 4,
        title: 'Bug Bounty Platform',
        description: 'Plateforme de signalement de vulnérabilités pour entreprises',
        date: '2024-01-05',
        category: 'Cybersécurité',
        tags: ['Security', 'Web', 'API', 'Vulnerability', 'Python', 'Flask'],
        image: 'images/project-bugbounty.jpg',
        page: '#'
    },
    {
        id: 5,
        title: 'Portfolio Website',
        description: 'Création de mon site portfolio personnel avec design moderne',
        date: '2024-05-01',
        category: 'Web Design',
        tags: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Design'],
        image: 'images/project-portfolio.jpg',
        page: '#'
    },
    {
        id: 6,
        title: 'Startup Entrepreneurship',
        description: 'Lancement d\'une startup dans le domaine de la tech avec une équipe de 5 personnes',
        date: '2023-01-15',
        category: 'Entrepreneuriat',
        tags: ['Startup', 'Business', 'Management', 'Stratégie', 'Innovation'],
        image: 'images/project-startup.jpg',
        page: '#'
    }
];

// ===== RENDER PROJECTS =====
function renderProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    // Effet de fondu sortant avant de changer le contenu
    projectsContainer.style.opacity = '0';
    projectsContainer.style.transform = 'translateY(10px)';
    projectsContainer.style.transition = 'all 0.4s ease';

    setTimeout(() => {
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'card animate-fadeInUp';
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
                    <a href="${project.page}" class="btn btn-outline mt-2" data-category="${project.category}">En savoir plus</a>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });

        // Remettre l'opacité à 1 avec un effet fluide
        projectsContainer.style.opacity = '1';
        projectsContainer.style.transform = 'translateY(0)';
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
});

// ===== GESTION DES IMAGES =====
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };
        
        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
});

// ===== TRANSITIONS FLUIDES =====
// Intercepter les clics sur les liens internes pour des transitions fluides
document.addEventListener('DOMContentLoaded', () => {
    const transitionDuration = 400;
    
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetHref = this.getAttribute('href');
            
            // Ignorer les ancres (#), liens externes ou cibles vides
            if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('http') || targetHref.startsWith('mailto')) {
                return;
            }
            
            // Ignorer si le lien a un target
            if (this.target === '_blank' || this.target === '_new') {
                return;
            }
            
            e.preventDefault();
            
            // Créer et afficher l'overlay de transition
            const overlay = document.createElement('div');
            overlay.id = 'transition-overlay';
            overlay.style.cssText = `
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
                transition: opacity ${transitionDuration}ms ease-in-out;
            `;
            
            const loader = document.createElement('div');
            loader.style.cssText = `
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;
            
            overlay.appendChild(loader);
            document.body.appendChild(overlay);
            
            // Ajouter le keyframe pour le spin
            const style = document.createElement('style');
            style.id = 'transition-spin-style';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            // Activer l'overlay
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'all';
                
                // Naviguer après la transition
                setTimeout(() => {
                    window.location.href = targetHref;
                }, transitionDuration);
            }, 50);
        });
    });
});

// Nettoyer les overlays existants au chargement
window.addEventListener('load', () => {
    const existingOverlays = document.querySelectorAll('#transition-overlay, #page-transition-overlay');
    existingOverlays.forEach(overlay => {
        overlay.remove();
    });
    
    const existingStyles = document.querySelectorAll('#transition-spin-style');
    existingStyles.forEach(style => {
        style.remove();
    });
});

// Polyfill pour les anciennes versions
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
