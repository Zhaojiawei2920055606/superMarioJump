/**
 * Created by yangyanfei on 15/5/27.
 */


// var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
//
//
// //全局变量gn
// var global_isConnect = false;
// var global_debug = false;
//
// //
// // tz_url.serverUrl = "ws://192.168.0.17:8080/game-maze/game";
// // tz_url.roomId = "room_1";
// // tz_url.userId = "userId1";
// // tz_url.nickname = "张桂昌";
// // tz_url.iconUrl="http://7xjxba.com1.z0.glb.clouddn.com/14358229262529?e=1751182930&token=bz2giEcTM9os8itpIhHdGYMjBQHeaS1dkxEqLWu4:BbZGTXWyJ4GyCetpt28UbymZ384=";
//
// var NetWork = function(){
//     this.url = tz_url.serverUrl+ "?roomId=" + tz_url.roomId+ "&userId=" + tz_url.userId
//         + "&nickname=" + tz_url.nickname + "&iconUrl=" + tz_url.iconUrl+ "&skin=" + tz_url.skin;
//     this.websocket = null;
// };
//
// NetWork.prototype = { // 定义Person的prototype域
//
//     //开启连接
//      openConnect:function() {   // 定义一个print函数
//
//          var self = this;
//          this.websocket = new WebSocket(this.url);
//
//          this.websocket.onopen = function(evt) {
//              //cc.log("Send Text WS was opened ");
//              global_isConnect = true;
//              MsgId.sendPercentMsg(SF_INFO.percent);
//          };
//
//          this.websocket.onmessage = function(evt) {
//              var jsonObj = JSON.parse(evt.data);
//              //cc.log("收到消息 msgId = " + jsonObj.msgId);
//              self.receiveMessage(evt.data);
//          };
//
//          this.websocket.onerror = function(evt) {
//              // cc.log("Error was fired ");
//          };
//
//          this.websocket.onclose = function(evt) {
//              if(!global_debug)
//              {
//                  if(self.connectTimes < 6){
//                      self.connectTimes++;
//                      self.reconnect();
//                  }else{
//                      cc.eventManager.dispatchCustomEvent(MsgId.msgId_webSocketClosed);
//                  }
//              }
//          };
//      },
//
//     reconnect:function(){
//         var self = this;
//         setTimeout(function(){
//             self.openConnect();
//         },2000);
//     },
//
//     //关闭连接
//     closeConnect:function(){
//         this.websocket.close();
//     },
//
//     //发送消息
//     sendMessage:function(data){
//         if (this.websocket && this.websocket.readyState == WebSocket.OPEN){
//             var content  = JSON.stringify(data.content);
//             data.content = content;
//             var jsonStr = JSON.stringify(data);
//             this.websocket.send(jsonStr);
//         }
//     },
//
//     //接收消息
//     receiveMessage:function(data){
//         var jsonObj = JSON.parse(data);
//         var userData = JSON.parse(jsonObj.content);
//         if(jsonObj.msgId==802)
//         {
//             SF_INFO.isWin = true;
//             OP_INFO.isExit = true;
//             GM_INFO.isEnd=true;
//         }
//         cc.eventManager.dispatchCustomEvent(jsonObj.msgId,userData);
//
//     }
//
// };
// var global_network = new NetWork();


global_debug = false;
// tz_url.serverUrl = "ws://192.168.1.239:9800";
// tz_url.roomId = "room_2";
// // tz_url.userId = "user-1";
// tz_url.nickname = "😆&&&&&&";
// tz_url.iconUrl="http://7xjxba.com1.z0.glb.clouddn.com/14358229262529?e=1751182930&token=bz2giEcTM9os8itpIhHdGYMjBQHeaS1dkxEqLWu4:BbZGTXWyJ4GyCetpt28UbymZ384=";

var tz_network = new NetWork();
tz_network.receiveMessage = function (data) {
    //cc.log("data=="+data);
    var jsonObj = JSON.parse(data);
    var userData = JSON.parse(jsonObj.content);
    cc.eventManager.dispatchCustomEvent(jsonObj.msgId, userData);
    if (jsonObj.msgId == MsgId.msgId_exit) {
        OP_INFO.isExit = true;
        SF_INFO.isWin = true;
        GM_INFO.isEnd = true;
    }
    if (jsonObj.msgId == MsgId.msgId_playersInfo) {
        var opPlayer = userData.opPlayer;
        OP_INFO.userId = opPlayer["userId"];
        OP_INFO.nickname = opPlayer["nickname"];
        OP_INFO.iconUrl = opPlayer["iconUrl"];
        OP_INFO.skin = opPlayer["skin"];
        OP_INFO.percent = opPlayer["progress"];
    }
};

