// 加载组件
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // 设置当前页面的导航链接激活状态
        if (elementId === 'navbar-container') {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
            
            // 初始化移动端菜单
            initMobileMenu();
            
            // 确保移动端汉堡菜单按钮显示
            ensureMobileMenuButtonVisible();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// 确保移动端汉堡菜单按钮显示
function ensureMobileMenuButtonVisible() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    if (menuToggle && window.innerWidth <= 768) {
        menuToggle.style.display = 'flex';
        
        // 设置按钮位置
        menuToggle.style.position = 'absolute';
        menuToggle.style.right = '1rem';
        menuToggle.style.top = '50%';
        menuToggle.style.transform = 'translateY(-50%)';
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        if (menuToggle) {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'flex';
            } else {
                menuToggle.style.display = 'none';
            }
        }
    });
}

// 初始化移动端菜单
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        // 确保菜单初始状态是关闭的
        navLinks.classList.remove('show');
        
        // 处理菜单点击事件
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // 阻止事件冒泡
            navLinks.classList.toggle('show');
            
            // 切换图标（简单的切换，不要太夸张的效果）
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('show')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // 点击导航链接后关闭菜单
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !menuToggle.contains(event.target) && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
    }
}

// 初始化百度统计
function initBaiduAnalytics() {
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f1b574c8534c433188b1beb557854e43";  // 请替换为您的百度统计ID
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    })();
}

// 页面加载完成后加载组件
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-container', '/assets/components/navbar.html');
    loadComponent('footer-container', '/assets/components/footer.html');
    initBaiduAnalytics();
    
    // 额外确保移动端汉堡菜单按钮显示
    setTimeout(() => {
        ensureMobileMenuButtonVisible();
    }, 500);
}); 