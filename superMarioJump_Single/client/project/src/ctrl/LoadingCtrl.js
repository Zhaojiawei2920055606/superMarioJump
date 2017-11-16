/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("LoadingCtrl",{
    onDidLoadFromCCB:function(){
        this.addProgressTimer();
    },
    completedAnimationSequenceNamed:function(animationName){

    },
    addProgressTimer:function(){
        this._progress = new cc.ProgressTimer(new cc.Sprite("#loading_3.png"));
        this._progress.setType(cc.ProgressTimer.TYPE_BAR);
        this._progress.setMidpoint(cc.p(0,0.5));
        this._progress.setAnchorPoint(cc.p(0,0));
        this._progress.setBarChangeRate(cc.p(1,0));
        this["progressBg"].addChild(this._progress);
    },
});