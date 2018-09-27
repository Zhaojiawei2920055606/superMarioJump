#!/bin/bash
num="1"
language="Chinese";
flag="1"

echo '1、中文'
echo '2、英语'
echo '3、法语'
echo '4、泰语'
echo '5、西班牙语'
read -p "请选择打包Web版本语言类型(请选择上面的种类的数字!!):" num
rm -rf publish && cocos compile -p web -m release

if [[ "$num" = "1" ]];then
    flag="2"
    cp -r ../design/i18n/chinese/res/* ./publish/html5/res
    language="'Chinese'"		
elif [[ "$num" = "2" ]];then
    cp -r ../design/i18n/english/res/* ./publish/html5/res
    language="'English'"		
elif [[ "$num" = "3" ]];then
    cp -r ../design/i18n/french/res/* ./publish/html5/res	
    language="'French'"	
elif [[ "$num" = "4" ]];then
    cp -r ../design/i18n/thai/res/* ./publish/html5/res	
    language="'Thai'"	
elif [[ "$num" = "5" ]];then
    flag="2"
    cp -r ../design/i18n/spanish/res/* ./publish/html5/res	
    language="'Spanish'"	
fi

if [[ "$flag" = "1" ]];then
    cd publish/html5
    sed -i 's/<script cocos src="game.min.js"><\/script>/<script src="https:\/\/cdn.ravenjs.com\/3.26.4\/raven.min.js" crossorigin="anonymous"><\/script><script> Raven.config("https:\/\/d9a39e41558141439f9726ca61f703d9@sentry.io\/1280354").install();Raven.setUserContext({id: tz_url.userId,username:tz_url.nickname});<\/script><script cocos src="game.min.js"><\/script>/g' index.html
    sed -i "s/https:\/\/game-static.new.tongzhuogame.com\/tz-sdk/https:\/\/game-static.qwikmatch.com\/tz-sdk/g" index.html
    sed -i "s/https:\/\/game-static.new.tongzhuogame.com\/tz-sdk/https:\/\/game-static.qwikmatch.com\/tz-sdk/g" game.min.js
    sed -i "s/tz_url-2.0.0/tz_url-2.0.6/g" index.html
    sed -i "s/resLanguage = 'Chinese';/resLanguage = "$language";/g" index.html
    echo '语言版本！！！！！！！！！！！！！！！！！！！！！！！！=='+"$language";  
fi
