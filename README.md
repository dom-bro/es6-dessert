# ES6 Dessert

> ES6小点心系列，包括通用弹窗，楼层定位，倒计时等等。

![](./images/dessert.jpg)

前端业务逻辑主要分为【交互效果】和【数据展示】两方面。数据展示可使用 MVVM 框架来实现。前端的交互效果常用的也就那么几种，比如弹窗，楼层定位，倒计时，下拉刷新，上拉加载更多等等。这些交互效果完全可以提出来做成通用的模块，以后不必再劳心费神去想怎么实现。就像 Swiper 封装了一个类来专门做轮播图一样，本系列的目的是通过封装一系列类来实现弹窗，楼层定位，倒计时等交互功能。

## 目标

1. 易用性，如果自己都觉得难用，那就没有分享的必要了￣□￣｜｜；
2. 兼容性，兼容主流浏览器，但并非所有（比如 IE6-8 等低版本）；
3. 移动优先，主要为移动端做更多的考虑；

## 依赖 jQuery

由于需要操作DOM，果断选择了王者级库——jQuery。但这可能会限制小点心的机动性，毕竟 MVVM 使得越来越多的项目逐渐去 jQuery 化。因此打算在小点心家族成员稳定下来后将对 jQuery 的依赖去掉，就像 Swiper 老哥做的那样^_^

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

## API风格

本系列均效仿 Swiper 的 API 风格，力求 Keep It Simple and Stupid。只需要相对宽松有序的 DOM 结构和一致的实例化风格，That's it，多一点不人性化的东西算俄输。

## 小点心文件列表

<table>
<thead>
<th>小点心</th>
<th>UMD(Development)</th>
<th>UMD(Production)</th>
<th>ES Module</th>
</thead>
<tbody>
<tr><td>Full</td><td><a href="https://unpkg.com/es6-dessert/dist/es6Dessert.js">es6Dessert.js</a>(92.28kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/es6Dessert.min.js">es6Dessert.min.js</a>(45.33kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/es6Dessert.esm.js">es6Dessert.esm.js</a>(73.39kb)</td></tr><tr><td><a href="https://dom-bro.github.io/views/%E6%95%88%E6%9E%9C/effect_04_%E9%80%9A%E7%94%A8%E5%BC%B9%E7%AA%97/index">通用弹窗</a></td><td><a href="https://unpkg.com/es6-dessert/dist/NormalPopup.js">NormalPopup.js</a>(11.36kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/NormalPopup.min.js">NormalPopup.min.js</a>(5.15kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/NormalPopup.esm.js">NormalPopup.esm.js</a>(6.87kb)</td></tr><tr><td><a href="https://dom-bro.github.io/views/%E6%95%88%E6%9E%9C/effect_02_%E5%BA%95%E9%83%A8%E6%B5%AE%E7%8E%B0%E5%BC%B9%E7%AA%97/index">底部浮现弹窗</a></td><td><a href="https://unpkg.com/es6-dessert/dist/SlidePopup.js">SlidePopup.js</a>(15.99kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/SlidePopup.min.js">SlidePopup.min.js</a>(7.33kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/SlidePopup.esm.js">SlidePopup.esm.js</a>(10.77kb)</td></tr><tr><td><a href="https://dom-bro.github.io/views/%E6%95%88%E6%9E%9C/effect_00_%E6%A5%BC%E5%B1%82%E5%AE%9A%E4%BD%8D%E6%95%88%E6%9E%9C/index">楼层定位</a></td><td><a href="https://unpkg.com/es6-dessert/dist/Floor.js">Floor.js</a>(75.23kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/Floor.min.js">Floor.min.js</a>(37.09kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/Floor.esm.js">Floor.esm.js</a>(61.71kb)</td></tr><tr><td><a href="https://dom-bro.github.io/views/%E5%A4%8D%E7%94%A8/CountDown_%E5%80%92%E8%AE%A1%E6%97%B6/index">倒计时</a></td><td><a href="https://unpkg.com/es6-dessert/dist/CountDown.js">CountDown.js</a>(3.23kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/CountDown.min.js">CountDown.min.js</a>(1.40kb)</td><td><a href="https://unpkg.com/es6-dessert/dist/CountDown.esm.js">CountDown.esm.js</a>(1.99kb)</td></tr>
</tbody>
</table>

## 小点心家谱

```js
{
    Popup: {
        NormalPopup,
        SlidePopup
    },
    Floor,
    CountDown,
}
```

## 本地构建

本项目使用 rollup 进行打包。

```bash
git clone git@github.com:dom-bro/es6-dessert.git
cd es6-dessert
npm i
npm run build
```
