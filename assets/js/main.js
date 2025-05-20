// 每页显示的文章数量
const ITEMS_PER_PAGE = 10;

// 当前页码
let currentPage = 1;

// 文章数据
let articles = [];

// 加载文章数据
async function loadArticles() {
    try {
        const response = await fetch('/blog-index.yaml');
        const text = await response.text();
        // 使用 js-yaml 库解析 YAML
        articles = jsyaml.load(text).articles;
        // 按日期降序排序
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderArticles();
        renderPagination();
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

// 渲染文章列表
function renderArticles() {
    const container = document.getElementById('articles-container');
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageArticles = articles.slice(start, end);

    container.innerHTML = pageArticles.map(article => `
        <article class="article-card">
            <h2 class="article-title">
                <a href="${article.type === 'link' ? article.url : article.path}">
                    ${article.title}
                </a>
            </h2>
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
            </div>
            <p class="article-description">${article.description}</p>
            <div class="article-tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </article>
    `).join('');
}

// 渲染分页控件
function renderPagination() {
    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
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
    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
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