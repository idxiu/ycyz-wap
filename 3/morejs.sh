rm -r dist
npm run build 
targeTpath=`pwd`
dist_path=$targeTpath'/dist'
rm -r $dist_path'/img'
rm -r $dist_path'/fonts'
echo "\033[32m 打包完成 \033[0m" 