/**
 * Created by yangyanfei on 6/6/16.
 */


var GameTool = {

    _startTime:0,
    _endTime:0,
    _totalTime:0,
    _listeners:[],
    getHead:function(sp){
        sp.setScaleX(GM_INFO.headWidth/sp.getContentSize().width);
        sp.setScaleY(GM_INFO.headHeight/sp.getContentSize().height);
        return sp;
    },
    //获取圆形的头像
    getCircularHead:function(sp){
        sp.setScaleX(GM_INFO.headWidth/sp.getContentSize().width);
        sp.setScaleY(GM_INFO.headHeight/sp.getContentSize().height);
        var testStencil = cc.DrawNode.create();
        var nCount = 400;
        var circleArray = [];
        var angel = 2.0 * Math.PI/nCount;
        for(var i = 0 ; i< nCount ; i++)
        {
            var radian = i * angel;
            circleArray.push(cc.p(GM_INFO.headWidth/2 * Math.cos(radian),GM_INFO.headHeight/2 * Math.sin(radian)))
        }
        testStencil.drawPoly(circleArray,nCount,cc.RED,0,cc.RED);
        var clipper = new cc.ClippingNode(testStencil);
        clipper.addChild(sp);
        return clipper;
    },
    getSeedRandom:function(min,max){//包含min 不包含max
        max = max || 1;
        min = min || 0;
        GM_INFO.currSeed = (GM_INFO.currSeed * 9301 + 49297) % 233280;
        var rnd = GM_INFO.currSeed / 233280.0;

        var tmp = min + rnd * (max - min);
        return parseInt(tmp);
    },

    getTip:function(){
        var index = Math.floor(Math.random() * 3) + 1;
        switch (index){
            case 1:
            {
                return "合理的移动，让对手无法轻易投篮成功。"
            }
            case 2:
            {
                return "谨慎对待每一次投篮，过于草率的投篮无疑是浪费进攻机会。"
            }
            case 3:
            {
                return "当对方的位置利于你投篮命中时，你的位置也同样会被轻易投中。"
            }
        }
    },

    addCustomListener:function(msgId,callback,target){
        cc.eventManager.addCustomListener(msgId,callback.bind(target));
        this._listeners.push(msgId);
    },
    removeCustomListers:function(){
        var len = this._listeners.length;
        for(var i = len -1;i >=0 ;i--){
            cc.eventManager.removeCustomListeners(this._listeners.splice(i,1));
        }
    },
    begainTiming:function(){
        this._startTime = new Date().getTime();

    },
    endTiming:function(){
        var endTime = new Date().getTime();
        this._endTime = endTime;
        this._totalTime = this._endTime  - this._startTime;
    },

    getFormatTime:function(totalTime){

        var date = new Date();
        date.setTime(totalTime);

        var ms = date.getMilliseconds();
        // var msString = date.getMilliseconds();
        var msString = parseInt(ms/10)%100;

        var secondString = date.getSeconds();

        var minString = date.getMinutes();

        if(msString < 10){
            msString = "0" + msString;
        }
        if(secondString < 10){
            secondString = "0" + secondString;
        }
        secondString = secondString + ":";

        if(minString < 10){
            minString = "0" + minString;
        }
        minString = minString + ":";

        return minString  + secondString + msString;

    },

    //创建帧动画
    createFrameAction:function(minNum,maxNum,name,time,isRestoreOriginalFrame,isRepeatForever){
        var animation = new cc.Animation();
        for(var i = minNum;i <= maxNum;i++){
            var frameName = name + i + ".png";
            animation.addSpriteFrame(frameName);
        }
        animation.setDelayPerUnit(time);//0.2
        animation.setRestoreOriginalFrame(isRestoreOriginalFrame);//false
        var action = null;
        if(isRepeatForever == true){
            action = cc.animate(animation).repeatForever();
        }else{
            action = cc.animate(animation);
        }
        return action;
    },

    isCollision:function (ra,rb) {
        var flag = cc.rectIntersectsRect(ra,rb);
        return flag;
    },

};
DIRCTION={
    NONE:0,
    LEFT:1,
    RIGHT:2
};