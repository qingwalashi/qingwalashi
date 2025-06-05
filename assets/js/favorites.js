// 加载收藏数据
async function loadFavorites() {
    try {
        const response = await fetch('../config/favorites.yaml');
        const text = await response.text();
        const data = jsyaml.load(text);
        const favoritesData = data.favorites || {};
        
        // 获取所有分类
        const categories = Object.keys(favoritesData);
        
        if (categories.length === 0) {
            document.getElementById('favorites-content').innerHTML = `
                <div class="no-favorites">
                    <i class="fas fa-exclamation-circle"></i>
                    暂无收藏内容
                </div>
            `;
            return;
        }
        
        // 生成分类导航
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = categories.map((category, index) => {
            return `
                <li class="category-item ${index === 0 ? 'active' : ''}" data-category="${category}">
                    <i class="fas fa-folder"></i> ${category}
                </li>
            `;
        }).join('');
        
        // 生成收藏内容
        const favoritesContent = document.getElementById('favorites-content');
        favoritesContent.innerHTML = categories.map((category, index) => {
            const categoryFavorites = favoritesData[category] || [];
            
            // 为不同分类选择不同的图标
            let categoryIcon = 'fa-folder-open';
            switch(category) {
                case '工具':
                    categoryIcon = 'fa-tools';
                    break;
                case '影视':
                    categoryIcon = 'fa-film';
                    break;
                case '动漫':
                    categoryIcon = 'fa-tv';
                    break;
                case '技术':
                    categoryIcon = 'fa-code';
                    break;
                case '学习':
                    categoryIcon = 'fa-graduation-cap';
                    break;
                case '音乐':
                    categoryIcon = 'fa-music';
                    break;
                case '游戏':
                    categoryIcon = 'fa-gamepad';
                    break;
                case '购物':
                    categoryIcon = 'fa-shopping-cart';
                    break;
                case '社交':
                    categoryIcon = 'fa-users';
                    break;
            }
            
            return `
                <div class="category-section" id="category-${category}" style="display: ${index === 0 ? 'block' : 'none'}">
                    <h2 class="category-title"><i class="fas ${categoryIcon}"></i> ${category}</h2>
                    <div class="favorite-cards">
                        ${categoryFavorites.map(favorite => {
                            // 确定链接图标
                            const linkIcon = favorite.type === 'app' ? 'fa-mobile-alt' : 'fa-arrow-right';
                            
                            // 根据分类确定链接文本
                            let linkText = '访问链接';
                            switch(category) {
                                case '工具':
                                    linkText = '使用工具';
                                    break;
                                case '影视':
                                    linkText = '观看影视';
                                    break;
                                case '动漫':
                                    linkText = '观看动漫';
                                    break;
                                case '技术':
                                    linkText = '学习技术';
                                    break;
                                case '学习':
                                    linkText = '开始学习';
                                    break;
                                case '音乐':
                                    linkText = '聆听音乐';
                                    break;
                                case '游戏':
                                    linkText = '开始游戏';
                                    break;
                                case '购物':
                                    linkText = '去购物';
                                    break;
                                case '社交':
                                    linkText = '社交互动';
                                    break;
                            }
                            
                            return `
                                <div class="favorite-card">
                                    <div>
                                        <h3 class="favorite-title">${favorite.title}</h3>
                                        <p class="favorite-description">${favorite.description}</p>
                                    </div>
                                    <a href="${favorite.url}" class="favorite-link" target="_blank" rel="noopener noreferrer">
                                        ${linkText} <i class="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        // 添加分类导航点击事件
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', function() {
                // 获取当前选中的分类
                const category = this.getAttribute('data-category');
                
                // 隐藏所有分类内容
                document.querySelectorAll('.category-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                // 显示选中的分类内容
                const categorySection = document.getElementById(`category-${category}`);
                if (categorySection) {
                    categorySection.style.display = 'block';
                }
                
                // 移除所有活动状态
                document.querySelectorAll('.category-item').forEach(el => {
                    el.classList.remove('active');
                });
                
                // 添加当前活动状态
                this.classList.add('active');
            });
        });
        
    } catch (error) {
        console.error('Error loading favorites:', error);
        document.getElementById('favorites-content').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                加载收藏内容时出错: ${error.message}
            </div>
        `;
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadFavorites); 