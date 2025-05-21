// 加载文章数据并处理标签
async function loadTags() {
    try {
        const response = await fetch('/blog-index.yaml');
        const text = await response.text();
        const articles = jsyaml.load(text).articles;
        
        // 处理标签
        const tagMap = new Map();
        articles.forEach(article => {
            article.tags.forEach(tag => {
                if (!tagMap.has(tag)) {
                    tagMap.set(tag, []);
                }
                tagMap.get(tag).push(article);
            });
        });

        // 渲染标签
        const container = document.getElementById('tags-container');
        container.innerHTML = Array.from(tagMap.entries())
            .sort((a, b) => b[1].length - a[1].length)
            .map(([tag, articles]) => `
                <div class="tag-card">
                    <div class="tag-name">${tag}</div>
                    <div class="tag-count">${articles.length} 篇文章</div>
                    <div class="tag-articles">
                        ${articles.map(article => {
                            let path = article.path;
                            if (article.type === 'md') {
                                path = path.replace('.md', '.html');
                            }
                            return `
                            <div class="tag-article">
                                <a href="${article.type === 'link' ? article.url : path}">
                                    ${article.title}
                                </a>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadTags); 