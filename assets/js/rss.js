// RSS生成脚本
async function generateRSS() {
    try {
        const response = await fetch('./blog-index.yaml');
        const text = await response.text();
        const articles = jsyaml.load(text).articles;
        
        // 按日期降序排序
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 生成RSS内容
        const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>QLWS｜调温而行</title>
        <link>https://blog.qingwalashi.cn</link>
        <description>分享技术、工具和创意的个人博客</description>
        <language>zh-CN</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="https://blog.qingwalashi.cn/rss.xml" rel="self" type="application/rss+xml" />
        ${articles.map(article => `
        <item>
            <title><![CDATA[${article.title}]]></title>
            <link>https://blog.qingwalashi.cn${article.type === 'link' ? article.url : article.path}</link>
            <description><![CDATA[${article.description}]]></description>
            <pubDate>${new Date(article.date).toUTCString()}</pubDate>
            <guid>https://blog.qingwalashi.cn${article.type === 'link' ? article.url : article.path}</guid>
        </item>
        `).join('')}
    </channel>
</rss>`;

        // 保存RSS文件
        const blob = new Blob([rssContent], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rss.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating RSS:', error);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', generateRSS); 