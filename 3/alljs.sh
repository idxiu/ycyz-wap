#!/bin/bash

targeTpath=`pwd`
that_path=$targeTpath'/src'
this_path=$targeTpath'/build'
dist_path=$targeTpath'/dist'

rm -r $this_path'/src'
# echo $this_path
cp -r $that_path $this_path
rm -r dist
cd ./build
npm run build
rm -r $dist_path'/img'
rm -r $dist_path'/fonts'
cd ../
node uglify.js
# dist_path=$targeTpath'/dist'
# assets=$dist_path'/assets'
# cd $assets
# mv * ../
# rm -r $assets
echo "\033[32m 打包完成 \033[0m" 