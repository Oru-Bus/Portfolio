// ============================================
// MAIN.JS - Point d'entrée principal du portfolio
// (les transitions de page sont gérées uniquement par transitions.js)
// ============================================

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
// (rappelé à chaque changement de page par initPage, car le contenu est remplacé sans rechargement)
function setupMenu() {
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

// Thème de transition associé à chaque catégorie (lu par transitions.js via data-theme)
const CATEGORY_THEMES = {
    'Cybersécurité': 'cyber',
    'Électronique': 'electronic',
    'Développement': 'dev'
};

// État courant de la page projets (catégorie + tri)
const projectsState = { category: 'all', sort: 'date-desc' };

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
            const theme = CATEGORY_THEMES[project.category];
            const themeAttr = theme ? ` data-theme="${theme}"` : '';
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
                    <a href="${project.page}" class="btn btn-outline mt-2" data-category="${project.category}"${themeAttr}>En savoir plus</a>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });

        // Remettre l'opacité à 1 avec un effet fluide
        projectsContainer.style.opacity = '1';
        projectsContainer.style.transform = 'translateY(0)';
    }, 400);
}

// ===== FILTER + SORT =====
function getVisibleProjects() {
    let list = projectsState.category === 'all'
        ? [...projectsData]
        : projectsData.filter(project => project.category === projectsState.category);

    switch (projectsState.sort) {
        case 'date-desc':
            list.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            list.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'name-asc':
            list.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            list.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'category':
            list.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    return list;
}

function filterProjects(category) {
    projectsState.category = category;
    renderProjects(getVisibleProjects());

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
}

function sortProjects(sortBy) {
    projectsState.sort = sortBy;
    renderProjects(getVisibleProjects());
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

    projectsState.category = 'all';
    projectsState.sort = 'date-desc';

    // Create filter buttons
    if (filterBar) {
        const categories = ['all', ...new Set(projectsData.map(p => p.category))];
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${category === 'all' ? 'active' : ''}`;
            btn.dataset.category = category;
            btn.textContent = category === 'all' ? 'Tous' : category;
            btn.addEventListener('click', () => filterProjects(category));
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

        sortSelect.addEventListener('change', () => sortProjects(sortSelect.value));
    }

    // Initial render (tri par date décroissante, comme affiché dans le select)
    renderProjects(getVisibleProjects());
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

// ===== GESTION DES IMAGES =====
function setupImages() {
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            this.onerror = null;
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };
    });
}

// ===== INITIALIZE =====
// Initialise la page courante. Appelée au chargement, puis par transitions.js
// après chaque changement de page (le contenu est remplacé sans rechargement).
function initPage() {
    setupMenu();
    setupImages();
    initProjectsPage();
    animateOnScroll();
}
window.initPage = initPage;

document.addEventListener('DOMContentLoaded', initPage);
