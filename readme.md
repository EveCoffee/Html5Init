#项目初始化说明

项目采用bash脚本进行快速项目构建, 依赖于Nodejs以及npm。

###使用的技术:

+ gulp + webpack
+ ECMAScript2015 + TypeScript
+ scss + compass

###项目结构:

+ es2015 js源码目录(es2015/ts), 输出到 **js/**
+ scss css源码目录(scss/compass), 输出到 **css/**

###项目启动
请确保成功执行了npm install

+ gulp auto 启动项目工作流
+ gulp build 项目打包,项目的images, css, js, 根目录的*.html都会按照结构输出到 **dist/**

###注意事项
因为webpack打包js需要提供入口文件, 所以默认在启动的时候扫描es2015下面的子文件js或者ts作为入口文件, 如果新增了入口文件,需要重启(下个版本会增加脚本自动重启)。
