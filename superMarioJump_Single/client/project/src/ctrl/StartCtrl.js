/**
 * Created by tongzhuogame on 2017/9/5.
 */
cc.BuilderReader.registerController("StartCtrl",{
    onDidLoadFromCCB:function(){
        this["currScore"].setString(GameTool.getFormatTime(SF_INFO.currScore*1000));
        this["bestScore"].setString(GameTool.getFormatTime(SF_INFO.bestScore*1000));
        if(SF_INFO.bestScore==SF_INFO.currScore&&SF_INFO.bestScore!=0)
        {
            this["zuijiaSp"].setVisible(true);
        }
    },
    completedAnimationSequenceNamed:function(animationName){

    },
    playCCBAction:function(actionName){
        this.rootNode.animationManager.runAnimationsForSequenceNamed(actionName);
    },
    'MenuCallBack':function (pSender,controlEvent) {
        switch(controlEvent) {
            case cc.CONTROL_EVENT_TOUCH_DOWN:{
                pSender.setScale(0.8);
                break;
            }
            case cc.CONTROL_EVENT_TOUCH_DRAG_OUTSIDE:{
                pSender.setScale(1);
                break;
            }
            case cc.CONTROL_EVENT_TOUCH_UP_INSIDE:{
                pSender.setScale(1);
                cc.audioEngine.playEffect(res_gaming.DI_mp3,false);
                switch (pSender.getTag())
                {
                    //开始游戏按钮
                    case 1:
                        cc.log("开始游戏按钮");
                        this.delegate.playGoAction();
                        break;
                    //商城按钮
                    case 2:
                        cc.log("退出按钮");
                        hideGame(Math.floor(SF_INFO.bestScore*100)/100);
                        break;
                }
            }

        }
    },

});