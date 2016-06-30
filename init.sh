#! /bin/bash

mkdir scss css images js es2015
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/.babelrc
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/config.rb
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/package.json
wget https://raw.githubusercontent.com/EveCoffee/Html5Init/master/gulpfile.babel.js

npm install
npm install gulp-sass