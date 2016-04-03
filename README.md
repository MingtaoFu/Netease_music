# Netease_music
使用web api的网易云音乐客户端

The Netease_music client that uses web api.

基于NW.js编写。

##已测试的环境
ArchLinux

##利用源码运行本程序

下载NW.js
https://github.com/nwjs/nw.js

```
git clone https://github.com/MingtaoFu/Netease_music.git
```

```
cd Netease_music
```

```
nw .
```

**注： 请确保您的电脑上有curl并在环境变量中有.**
在 scripts/main.js 中有一个使用 curl 发送的请求，这样做是因为我用除此之外的方法请求都无法得到理想的结果（搜索音乐的接口）。
若您能很好地解决该问题，请联系我，非常感谢。

##当前进度
完成搜索与播放功能，播放功能尚存在许多缺陷。


**该项目仅供学习使用，如有侵权，请联系我：madebyrag@gmail.com**
