// Global state
let currentLang = 'en';
let articles = [];
let news = [];
let showingAllNews = false;

// Language data
const translations = {
    en: {
        'About us': 'About us',
        'Articles': 'Articles',
        'Our program': 'Our program',
        'Join us': 'Join us',
        'Contact': 'Contact',
        'Full name': 'Full name',
        'Email': 'Email',
        'Role': 'Role',
        'Student': 'Student',
        'Parent': 'Parent',
        'Educator': 'Educator',
        'Other': 'Other',
        'Message (how you\'d like to help / what you need)': 'Message (how you\'d like to help / what you need)',
        'Request access': 'Request access',
        'We\'ll reply in 1–2 days.': 'We\'ll reply in 1–2 days.',
        'Join the program': 'Join the program',
        'Close': 'Close',
        'Read': 'Read',
        'Loading articles...': 'Loading articles...',
        'Thanks! We will email you soon.': 'Thanks! We will email you soon.',
        'Screen-time audit': 'Screen-time audit',
        'Track near-work habits daily.': 'Track near-work habits daily.',
        'Micro-lessons': 'Micro-lessons',
        '3–5 min weekly videos.': '3–5 min weekly videos.',
        'Practice': 'Practice',
        '20-20-20, outdoor time, lighting & posture.': '20-20-20, outdoor time, lighting & posture.',
        'Parent/Teacher kit': 'Parent/Teacher kit',
        'Posters, slides, and class activities.': 'Posters, slides, and class activities.',
        'Phone': 'Phone'
    },
    zh: {
        'About us': '关于我们',
        'Articles': '文章',
        'Our program': '我们的项目',
        'Join us': '加入我们',
        'Contact': '联系方式',
        'Full name': '姓名',
        'Email': '邮箱',
        'Role': '身份',
        'Student': '学生',
        'Parent': '家长',
        'Educator': '教师',
        'Other': '其他',
        'Message (how you\'d like to help / what you need)': '留言（想参与方式 / 需要的支持）',
        'Request access': '提交申请',
        'We\'ll reply in 1–2 days.': '我们会在 1–2 天内回复。',
        'Join the program': '加入项目',
        'Close': '关闭',
        'Read': '阅读',
        'Loading articles...': '加载文章中...',
        'Thanks! We will email you soon.': '已收到，我们会尽快联系你。',
        'Screen-time audit': '屏幕时间盘点',
        'Track near-work habits daily.': '每日记录近距离用眼习惯。',
        'Micro-lessons': '微课视频',
        '3–5 min weekly videos.': '每周 3–5 分钟视频学习。',
        'Practice': '每日实践',
        '20-20-20, outdoor time, lighting & posture.': '20-20-20、户外时间、合适光照与正确坐姿。',
        'Parent/Teacher kit': '家校工具包',
        'Posters, slides, and class activities.': '宣传海报、课堂活动与幻灯片。',
        'Phone': '电话'
    }
};

// DOM elements
const langToggle = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');
const joinCta = document.getElementById('join-cta');
const joinModal = document.getElementById('join-modal');
const modalClose = document.getElementById('modal-close');
const joinForm = document.getElementById('join-form');
const modalJoinForm = document.getElementById('modal-join-form');
const successToast = document.getElementById('success-toast');
const articlesGrid = document.getElementById('articles-grid');
const newsContainer = document.getElementById('news-container');
const seeMoreNewsButton = document.getElementById('see-more-news');
const currentYear = document.getElementById('current-year');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    currentYear.textContent = new Date().getFullYear();
    loadArticles();
    loadNews();
    setupEventListeners();
    updateLanguage();
});

// Event listeners
function setupEventListeners() {
    // Language toggle
    langToggle.addEventListener('click', toggleLanguage);

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Join CTA button
    joinCta.addEventListener('click', openJoinModal);

    // Modal close
    modalClose.addEventListener('click', closeJoinModal);
    joinModal.addEventListener('click', function(e) {
        if (e.target === joinModal) {
            closeJoinModal();
        }
    });

    // Form submissions
    joinForm.addEventListener('submit', handleFormSubmit);
    modalJoinForm.addEventListener('submit', handleFormSubmit);

    // See more / Show less news button
    if (seeMoreNewsButton) {
        seeMoreNewsButton.addEventListener('click', function() {
            if (news.length > 3) {
                showingAllNews = !showingAllNews;
                renderNews();
            }
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && joinModal.classList.contains('show')) {
            closeJoinModal();
        }
    });
}

// Language functions
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    updateLanguage();
    loadArticles(); // Reload articles with new language
    // Reset showingAllNews state when language changes
    showingAllNews = false;
    loadNews(); // Reload news with new language
}

function updateLanguage() {
    // Update language text
    langText.textContent = currentLang === 'en' ? 'EN' : '中文';

    // Update all elements with data attributes
    document.querySelectorAll('[data-en][data-zh]').forEach(element => {
        const text = currentLang === 'en' ? element.dataset.en : element.dataset.zh;
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });

    // Update select options
    document.querySelectorAll('select option').forEach(option => {
        const enText = option.dataset.en;
        const zhText = option.dataset.zh;
        if (enText && zhText) {
            option.textContent = currentLang === 'en' ? enText : zhText;
        }
    });

    // Update hero background based on language
    const hero = document.querySelector('.hero');
    if (hero) {
        const bgImage = currentLang === 'zh'
            ? 'assets/images/background-chinese.png'
            : 'assets/images/background.png';
        hero.style.backgroundImage = "url('" + bgImage + "')";
    }
}

// Mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
}

// Navigation
function handleNavClick(e) {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    // Close mobile menu if open
    navMenu.classList.remove('show');
}

// Modal functions
function openJoinModal() {
    joinModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeJoinModal() {
    joinModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Form handling
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        message: formData.get('message'),
        _subject: 'New EyeGuard Join Request'
    };

    try {
        // Try Formspree first (replace with your actual endpoint)
        const response = await fetch('https://formspree.io/f/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showSuccessToast();
            form.reset();
            if (form === modalJoinForm) {
                closeJoinModal();
            }
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Fallback: open email client
        const subject = encodeURIComponent('Join EyeGuard');
        const body = encodeURIComponent(
            `Name: ${data.name}\nRole: ${data.role}\nEmail: ${data.email}\n\n${data.message}`
        );
        window.location.href = `mailto:Dereksha2008@gmail.com?subject=${subject}&body=${body}`;
    }
}

function showSuccessToast() {
    successToast.classList.add('show');
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 3000);
}

// Articles
async function loadArticles() {
    try {
        const response = await fetch(`assets/articles/${currentLang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load articles');
        }
        articles = await response.json();
        renderArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        articlesGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Failed to load articles</span>
            </div>
        `;
    }
}

function renderArticles() {
    if (articles.length === 0) {
        articlesGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-info-circle"></i>
                <span>No articles available</span>
            </div>
        `;
        return;
    }

    articlesGrid.innerHTML = articles.map((article, index) => {
        const hasUrl = article.url && article.url.trim() !== '';
        const clickHandler = hasUrl
            ? `window.open('${article.url.replace(/'/g, "\\'")}', '_blank')`
            : `openArticle(${index})`;
        return `
        <div class="article-card" onclick="${clickHandler}">
            ${article.imageUrl ? `<img src="${article.imageUrl}" alt="${article.title}" class="article-image" onerror="this.style.display='none'">` : ''}
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-summary">${article.summary}</p>
                <a href="${hasUrl ? article.url : '#'}" class="article-read" ${hasUrl ? 'target="_blank"' : ''} onclick="event.stopPropagation(); ${hasUrl ? '' : `openArticle(${index})`}">
                    ${currentLang === 'en' ? 'Read' : '阅读'} <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
    }).join('');
}

function openArticle(index) {
    const article = articles[index];
    if (!article) return;

    // Create article page URL
    const articleUrl = `article.html?lang=${currentLang}&index=${index}`;
    window.location.href = articleUrl;
}

// News functions
async function loadNews() {
    try {
        const response = await fetch(`assets/articles/news_${currentLang}.json`);
        if (!response.ok) {
            throw new Error('Failed to load news');
        }
        news = await response.json();
        showingAllNews = false; // Reset to showing first 3 when loading new news
        renderNews();
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Failed to load news</span>
            </div>
        `;
        showingAllNews = false;
    }
}

function renderNews() {
    if (news.length === 0) {
        newsContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-info-circle"></i>
                <span>No news available</span>
            </div>
        `;
        if (seeMoreNewsButton) {
            seeMoreNewsButton.style.display = 'none';
        }
        showingAllNews = false;
        return;
    }

    // Display first 3 news items or all if showingAllNews is true
    const newsToDisplay = showingAllNews ? news : news.slice(0, 3);

    newsContainer.innerHTML = newsToDisplay.map((item, index) => {
        const hasUrl = item.url && item.url.trim() !== '';
        const cardContent = `
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="news-image" onerror="this.style.display='none'">` : ''}
            <div class="news-content">
                <h3 class="news-title">${item.title}</h3>
                <p class="news-date">${item.date}</p>
                <p class="news-description">${item.description}</p>
            </div>
        `;

        if (hasUrl) {
            return `<div class="news-card" data-news-url="${item.url.replace(/"/g, '&quot;')}" title="${currentLang === 'en' ? 'Click to read full article' : '点击阅读全文'}">${cardContent}</div>`;
        } else {
            return `<div class="news-card">${cardContent}</div>`;
        }
    }).join('');

    // Attach click event listeners to news cards with URLs
    newsContainer.querySelectorAll('.news-card[data-news-url]').forEach(card => {
        card.addEventListener('click', function() {
            const url = this.getAttribute('data-news-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Update button text and visibility
    if (seeMoreNewsButton) {
        if (news.length > 3) {
            seeMoreNewsButton.style.display = 'block';
            seeMoreNewsButton.setAttribute('data-en', showingAllNews ? 'Show less' : 'See more news stories');
            seeMoreNewsButton.setAttribute('data-zh', showingAllNews ? '显示更少' : '查看更多新闻');
            const buttonText = showingAllNews
                ? (currentLang === 'en' ? 'Show less' : '显示更少')
                : (currentLang === 'en' ? 'See more news stories' : '查看更多新闻');
            seeMoreNewsButton.textContent = buttonText;
        } else {
            seeMoreNewsButton.style.display = 'none';
        }
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('show');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('show');
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
