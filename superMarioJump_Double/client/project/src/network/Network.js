/**
 * Created by yangyanfei on 15/5/27.
 */

global_debug = false;
// tz_url.serverUrl = "ws://192.168.1.47:9501";
// tz_url.roomId = "SuperMarioJump";
//  // tz_url.userId = "user1";
// tz_url.nickname = "😆&&&&&&&&";
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

