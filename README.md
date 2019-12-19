# electron-vue-admin

> An electron-vue project

This is a vue electron admin project base on  [vueAdmin-template](https://github.com/PanJiaChen/vueAdmin-template) , and was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron app for production
npm run build

# lint all JS/Vue component files in `app/src`
npm run lint

# run webpack in production
npm run pack
```
---
## 发布注意

``` bash
# 发布web版本
npm run build:web
注释掉引入electron更新相关的代码
修改 config 以及package.json里面的url配置

# 发布exe包
npm run build
路径不能有中文目录
打包后上传.yml和包到package.json中配置的url下
包的版本是根据package.json中的version来控制的
修改iis的MIME规则支持.yml文件

----注：littleseven
```
---

