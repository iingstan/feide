 [![view on npm](http://img.shields.io/npm/v/feide.svg)](https://www.npmjs.org/package/feide)
[![npm module downloads per month](http://img.shields.io/npm/dm/feide.svg)](https://www.npmjs.org/package/feide) 

feide
=========
前端集成开发环境  Front-end integrated development environment

前端开发的一个Node工具集成开发环境

包含：

* 基于webpack的JS模块化开发环境
* 基于handlebars的，类似于".net mvc razor引擎"的HTML模块化开发环境
* 基于Less的CSS模块化开发环境

还有一些其他帮助前端开发的功能：

* 网址Url代理功能

具体参考程序界面的帮助说明

安装
---------

**Npm 全局安装**

	npm install feide -g

**Npm 项目本地安装**

	npm install feide --save-d

依赖包比较多，建议国内用[淘宝镜像cnpm](https://npm.taobao.org/)安装

运行
--------

在项目文件夹下运行CLI命令行

**如果是全局安装**

	feide --log

**如果是本地安装**

	.\node_modules\.bin\feide --log

--log参数可以打开运行信息，建议使用

第一次打开，会先进行初始化设置，会在项目文件夹下建立一个 feide.config.json 配置文件

其他使用说明可参考集成环境的里面带的帮助说明