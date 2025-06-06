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
        
        // 为不同分类选择不同的图标
        const categoryIcons = {
            '工具': 'fa-tools',
            '影视': 'fa-film',
            '动漫': 'fa-tv',
            '技术': 'fa-code',
            '学习': 'fa-graduation-cap',
            '音乐': 'fa-music',
            '游戏': 'fa-gamepad',
            '购物': 'fa-shopping-cart',
            '社交': 'fa-users'
        };
        
        // 生成分类导航
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = categories.map((category, index) => {
            // 使用特定图标，如果没有则使用默认文件夹图标
            const icon = categoryIcons[category] || 'fa-folder';
            
            return `
                <li class="category-item ${index === 0 ? 'active' : ''}" data-category="${category}">
                    <i class="fas ${icon}"></i> ${category}
                </li>
            `;
        }).join('');
        
        // 检测是否为移动端
        const isMobile = window.innerWidth <= 768;
        
        // 生成收藏内容
        const favoritesContent = document.getElementById('favorites-content');
        favoritesContent.innerHTML = categories.map((category, index) => {
            const categoryFavorites = favoritesData[category] || [];
            
            // 为不同分类选择不同的图标
            const categoryIcon = categoryIcons[category] || 'fa-folder-open';
            
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
                    
                    // 在移动端，点击分类后滚动到内容区域
                    if (window.innerWidth <= 768) {
                        categorySection.scrollIntoView({behavior: 'smooth'});
                    }
                }
                
                // 移除所有活动状态
                document.querySelectorAll('.category-item').forEach(el => {
                    el.classList.remove('active');
                });
                
                // 添加当前活动状态
                this.classList.add('active');
            });
        });
        
        // 添加窗口大小变化监听
        window.addEventListener('resize', function() {
            const isMobile = window.innerWidth <= 768;
            const categoryNav = document.querySelector('.categories-nav');
            
            if (isMobile) {
                // 确保在移动端时导航高度合适
                categoryNav.style.maxHeight = 'none';
            }
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