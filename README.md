# ES6 Dessert

> ES6小点心系列，包括通用弹窗，楼层定位，倒计时等等。

![](./images/dessert.jpg)

前端业务逻辑主要分为【交互效果】和【数据展示】两方面。数据展示可使用 MVVM 框架来实现。前端的交互效果常用的也就那么几种，比如弹窗，楼层定位，倒计时，下拉刷新，上拉加载更多等等。这些交互效果完全可以提出来做成通用的模块，以后不必再劳心费神去想怎么实现。就像 Swiper 封装了一个类来专门做轮播图一样，本系列的目的是通过封装一系列类来实现弹窗，楼层定位，倒计时等交互功能。

## 目标

1. 易用性，如果自己都觉得难用，那就没有分享的必要了￣□￣｜｜；
2. 兼容性，兼容主流浏览器，但并非所有（比如 IE 低版本）；
3. 移动优先，主要为移动端做更多的考虑；

## 安装

### NPM

如果使用了诸如 webpack 或 rollup 之类的模块打包器，可直接通过 npm 安装：

```
$ npm i -D es6-dessert
```

在文件中进行引用：

```js
import {NormalPopup} from 'es6-dessert'
```

### 直接用 `<script>` 引入

直接下载并用 &lt;script> 标签引入，es6-dessert.js 会注册一个全局变量 `es6Dessert`。接下来就可以使用 `es6Dessert.NormalPopup`，`es6Dessert.CountDown` 等去食用里面的小点心了。

<table>
  <thead><tr><th>开发环境</th><th>生产环境</th><th>描述</th></tr></thead>
  <tbody>
  <tr>
    <td><a href="https://unpkg.com/es6-dessert/dist/es6-dessert.js">es6-dessert.js</a></td>
    <td><a href="https://unpkg.com/es6-dessert/dist/es6-dessert.min.js">es6-dessert.min.js</a></td>
    <td>包含通用弹窗，倒计时，楼层定位等所有小点心</td>
  </tr>
  </tbody>
</table>

## API风格

本系列均效仿 Swiper 的 API 风格，力求 Keep It Simple and Stupid。只需要相对宽松有序的 DOM 结构和一致的实例化风格，That's it，多一点不人性化的东西算俄输。

## 小点心列表

<table>
  <thead><tr><th>模块</th><th>描述</th></tr></thead>
  <tbody>
  <tr>
    <td><a href="https://dom-bro.github.io/%E6%95%88%E6%9E%9C/effect_04_%E9%80%9A%E7%94%A8%E5%BC%B9%E7%AA%97/index.html">通用弹窗</a></td>
    <td>最常用，最普通的弹窗形式</td>
  </tr>
  </tbody>
</table>
