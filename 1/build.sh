#!/bin/bash

##################
#
# 默认打包所有环境
# 
##################

echo "usage:"
echo "./build.sh [env]"
echo "env: test prod dev"

root=`pwd`

if [[ ! -d $root/pkgs ]] ; then 
    mkdir $root/pkgs
fi

e=(dev prod test)
case $1 in
    "dev")
        e=("dev") 
        ;;
    "prod")
        e=("prod")
        ;;
    "test")
        e=("test")
        ;;
    * )
esac

for ee in ${e[@]} 
do
    ENV=$ee npm run build 
    cd $root/dist
    filename="$ee.zip" 
    rm -rf "$root/pkgs/$ee.zip"
    zip -r $filename ./*
    mv $filename $root/pkgs/
done
