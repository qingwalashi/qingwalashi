# QLWS｜调温而行

一个简洁优雅的个人博客网站，支持Markdown文章渲染和RSS订阅。

## 项目目录结构

```
.
├── README.md                      # 项目说明文档
├── index.html                     # 网站首页
├── 404.html                       # 404错误页面
├── tags.html                      # 标签页面
├── blog-index.yaml               # 博客文章索引配置
├── tools-index.yaml              # 工具页面索引配置
├── resources-index.yaml          # 资源页面索引配置
├── rss.xml                       # RSS订阅源
├── edgeone.json                  # EdgeOne配置文件
├── favicon.ico                   # 网站图标
├── requirements.txt              # Python依赖配置
├── generate_rss.py               # RSS生成脚本
├── generate_md_pages.py          # Markdown页面生成脚本
├── pages/                        # 存放工具页面
│   └── tools.html                # 工具页面
├── resources/                    # 资源相关文件
│   └── *.html                    # 资源页面
├── blog/                         # 博客相关文件
│   └── posts/                    # 博客文章目录
│       ├── markdown-template.html # Markdown渲染模板
│       ├── *.md                  # Markdown文章
│       └── *.html                # HTML文章
└── assets/                       # 静态资源文件
    ├── css/                      # 样式文件
    │   └── style.css            # 主样式文件
    ├── js/                       # JavaScript文件
    │   ├── main.js              # 主脚本文件
    │   ├── tags.js              # 标签页面脚本
    │   ├── rss.js               # RSS生成脚本
    │   └── components.js        # 组件加载脚本
    └── components/              # 可复用组件
        ├── navbar.html          # 导航栏组件
        └── footer.html          # 页脚组件
```

## Python脚本说明

### generate_rss.py

RSS订阅源生成脚本，用于自动生成网站的RSS订阅源。

使用方法：
```bash
python3 generate_rss.py
```

功能：
- 读取 `blog-index.yaml` 中的文章信息
- 按日期降序排序文章
- 生成符合RSS 2.0规范的XML文件
- 自动更新 `rss.xml` 文件

### generate_md_pages.py

Markdown页面生成脚本，用于将Markdown文章转换为HTML页面。

使用方法：
```bash
python3 generate_md_pages.py
```

功能：
- 扫描 `blog/posts` 目录下的所有 `.md` 文件
- 为每个Markdown文件生成对应的HTML页面
- 使用 `markdown-template.html` 作为模板
- 保持与网站整体风格一致的样式

## 文章管理

1. 在 `blog/posts` 目录下创建Markdown文件
2. 在 `blog-index.yaml` 中添加文章信息：
   ```yaml
   articles:
     - title: "文章标题"
       date: "YYYY-MM-DD"
       description: "文章描述"
       tags: ["标签1", "标签2"]
       type: "md"
       path: "/blog/posts/your-article.md"
   ```
3. 运行 `generate_md_pages.py` 生成HTML页面
4. 运行 `generate_rss.py` 更新RSS订阅源

## 工具页面管理

1. 在 `pages` 目录下创建工具页面
2. 在 `tools-index.yaml` 中添加工具信息：
   ```yaml
   tools:
     - title: "工具名称"
       description: "工具描述"
       path: "/pages/tool-name.html"
   ```

## 资源页面管理

1. 在 `resources` 目录下创建资源页面
2. 在 `resources-index.yaml` 中添加资源信息：
   ```yaml
   resources:
     - title: "资源名称"
       description: "资源描述"
       path: "/resources/resource-name.html"
   ```

## 开发说明

- 使用纯静态HTML/CSS/JavaScript构建
- 支持Markdown文章渲染
- 响应式设计，适配移动设备
- 支持RSS订阅
- 使用YAML管理文章、工具和资源索引
- 组件化设计，易于维护和扩展
- 使用Python脚本自动化内容生成