/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("GameCtrl",{
    _scorllLayer:null,
    _ui_di:null,
    _uiLayer1:null,

    onDidLoadFromCCB:function(){
        // this.initPlayerInfo();
        this._scorllLayer=this["scrollLayer"];
         this._ui_di=this["ui_di_1"];
        this.delegate._size=this._scorllLayer.getContentSize();


    },
    completedAnimationSequenceNamed:function(animationName){

    },

    playCCBAction:function (actionName) {
        this.rootNode.animationManager.runAnimationsForSequenceNamed(actionName);
    },
    //初始化玩家的头像 和 名字
    initPlayerInfo: function () {
        //设置头像
        if(SF_INFO.iconUrl)
        {
            cc.loader.loadImg(SF_INFO.iconUrl, function(err,img){
                var sprite  = new cc.Sprite(img);
                if(sprite){

                    var sfHeadBg = this["sf_head_bg"];
                    var headBgSize = sfHeadBg.getContentSize();

                    var headSp = GameTool.getHead(sprite);
                    headSp.setPosition(cc.p(headBgSize.width * 0.5,headBgSize.height * 0.5));
                    sfHeadBg.addChild(headSp);
                }
            }.bind(this));
        }

        if(OP_INFO.iconUrl)
        {
            cc.loader.loadImg(OP_INFO.iconUrl, function(err,img){
                var sprite  = new cc.Sprite(img);
                if(sprite){
                    var opHeadBg = this["op_head_bg"];
                    var headBgSize = opHeadBg.getContentSize();

                    var headSp = GameTool.getHead(sprite);
                    headSp.setPosition(cc.p(headBgSize.width * 0.5,headBgSize.height * 0.5));
                    opHeadBg.addChild(headSp);
                }

            }.bind(this));
        }
    },
    "Menucallback":function(pSender,controlEvent){
        switch(controlEvent) {
            case cc.CONTROL_EVENT_TOUCH_DOWN:{
                pSender.setScale(0.85);
                break;
            }
            case cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE:{
                 pSender.setScale(0.1);
                break;
            }
            case cc.CONTROL_EVENT_TOUCH_UP_INSIDE:{
                 pSender.setScale(0.1);
                switch (pSender.getTag())
                {
                    case 0:
                        break;
                }

            }

        }

    }
});