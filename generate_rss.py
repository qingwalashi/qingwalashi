#!/usr/bin/env python3
import yaml
import datetime
from pathlib import Path

def generate_rss():
    # 读取YAML文件
    with open('blog-index.yaml', 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    
    # 获取文章列表并按日期排序
    articles = data['articles']
    articles.sort(key=lambda x: x['date'], reverse=True)
    
    # 生成RSS内容
    rss_content = f'''<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>QLWS｜调温而行</title>
        <link>https://blog.qingwalashi.cn</link>
        <description>分享技术、工具和创意的个人博客</description>
        <language>zh-CN</language>
        <lastBuildDate>{datetime.datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')}</lastBuildDate>
        <atom:link href="https://blog.qingwalashi.cn/rss.xml" rel="self" type="application/rss+xml" />
'''
    
    # 添加文章条目
    for article in articles:
        link = article['url'] if article['type'] == 'link' else article['path']
        pub_date = datetime.datetime.strptime(article['date'], '%Y-%m-%d').strftime('%a, %d %b %Y %H:%M:%S GMT')
        
        rss_content += f'''
        <item>
            <title><![CDATA[{article['title']}]]></title>
            <link>https://blog.qingwalashi.cn{link}</link>
            <description><![CDATA[{article['description']}]]></description>
            <pubDate>{pub_date}</pubDate>
            <guid>https://blog.qingwalashi.cn{link}</guid>
        </item>'''
    
    rss_content += '''
    </channel>
</rss>'''
    
    # 保存RSS文件
    with open('rss.xml', 'w', encoding='utf-8') as f:
        f.write(rss_content)
    
    print('RSS file generated successfully!')

if __name__ == '__main__':
    generate_rss() 