/**
 * Created by yangyanfei on 6/2/16.
 */



var BaseScene = cc.Scene.extend({
    //添加事件监听
    addListeners:function(){
        GameTool.addCustomListener(cc.game.EVENT_HIDE,this.receiveEventHideMsg,this);
        GameTool.addCustomListener(cc.game.EVENT_SHOW,this.receiveEventShowMsg,this);
       // GameTool.addCustomListener(MsgId.msgId_webSocketClosed,this.receiveWebSocketClosed,this);
    },
    removeListeners:function(){
        GameTool.removeCustomListers();
    },

    addCCBI:function(ccbiResource,zOrder){
        cc.BuilderReader.setResourcePath("res/");

        zOrder = zOrder || 0;

        var node = cc.BuilderReader.load(ccbiResource,this);
        this.addChild(node,zOrder);
        return node.controller;
    },

    //添加网络异常提示的界面
    addDisconnectLayer:function(){
        var disconnectLayer = new DisconnectLayer();
        this.addChild(disconnectLayer,80000);
    },
    win:function(){

    },
    lose:function(){

    },

    receiveEventHideMsg:function(){
        //this.lose();
        cc.audioEngine.pauseMusic();
    },
    receiveEventShowMsg:function(){
        cc.audioEngine.resumeMusic();
    },
    receiveWebSocketClosed:function(){
        this.addDisconnectLayer();
    }
});

var BaseLayer = cc.Layer.extend({
    //添加事件监听
    addListeners:function(){

    },
    removeListeners:function(){
        GameTool.removeCustomListers();
    },
    addCCBI:function(ccbiResource,zOrder){
        cc.BuilderReader.setResourcePath("res/");
        zOrder = zOrder || 0;
        var node = cc.BuilderReader.load(ccbiResource,this);
        this.addChild(node,zOrder);
        return node.controller;
    },
});