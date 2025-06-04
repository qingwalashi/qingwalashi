# Cursor 免费助手 —— Cursor Free Everyday

发现一个可以每日续杯的 Cursor 工具，提供 Windows 和 Mac 的跨平台方案

项目地址：https://github.com/agentcodee/cursor-free-everyday

## Mac 使用方法
修复mac提示损坏及修复权限问题

> 注意:每次更新工具mac会自动把权限关了,需要再手动程序上面的几个步骤

1. 第一步: 将下载的CursorPro.app拖入应用程序
2. 第二步: 打开终端复制下面这行命令到终端回车
```
chmod +x /Applications/CursorPro.app/Contents/MacOS/CursorPro && sudo xattr -rd com.apple.quarantine /Applications/CursorPro.app
```
3. 第三步: 打开设置-隐私与安全性-App管理-允许CursorPro权限
4. 第四步: 从"应用程序"中启动CursorPro再一键获取额度