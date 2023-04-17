## Simple (开发中)

一个专注简化数据工作的自托管的服务

## 特性

很快就会有

## 使用

1. 克隆项目

    ```bash
    git clone https://github.com/rainbowatcher/simple
    ```

2. 启动项目

    ```bash
    pnpm start
    ```

### Docker

1. 构建项目

    ```bash
    pnpm build
    ```

2. 构建 docker 镜像

    ```bash
    docker buildx build . -t simple:latest
    ```

3. 运行镜像

    ```bash
    docker run --rm -it -p 3210:3210 simple:latest
    ```

## 开发计划

- [x] 设置页面
- [x] 数据源管理
- [x] 模板管理
- [ ] 数据工作页面
- [ ] 数据类型映射管理
- [ ] 首页看板
- [ ] I18n支持

## 开源协议

[MIT](./LICENSE) &copy; Made by ❤️