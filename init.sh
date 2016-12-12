#! /bin/bash

# 初始化基本文件夹
mkdir scss css images js es2015

# 下载需要的各种依赖
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/.babelrc
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/config.rb
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/tsconfig.json
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/package.json
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/gulpfile.babel.js
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/webpack.config.babel.js

cd js
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/js/common.js

# 下载常用的scss的文件
cd ../scss
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/scss/_style.scss
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/scss/_mixins.scss
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/scss/_function.scss
cd ..

npm install
npm install gulp-sass --save-dev

#wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/init.sh