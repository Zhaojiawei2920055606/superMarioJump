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
        this["trainTime"].setVisible(false);
    },
    completedAnimationSequenceNamed:function(animationName){

    },

    playCCBAction:function (actionName) {
        this.rootNode.animationManager.runAnimationsForSequenceNamed(actionName);
    },
    //初始化玩家的头像 和 名字
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