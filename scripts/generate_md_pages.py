#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

def generate_md_pages():
    # 获取项目根目录的路径
    root_dir = Path(__file__).parent.parent
    
    # 获取blog/posts目录下的所有.md文件
    md_files = list((root_dir / 'blog' / 'posts').glob('*.md'))
    
    # 复制模板文件到每个.md文件对应的.html文件
    template_path = root_dir / 'blog' / 'posts' / 'markdown-template.html'
    
    for md_file in md_files:
        html_file = md_file.with_suffix('.html')
        shutil.copy2(template_path, html_file)
        print(f'Generated {html_file}')

if __name__ == '__main__':
    generate_md_pages() 