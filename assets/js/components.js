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
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// 页面加载完成后加载组件
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-container', '/assets/components/navbar.html');
    loadComponent('footer-container', '/assets/components/footer.html');
}); 