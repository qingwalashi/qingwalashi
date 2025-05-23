// 每页显示的文章数量
const ITEMS_PER_PAGE = 10;

// 当前页码
let currentPage = 1;

// 文章数据
let articles = [];

// 当前选中的标签
let selectedTag = null;

// 当前搜索关键词
let searchQuery = '';

// 导航栏滚动处理
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 向下滚动且超过100px时隐藏导航栏
        navbar.classList.add('hidden');
    } else {
        // 向上滚动时显示导航栏
        navbar.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
});

// 加载文章数据
async function loadArticles() {
    try {
        const response = await fetch('../blog-index.yaml');
        const text = await response.text();
        articles = jsyaml.load(text).articles;
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderArticles();
        renderPagination();
        renderTagCloud();
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// 渲染文章列表
function renderArticles() {
    const container = document.getElementById('articles-container');
    const filteredArticles = filterArticles();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageArticles = filteredArticles.slice(start, end);

    container.innerHTML = pageArticles.map(article => {
        let path = article.path;
        if (article.type === 'md') {
            path = path.replace('.md', '.html');
        }

        // 高亮搜索关键词
        const title = highlightText(article.title, searchQuery);
        const description = highlightText(article.description, searchQuery);

        // 根据文章类型添加emoji
        let typeEmoji = '';
        switch (article.type) {
            case 'link':
                typeEmoji = '🔗';
                break;
            case 'html':
                typeEmoji = '🌐';
                break;
            case 'md':
                typeEmoji = '📝';
                break;
        }

        return `
        <article class="article-card">
            <h2 class="article-title">
                <a href="${article.type === 'link' ? article.url : path}">
                    ${typeEmoji} ${title}
                </a>
            </h2>
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
            </div>
            <p class="article-description">${description}</p>
            <div class="article-tags">
                ${article.tags.map(tag => `
                    <span class="tag ${tag === selectedTag ? 'active' : ''}" 
                          onclick="filterByTag('${tag}')">
                        ${tag}
                    </span>
                `).join('')}
            </div>
        </article>`;
    }).join('');
}

// 渲染标签云
function renderTagCloud() {
    const tagMap = new Map();
    articles.forEach(article => {
        article.tags.forEach(tag => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
    });

    const sortedTags = Array.from(tagMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const container = document.getElementById('tag-cloud');
    container.innerHTML = `
        <span class="tag ${!selectedTag ? 'active' : ''}" 
              onclick="filterByTag(null)">
            全部 (${articles.length})
        </span>
        ${sortedTags.map(([tag, count]) => `
            <span class="tag ${tag === selectedTag ? 'active' : ''}" 
                  onclick="filterByTag('${tag}')">
                ${tag} (${count})
            </span>
        `).join('')}
    `;
}

// 过滤文章
function filterArticles() {
    return articles.filter(article => {
        const matchesSearch = !searchQuery || 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !selectedTag || 
            article.tags.includes(selectedTag);
        
        return matchesSearch && matchesTag;
    });
}

// 高亮文本
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// 按标签筛选
function filterByTag(tag) {
    selectedTag = selectedTag === tag ? null : tag;
    currentPage = 1;
    renderArticles();
    renderPagination();
    renderTagCloud();
}

// 搜索处理
document.getElementById('search-box').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    currentPage = 1;
    renderArticles();
    renderPagination();
});

// 渲染分页控件
function renderPagination() {
    const filteredArticles = filterArticles();
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    let paginationHTML = '';
    
    // 上一页按钮
    paginationHTML += `
        <button 
            onclick="changePage(${currentPage - 1})"
            ${currentPage === 1 ? 'disabled' : ''}
        >
            上一页
        </button>
    `;
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button 
                onclick="changePage(${i})"
                class="${i === currentPage ? 'active' : ''}"
            >
                ${i}
            </button>
        `;
    }
    
    // 下一页按钮
    paginationHTML += `
        <button 
            onclick="changePage(${currentPage + 1})"
            ${currentPage === totalPages ? 'disabled' : ''}
        >
            下一页
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// 切换页码
function changePage(page) {
    const filteredArticles = filterArticles();
    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderArticles();
    renderPagination();
    
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadArticles); 