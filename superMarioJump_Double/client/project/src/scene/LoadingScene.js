/**
 * Created by yangyanfei on 15/5/23.
 */

var LoadingScene = BaseScene.extend({
    _isLoaded : false,
    _isJump : false,
    _isPlayerInfo:false,
    _loadingCtrl:null,
    onEnter: function () {
        this._super();

        this.addListeners();
        this.loadLoading();







        // navigator.vibrate = navigator.vibrate
        //     || navigator.webkitVibrate
        //     || navigator.mozVibrate
        //     || navigator.msVibrate;
    },

    onExit:function(){
        this._super();
        this.removeListeners();
    },
    updateInfo:function () {

        if(!this._isPlayerInfo)
        {
            if(OP_INFO.iconUrl)
            {
                cc.loader.loadImg(OP_INFO.iconUrl, function(err,img){
                    var sprite  = new cc.Sprite(img);
                    if(sprite){
                        var opHeadBg = this._loadingCtrl["op_head_bg"];
                        var headBgSize = opHeadBg.getContentSize();

                        var headSp = GameTool.getHead(sprite);
                        headSp.setPosition(cc.p(headBgSize.width * 0.5,headBgSize.height * 0.5));
                        opHeadBg.addChild(headSp);
                    }

                }.bind(this));
            }

            if(OP_INFO.nickname)
            {
                this._loadingCtrl["name2"].setString(OP_INFO.nickname);
            }
            if(OP_INFO.percent!=0)
            {
                this._loadingCtrl["precent2"].setString(OP_INFO.percent+"%");
            }
            this._isPlayerInfo=true;
        }


    },

    addListeners:function(){
        this._super();
        GameTool.addCustomListener(MsgId.msgId_connect,this.receiveConnetMsg,this);
        GameTool.addCustomListener(MsgId.msgId_playersInfo,this.receivePlayersInfoMsg,this);
        GameTool.addCustomListener(MsgId.msgId_jump,this.receiveJumpMsg,this);
        GameTool.addCustomListener(MsgId.msgId_percent,this.receiveProgressMsg,this);
        GameTool.addCustomListener(MsgId.msgId_teamId,this.receivejump);
        GameTool.addCustomListener(MsgId.msgId_connect,this.connect);
    },

    loadLoading:function(){
        var self = this;
        cc.loader.load(g_resources_loading,
            function (result, count, loadedCount) {
            }, function () {
                cc.spriteFrameCache.addSpriteFrames(res_loading.loading_plist,res_loading.loading_png);
                self._loadingCtrl = self.addCCBI(res_loading.loading_ccb);
                if(!global_debug)tz_network.openConnect();
                self.loadGaming();
                self.updateInfo();
                startLoading();
                self.scheduleUpdate();
            });
    },
    loadGaming:function(){
        var self = this;
        cc.loader.load(g_resources_gaming,
            function (result, count, loadedCount) {
                var percent = ((loadedCount+1) / count * 100) | 0;
                percent = Math.min(percent, 100);
                SF_INFO.percent=percent;
                MsgId.sendPercentMsg(percent);
                self._loadingCtrl["precent1"].setString(percent+"%");
            }, function () {
                self._isLoaded = true;
                cc.log("_isLoaded = true");
                if(global_debug)
                {
                    cc.loader.load(g_resource_emotion, function (result, count, loadedCount) {
                    }, function () {
                        cc.director.runScene(new cc.TransitionFade(0.8,new GameScene()));
                    })
                }
                //cc.director.runScene(new cc.TransitionFade(0.8,new GameScene()));
            });
    },
    update:function(dt){
        //接受到开始消息后跳转到游戏场景
        this.updateInfo();
        if(this._isLoaded  && (this._isJump || OP_INFO.isExit)){
            cc.log("跳转场景");
            this.unscheduleUpdate();
            cc.loader.load(g_resource_emotion, function (result, count, loadedCount) {
            }, function () {
             cc.director.runScene(new cc.TransitionFade(0.8,new GameScene()));
            })

        }
    },

    receivePlayersInfoMsg:function(event){
        var data = event.getUserData();
        var opPlayer = data.opPlayer;
        OP_INFO.userId = opPlayer["userId"];
        OP_INFO.nickname = opPlayer["nickname"];
        OP_INFO.iconUrl = opPlayer["iconUrl"];
        OP_INFO.skin = opPlayer["skin"];
        this._loadingCtrl.changeName();
        this._loadingCtrl.initPlayerInfo();
        this._loadingCtrl["precent2"].setString(opPlayer["progress"]+ "%");
        this._isPlayerInfo = true;
    },
    receiveJumpMsg:function(event){
        var data = event.getUserData();
        GM_INFO.currSeed = data["seed"];
        GM_INFO.nextSeed = data["seed"];
        this._isJump = true;
        cc.log("_isJump = true");
    },
    receiveProgressMsg:function (event) {
        var data = event.getUserData();
        var percent=data["percent"];
        this._loadingCtrl["precent2"].setString(percent+"%");
    },
    receiveConnetMsg:function () {
        MsgId.sendPercentMsg(SF_INFO.percent);
    },

    connect:function () {
        MsgId.sendTeamMsg();
    },

    receivejump:function (event) {
        var data = event.getUserData();
        SF_INFO.teamId=data["team"];
        OP_INFO.teamId = SF_INFO.teamId==1?2:1;
        this._loadingCtrl["role_"+SF_INFO.teamId].setVisible(true);
    }
});