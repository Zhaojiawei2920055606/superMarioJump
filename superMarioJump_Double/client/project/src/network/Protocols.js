/**
 * Created by yangyanfei on 15/5/27.
 */




var MsgId = {
    msgId_playersInfo : 801,//服务器自动下发的玩家信息的消息
    msgId_exit:802,//对方退出的消息
    msgId_percent:200,//进度
    msgId_jump : 201,// 跳转到游戏场景的消息
    msgId_readyGo:204,//校准时间
    msgId_gameOver:205,          //游戏结束
    msgId_move:206,//移动
    msgId_dead:207,//掉落
    msgId_teamId:300,//掉落
    msgId_webSocketClosed:1001,
    msgId_connect:199,
    sendPercentMsg:function (percent) {
        var msg=new progressMsg();
        msg.content.percent=percent;
        if(tz_network)
            tz_network.sendMessage(msg);
    },
    sendMoveMsg:function (x,y,dirction,invert,index,right) {
        var msg=new moveMsg();
        msg.content.x=x;
        msg.content.y=y;
        msg.content.dirction=dirction;
        msg.content.invert=invert;
        msg.content.index=index;
        msg.content.right=right;
        if(tz_network)
            tz_network.sendMessage(msg);
    },
    sendOverMsg:function () {
        var msg=new overMsg();
        if(tz_network)
            tz_network.sendMessage(msg);
    },
    sendTeamMsg:function () {
        var msg=new teamMsg();
        if(tz_network)
            tz_network.sendMessage(msg);
    },
    
};
var ReadyGoMsg = function(){
    this.msgId = MsgId.msgId_readyGo;
    this.content={
    }
};
var progressMsg = function(){
    this.msgId = MsgId.msgId_percent;
    this.content = {
        percent:0
    }
};
var moveMsg = function(){
    this.msgId = MsgId.msgId_move;
    this.content = {
        x:0,
        y:0,
        dirction:0,
        invert:false,
        index:0,
        right:true
    }
};
var teamMsg = function(){
    this.msgId = MsgId.msgId_teamId;
    this.content = {

    }
};
var overMsg = function(){
    this.msgId = MsgId.msgId_gameOver;
    this.content = {
    }
};



