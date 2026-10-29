// ============================================
// MAIN.JS - Point d'entrée principal du portfolio
// (les transitions de page sont gérées par transitions.js)
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
// Remarque : "date" sert uniquement au tri (certaines dates sont approximatives).
// "period" (facultatif) remplace la date affichée sur la carte.
// "page" vide = pas de page détail, donc pas de bouton "En savoir plus".
// "image" vide = pas d'image : la carte ne réserve alors aucun espace pour une photo.
const projectsData = [
    {
        id: 1,
        title: 'QUOSI',
        description: 'Application de gestion destinée aux entrepreneur·es individuel·les, pour centraliser leur gestion administrative.',
        date: '2026-01-01',
        period: '2026',
        category: 'Développement',
        tags: ['Application', 'Entrepreneuriat', 'Gestion de projet'],
        image: 'images/logo-quosi.png',
        page: 'projects/quosi.html'
    },
    {
        id: 2,
        title: 'Reflex',
        description: 'Un ESP32, des LED et des boutons poussoirs pour mesurer son temps de réaction, avec une application de bureau pour suivre ses sessions.',
        date: '2025-06-01',
        period: 'Projet personnel',
        category: 'Électronique',
        tags: ['ESP32', 'Électronique', 'Informatique', 'Application de bureau'],
        image: 'images/esp32.png',
        page: 'projects/reflex.html'
    },
    {
        id: 3,
        title: 'Hack Ton Lycée',
        description: 'Concours régional de cybersécurité (CTF et Bug Bounty) entre étudiant·es d\'Île-de-France.',
        date: '2024-10-15',
        period: 'Octobre 2024',
        category: 'Cybersécurité',
        tags: ['CTF', 'Bug Bounty', 'OWASP ZAP', 'Nmap', 'Python'],
        image: 'images/logo-hack-ton-lycee.png',
        page: 'projects/hack-ton-lycee.html'
    },
    {
        id: 10,
        title: 'Modélisation 3D',
        description: 'Projets de modélisation 3D réalisés avec Blender.',
        date: '2023-06-01',
        period: 'Projet personnel',
        category: 'Création 3D',
        tags: ['Blender', '3D'],
        image: 'images/3D.png',
        page: ''
    },
    {
        id: 4,
        title: 'Cockpit maison',
        description: 'Cockpit réalisé pour Microsoft Flight Simulator 2020, à base d\'ESP32 et de l\'API SimConnect.',
        date: '2024-01-01',
        period: 'Projet personnel',
        category: 'Électronique',
        tags: ['ESP32', 'Électronique', 'JS'],
        page: ''
    },
    {
        id: 5,
        title: 'Détecteur de mouvements',
        description: 'Détecteur de mouvements réalisé avec un ESP32.',
        date: '2024-01-02',
        period: 'Projet personnel',
        category: 'Électronique',
        tags: ['ESP32', 'Électronique'],
        page: ''
    },
    {
        id: 6,
        title: 'Applications cross-platform',
        description: 'Création d\'applications multiplateformes pour mobile et ordinateur.',
        date: '2025-03-01',
        period: 'Projet personnel',
        category: 'Développement',
        tags: ['Expo', 'React Native', 'Android Studio', 'Electron'],
        page: ''
    },
    {
        id: 7,
        title: 'Reconnaissance faciale',
        description: 'Programme de reconnaissance faciale en Python.',
        date: '2024-06-01',
        period: 'Projet personnel',
        category: 'Développement',
        tags: ['Python', 'OpenCV', 'NumPy'],
        page: ''
    },
    {
        id: 8,
        title: 'Matchmaking',
        description: 'Projet de matchmaking développé en Python.',
        date: '2024-05-01',
        period: 'Projet personnel',
        category: 'Développement',
        tags: ['Python', 'Socket', 'Pickle', 'Threading'],
        page: ''
    },
    {
        id: 9,
        title: 'Extension Visual Studio Code',
        description: 'Développement d\'une extension pour l\'éditeur Visual Studio Code.',
        date: '2025-01-01',
        period: 'Projet personnel',
        category: 'Développement',
        tags: ['Visual Studio Code', 'Extension'],
        page: ''
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
            const dateLabel = project.period || formatDate(project.date);

            // Pas d'image => aucun bloc image (donc pas de grand espace vide)
            const imageBlock = project.image
                ? `<img src="${project.image}" alt="${project.title}" class="card-img" loading="lazy">`
                : '';
            const moreButton = project.page
                ? `<a href="${project.page}" class="btn btn-outline mt-2" data-category="${project.category}">En savoir plus</a>`
                : '';

            projectCard.innerHTML = `
                ${imageBlock}
                <div class="card-body">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-text">${project.description}</p>
                    <p class="card-text"><small>Catégorie: ${project.category}</small></p>
                    <p class="card-text"><small>${dateLabel}</small></p>
                    <div class="card-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${moreButton}
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
            this.onerror = null;
            this.src = `https://placehold.co/600x400/2c3e50/ffffff?text=${encodeURIComponent(this.alt || 'Portfolio')}`;
        };

        if (!img.loading) {
            img.loading = 'lazy';
        }
    });
});

// Polyfill pour les anciennes versions
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}
