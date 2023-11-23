# Simple (WIP) 

A selfhost server for simplify data works.

this project should be rewrite, for the following reason:

- we want the server has ability to connect database as much as possible
- we want develop features as fast as possible

## Feature

comming soon

## Usage

1. Clone project

    ```bash
    git clone https://github.com/rainbowatcher/simple
    ```

2. Start project

    ```bash
    pnpm start
    ```


### Docker

1. Build source file

    ```bash
    pnpm build
    ```

2. Build docker image

    ```bash
    docker buildx build . -t simple:latest
    ```

3. Run the image.

    ```bash
    docker run --rm -it -p 3210:3210 simple:latest
    ```

## Roadmap

- [x] settings
- [x] datasource management
- [x] template management
- [ ] data work page
- [ ] data type mapping management
- [ ] dashboard page
- [ ] I18n support

## License

[MIT](./LICENSE) &copy; Made by ❤️