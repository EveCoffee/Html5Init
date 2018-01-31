# 项目初始化说明

请先将项目clone到本地，然后执行**npm install**，安装无报错之后执行**npm start**。

### 使用的技术:

+ gulp + webpack
+ ECMAScript2015 + TypeScript
+ scss

### 项目结构:

+ **./es2015** js源码目录(es2015/typescript), 输出到 **./js/**
+ **./scss** scss源码目录, 输出到 **./css/**
+ html文件就在当前目录

### 项目启动要求
+ nodejs  4.4版本以上
+ Linux或者MacOS环境。 Windows 10用户可以安装WSL来运行。 

+ gulp auto 启动项目工作流
+ gulp build 项目打包,项目的images, css, js, 根目录的*.html都会按照结构输出到 **dist/**

### 项目说明

+ 自动对es2015以上新语法进行babel转译，同时支持typescript。在es2015目录下的每个.ts和.js文件都视为一个webpack入口。如果需要划分模块请在里面继续新建子文件夹。文件输出到**./js**

+ 支持scss。 所有scss下的xxx.scss会自动编译到**./css**目录同名css文件。

+ 移动端rem支持。 目前针对750px下的设计稿增加了自动将px转换为rem单位。 目前为测试特性，需要手动引入js/common.js（自动计算html元素的字体大小）, 然后在**gulpfile.babel.js**文件中找到**taskScss.enablePX2REM(false);** 将参数**false**改为**true**即可。

+ 打包项目。 当源码需要交付给后台时候，使用**npm run build**命令， 会自动将当前需要的文件自动输出到dist目录。只需要交付dist目录下的文件即可。
