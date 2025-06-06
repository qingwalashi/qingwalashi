// 全局变量保存所有收藏数据
let allFavoritesData = {};
// 当前选中的搜索引擎
let currentSearchEngine = 'baidu';

// 搜索引擎URL配置
const searchEngines = {
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://www.bing.com/search?q=',
    google: 'https://www.google.com/search?q='
};

// 加载收藏数据
async function loadFavorites() {
    try {
        const response = await fetch('../config/favorites.yaml');
        const text = await response.text();
        const data = jsyaml.load(text);
        const favoritesData = data.favorites || {};
        
        // 处理置顶内容
        const pinnedItems = [];
        const normalItems = {};
        
        // 遍历所有分类
        Object.entries(favoritesData).forEach(([category, items]) => {
            // 收集所有置顶内容到一个数组中
            const pinned = items.filter(item => item.pinned);
            pinnedItems.push(...pinned);
            
            // 保存原始分类内容
            normalItems[category] = items;
        });
        
        // 合并置顶和普通内容
        const processedData = {
            '置顶': pinnedItems,
            ...normalItems
        };
        
        // 保存到全局变量
        allFavoritesData = processedData;
        
        // 获取所有分类
        const categories = Object.keys(processedData);
        
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
            '置顶': 'fa-thumbtack',
            '工具': 'fa-tools',
            '影视': 'fa-film',
            '动漫': 'fa-tv',
            '技术': 'fa-code',
            '学习': 'fa-graduation-cap',
            '音乐': 'fa-music',
            '游戏': 'fa-gamepad',
            '购物': 'fa-shopping-cart',
            '社交': 'fa-users',
            'AI': 'fa-robot',
            '技术站点': 'fa-laptop-code',
            '产品与设计': 'fa-palette',
            '视频流媒体': 'fa-video',
            '开发工具': 'fa-code-branch',
            '视频下载': 'fa-download'
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
        
        // 渲染收藏内容
        renderFavorites(processedData, categories);
        
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
        
        // 初始化搜索功能
        initSearch();
        
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

// 渲染收藏内容
function renderFavorites(favoritesData, categories) {
    const categoryIcons = {
        '置顶': 'fa-thumbtack',
        '工具': 'fa-tools',
        '影视': 'fa-film',
        '动漫': 'fa-tv',
        '技术': 'fa-code',
        '学习': 'fa-graduation-cap',
        '音乐': 'fa-music',
        '游戏': 'fa-gamepad',
        '购物': 'fa-shopping-cart',
        '社交': 'fa-users',
        'AI': 'fa-robot',
        '技术站点': 'fa-laptop-code',
        '产品与设计': 'fa-palette',
        '视频流媒体': 'fa-video',
        '开发工具': 'fa-code-branch',
        '视频下载': 'fa-download'
    };
    
    // 生成收藏内容
    const favoritesContent = document.getElementById('favorites-content');
    favoritesContent.innerHTML = categories.map((category, index) => {
        const categoryFavorites = favoritesData[category] || [];
        
        // 为不同分类选择不同的图标
        const categoryIcon = categoryIcons[category] || 'fa-folder-open';
        
        // 如果是置顶分类，直接显示所有置顶内容
        if (category === '置顶') {
            return `
                <div class="category-section" id="category-${category}" style="display: ${index === 0 ? 'block' : 'none'}">
                    <h2 class="category-title"><i class="fas ${categoryIcon}"></i> ${category}</h2>
                    <div class="favorite-cards">
                        ${categoryFavorites.map(favorite => renderFavoriteCard(favorite, category, false)).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="category-section" id="category-${category}" style="display: ${index === 0 ? 'block' : 'none'}">
                <h2 class="category-title"><i class="fas ${categoryIcon}"></i> ${category}</h2>
                <div class="favorite-cards">
                    ${categoryFavorites.map(favorite => renderFavoriteCard(favorite, category, true)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// 渲染单个收藏卡片
function renderFavoriteCard(favorite, category, showPinnedBadge = true) {
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
        <div class="favorite-card ${favorite.pinned ? 'pinned' : ''}" data-title="${favorite.title}" data-description="${favorite.description}">
            ${showPinnedBadge && favorite.pinned ? '<div class="pinned-badge"><i class="fas fa-thumbtack"></i></div>' : ''}
            <div>
                <h3 class="favorite-title">${favorite.title}</h3>
                <p class="favorite-description">${favorite.description}</p>
            </div>
            <a href="${favorite.url}" class="favorite-link" target="_blank" rel="noopener noreferrer">
                ${linkText} <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('favorites-search-input');
    const searchEngineButtons = document.querySelectorAll('.search-engine-btn');
    
    // 搜索输入框事件
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm === '') {
            // 如果搜索框为空，恢复原始显示
            resetSearch();
            return;
        }
        
        // 搜索收藏
        searchFavorites(searchTerm);
    });
    
    // 搜索引擎切换事件
    searchEngineButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的活动状态
            searchEngineButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的活动状态
            this.classList.add('active');
            
            // 设置当前搜索引擎
            currentSearchEngine = this.getAttribute('data-engine');
            
            // 更新搜索框的提示文本
            updateSearchPlaceholder();
        });
    });
    
    // 搜索框按下回车键事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.trim();
            if (searchTerm) {
                // 使用当前选中的搜索引擎搜索
                searchWithEngine(searchTerm);
            }
        }
    });
    
    // 初始化搜索框提示文本
    updateSearchPlaceholder();
}

// 更新搜索框的提示文本
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('favorites-search-input');
    const engineNames = {
        'baidu': '百度',
        'bing': '必应',
        'google': '谷歌'
    };
    
    searchInput.placeholder = `搜索收藏或按回车${engineNames[currentSearchEngine]}搜索...`;
}

// 使用指定的搜索引擎进行搜索
function searchWithEngine(searchTerm) {
    if (searchTerm && searchEngines[currentSearchEngine]) {
        const searchUrl = searchEngines[currentSearchEngine] + encodeURIComponent(searchTerm);
        window.open(searchUrl, '_blank');
    }
}

// 搜索收藏
function searchFavorites(searchTerm) {
    // 获取所有分类
    const categories = Object.keys(allFavoritesData);
    
    // 存储搜索结果
    const searchResults = {};
    let hasResults = false;
    
    // 遍历所有分类和收藏
    categories.forEach(category => {
        const categoryFavorites = allFavoritesData[category] || [];
        
        // 筛选符合搜索条件的收藏
        const filteredFavorites = categoryFavorites.filter(favorite => {
            const title = favorite.title.toLowerCase();
            const description = favorite.description.toLowerCase();
            
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
        
        // 如果有符合条件的收藏，添加到结果中
        if (filteredFavorites.length > 0) {
            searchResults[category] = filteredFavorites;
            hasResults = true;
        }
    });
    
    // 如果有搜索结果，渲染结果
    if (hasResults) {
        renderFavorites(searchResults, Object.keys(searchResults));
        
        // 显示所有搜索结果
        document.querySelectorAll('.category-section').forEach(section => {
            section.style.display = 'block';
        });
        
        // 高亮搜索词
        highlightSearchTerm(searchTerm);
    } else {
        // 没有结果时显示提示
        document.getElementById('favorites-content').innerHTML = `
            <div class="no-favorites">
                <i class="fas fa-search"></i>
                <p>没有找到与 "${searchTerm}" 相关的收藏</p>
                <button class="search-external-btn" onclick="searchWithEngine('${searchTerm}')">
                    使用${currentSearchEngine === 'baidu' ? '百度' : (currentSearchEngine === 'bing' ? '必应' : '谷歌')}搜索 "${searchTerm}"
                </button>
            </div>
        `;
    }
    
    // 取消分类导航的选中状态
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
}

// 重置搜索，恢复原始显示
function resetSearch() {
    // 重新渲染所有收藏
    renderFavorites(allFavoritesData, Object.keys(allFavoritesData));
    
    // 只显示第一个分类
    document.querySelectorAll('.category-section').forEach((section, index) => {
        section.style.display = index === 0 ? 'block' : 'none';
    });
    
    // 重新选中第一个分类
    document.querySelectorAll('.category-item').forEach((item, index) => {
        if (index === 0) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 高亮搜索词
function highlightSearchTerm(searchTerm) {
    // 获取所有标题和描述
    const titles = document.querySelectorAll('.favorite-title');
    const descriptions = document.querySelectorAll('.favorite-description');
    
    // 高亮函数
    const highlight = (element, term) => {
        const text = element.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
    };
    
    // 高亮标题
    titles.forEach(title => highlight(title, searchTerm));
    
    // 高亮描述
    descriptions.forEach(desc => highlight(desc, searchTerm));
}

// 暴露给全局的搜索函数，用于在没有搜索结果时的按钮点击
window.searchWithEngine = function(searchTerm) {
    if (searchTerm && searchEngines[currentSearchEngine]) {
        const searchUrl = searchEngines[currentSearchEngine] + encodeURIComponent(searchTerm);
        window.open(searchUrl, '_blank');
    }
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadFavorites);