/**
 * Created by yangyanfei on 16/1/1.
 */
var GM_SCENE=null;
navigator.vibrate = navigator.vibrate
    || navigator.webkitVibrate
    || navigator.mozVibrate
    || navigator.msVibrate;
function ready() {
    GM_INFO.readyFrames--;
    //cc.log("GM_INFO.readyFrames="+GM_INFO.readyFrames);
    if(GM_INFO.readyFrames==0)
    {
        GM_SCENE.gameBein();
        return;
    }
    cc.audioEngine.playEffect(res_gaming.DI_mp3,false);
    GM_SCENE._timeSp.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("ready_" + GM_INFO.readyFrames + ".png"));
    GM_SCENE._timeArr.push(setTimeout(ready,600));
}
var GameScene = BaseScene.extend({
    _wait:null,
    _gameCtrl:null,
    _uiLayer:null,
    _sfRole:null,
    _opRole:null,
    _size:null,
    _timeArr:null,
    _blockArr:null,
    _timeSp:null,
    _maxBlock:100,
    _listener:null,
    _leftButton:null,
    _rightButton:null,
    _action:false,
    _listerArr:null,
    _opRoleMoveArr:null,
    _tipArrs:null,
    _flagSp:null,
    _touch:null,
    _rankArr:null,
    _time:null,
    _resultLayer:null,
    ctor: function () {
        this._super();
        this.initData();
        this._gameCtrl=this.addCCBI(res_gaming.game_ccb);
        this.createUiLayer(2,true);
        this.createRole(OP_INFO.teamId);
        this.createRole(SF_INFO.teamId);
        this.createBlock();
        this.creatUiButton();
        // this._scoreLable=new cc.LabelTTF("并驾齐驱:0米","newFont",50);
        // this._scoreLable.setPosition(cc.winSize.width/2,cc.winSize.height-150);
        // this.addChild(this._scoreLable,10);
        this.creatRank();



        //creatRank

    },
    creatRank:function () {
        var rankBg1=new cc.Sprite("#ui_1.png");
        rankBg1.setVisible(false);
        rankBg1.setPosition(cc.winSize.width/2,cc.winSize.height-150);
        this.addChild(rankBg1);

        var rankBg2=new cc.Sprite("#ui_1.png");
        rankBg2.setVisible(false);
        rankBg2.setPosition(cc.winSize.width/2,200);
        rankBg2.setFlippedY(true);
        this.addChild(rankBg2);

        var size=rankBg1.getContentSize();
        var label1=new cc.LabelTTF("对方领先:0层","newFont",25);
        label1.setPosition(size.width/2,size.height/2-22);
        rankBg1.addChild(label1);

        var label2=new cc.LabelTTF("对方落后:0层","newFont",25);
        label2.setPosition(size.width/2,size.height/2+22);
        rankBg2.addChild(label2);
        this._rankArr.push(rankBg2,rankBg1,label2,label1);

        var action1=new cc.MoveBy(1,cc.p(0,-10));
        var action2=new cc.MoveBy(0.5,cc.p(0,10));
        var action3=new cc.Sequence(action1,action2);
        rankBg2.runAction(action3).repeatForever();

        var action4=new cc.MoveBy(1,cc.p(0,10));
        var action5=new cc.MoveBy(0.5,cc.p(0,-10));
        var action6=new cc.Sequence(action4,action5);
        rankBg1.runAction(action6).repeatForever();
    },
    raiseFlag:function (role,win,time) {
       var effect=cc.audioEngine.playEffect(res_gaming.END_mp3,false);
       var self=this;
        role.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+role._teamId+"3.png"));
        var action1=new cc.JumpBy(0.1,0,50,50,1);
        var action2=new cc.MoveBy(0.2,cc.p(0,-40));
        var action3=new cc.Sequence(action1,action2);
        role.runAction(action3);
        var action4=GameTool.createFrameAction(1,3,"flag_",0.2,false,false);
        var action5=new cc.CallFunc(function () {
            //var time=GameTool.getFormatTime(parseInt(this._time*1000));
            cc.audioEngine.stopEffect(effect);
            cc.audioEngine.stopMusic();
            setTimeout(function () {
                self.addResultLayer(win,time);
            },1000);
        },this);
        var action6=new cc.Sequence(action4,action5);
        this._flagSp.runAction(action6);

    },
    updateBgMove:function () {
        if(this._sfRole.getPositionY()<=480)return;
        var bgLayer=this._gameCtrl["bgLayer"];
        var bgPos=this._gameCtrl["bgLayer"].getPosition();
        if(bgPos.x>=-540&&bgPos.x<=540)
        {
            if(this._sfRole._dirction==DIRCTION.LEFT)
            {
                bgPos.x+=10;
            }else
            {
                bgPos.x-=10;
            }
        }
        bgPos.y-=25;
        var move=new cc.MoveTo(0.08,bgPos);
        bgLayer.runAction(move);

    },
    gameBein:function () {
        this._timeSp.removeFromParent();
        this.scheduleUpdate();
        this.addTouchListenner();
    },
    removeTouchLister:function () {
      for(var key in this._listerArr)
      {
          cc.eventManager.removeListener(this._listerArr[key]);
      }
    },
    opUpdate:function () {

        if(this._opRoleMoveArr.length>0)
        {
            var obj=this._opRoleMoveArr[this._opRoleMoveArr.length-1];
            var x=obj.content["x"];
            var y=obj.content["y"];
            var dirction=obj.content["dirction"];
            var invert=obj.content["invert"];
            var index=obj.content["index"];
            var right=obj.content["right"];

            this._opRole.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+OP_INFO.teamId+"3.png"));
            this._opRole.setPosition(x,y);
            this._opRole._dirction=dirction;
            this._opRole._invert=invert;
            this._opRole._runRice=index;
            this._opRole._dirctionRight=right;
            this._opRole.setFlippedX(this._opRole._invert);
            this._opRole.updatePos(this._opRole.getPosition());
            this._opRoleMoveArr=[];
        }
    },
    judgCollsion:function (role) {
        if(role._dirctionRight)//cc.rectOverlapsRect(role.getBoundingBox(),this._blockArr[role._currIndex].getBoundingBox())
        {
            role._frontInvert=role._invert;
            role._frontDirction=role._dirction;
           // cc.log("role._currIndex=="+role._currIndex);
            if(role._teamId==SF_INFO.teamId)
            {
                var pos1 = this._blockArr[role._currIndex].getPosition();
                role.setPosition(pos1.x,pos1.y-10);
                role._currIndex++;
                if(role._currIndex==this._maxBlock)
                {
                    this.removeTouchLister();
                    //role._endPos=this.getPosition();
                    MsgId.sendOverMsg();
                    this._gameCtrl["_scorllLayer"].stopAllActions();
                    role.stopAllActions();
                    //this.raiseFlag(this._sfRole,2);
                    //cc.log("到达终点 ");
                }
                this.updateBgMove();
            }else
            {
                var pos1 = this._blockArr[role._runRice-1].getPosition();
                role.setPosition(pos1.x,pos1.y-10);
                role._jumpAction=false;
                this._opRole._currIndex=this._opRole._runRice;


            }
        }else
        {
            this.dead(role);
        }
        if(role._teamId==SF_INFO.teamId)this._touch=false;
    },
    dead:function (role) {
        //cc.log("gameOver");
        cc.audioEngine.playEffect(res_gaming.DOWN_mp3,false);
        role._over=true;
        var sp=new cc.Sprite("#role_"+role._teamId+"4.png");
        sp.setAnchorPoint(cc.p(0.5,0));
        sp.setPosition(role.getPosition());
        sp.setFlippedX(role._invert);
        if(role._teamId!=SF_INFO.teamId)
        {
            sp.setOpacity(120);
        }

        this._gameCtrl._scorllLayer.addChild(sp);
        role.setVisible(false);
        var action4=new cc.DelayTime(0.2);
        var action1=new cc.MoveBy(0.2,0,-540);
        var action2=new cc.CallFunc(function () {
            sp.removeFromParent();
            role.overAction();
        },this);
        var action3=new cc.Sequence(action4,action1,action2);
        sp.runAction(action3);
        if(navigator.vibrate&&role._teamId==SF_INFO.teamId)
        {
            navigator.vibrate(500);
        }
    },

    randomBlock:function () {
        var randomNum=GameTool.getSeedRandom(0,21);
        var score=GameTool.getSeedRandom(1,5);
        if(randomNum<=12){
            var random=GameTool.getSeedRandom(0,101);
            if(random<=30)
            {
                return 1;
            }else if(random>30&&random<=60)
            {
                return 2;
            }
            return score;
        }
        if(randomNum>12&&randomNum<=15)return randomNum%8;
        if(randomNum>15)return randomNum-11;
    },
    createBlock:function () {
        var dirction,block;
        var roleSize=this._sfRole.getContentSize();
        var maxBlock=0;
        var first=0;
        var randomNum=0;
        var type=1;
        while (maxBlock<=this._maxBlock)
        {
            if(first==0)
            {
                block=new Block(maxBlock,type);
                block.setPosition(this._sfRole.getPositionX()+roleSize.width/2+block._bSize.width/2,this._sfRole.getPositionY()+block._bSize.height+5);
                block._bPos=this.getPosition();
                this._gameCtrl._scorllLayer.addChild(block);
                this._blockArr.push(block);
                first=1;
                maxBlock++;
            }else
            {
                if(first==1)
                {
                    dirction=GameTool.getSeedRandom(1,3);
                    first=2;
                }else
                {
                    if(dirction==DIRCTION.LEFT)
                    {
                        dirction=DIRCTION.RIGHT;
                    }else
                    {
                        dirction=DIRCTION.LEFT;
                    }
                }
                randomNum=this.randomBlock();
                // cc.log("randomNum=="+randomNum);
                // cc.log("-------------");
                while (randomNum>0)
                {

                    if(maxBlock==this._maxBlock)
                    {
                        var block=this._blockArr[this._blockArr.length-1];
                        var beforBlock=this._blockArr[this._blockArr.length-2];
                        this._flagSp=new cc.Sprite("#flag_1.png");
                        if(block._dirction==DIRCTION.LEFT)
                        {
                            block.setPosition(beforBlock.getPositionX()-beforBlock._bSize.width/2-block._bSize.width/2,beforBlock.getPositionY()+block._bSize.height);
                            this._flagSp.setFlippedX(true);
                            this._flagSp.setPosition(0,block._bSize.height);
                        }else
                        {
                            block.setPosition(beforBlock.getPositionX()+beforBlock._bSize.width/2+block._bSize.width/2,beforBlock.getPositionY()+block._bSize.height);
                            this._flagSp.setPosition(block._bSize.width,block._bSize.height);
                        }

                        this._flagSp.setAnchorPoint(cc.p(0.5,0));
                        block.addChild(this._flagSp);
                        return;
                    }else
                    {
                        if((maxBlock+1)%25==0)
                        {
                            type++;
                        }

                        block=new Block(maxBlock,type);
                        block._dirction=dirction;
                        var beforBlock=this._blockArr[maxBlock-1];
                        if(dirction==DIRCTION.LEFT)
                        {
                            block.setPosition(beforBlock.getPositionX()-beforBlock._bSize.width,beforBlock.getPositionY()+beforBlock._bSize.height);
                        }else
                        {
                            block.setPosition(beforBlock.getPositionX()+beforBlock._bSize.width,beforBlock.getPositionY()+beforBlock._bSize.height);
                        }

                        block._bPos=this.getPosition();
                        this._gameCtrl._scorllLayer.addChild(block);
                        this._blockArr.push(block);
                        randomNum--;
                        maxBlock++;
                    }
                }

            }

        }
    },
    creatUiButton:function () {
        this._leftButton=new cc.Sprite("#button_1.png");
        this._leftButton.setPosition(120,130);
        this._leftButton.setTag(DIRCTION.LEFT);
        //this._leftButton.setScale(0.8);
        this.addChild(this._leftButton,10);

        this._rightButton=new cc.Sprite("#button_2.png");
        this._rightButton.setPosition(420,130);
        //this._rightButton.setScale(0.8);
        this._rightButton.setTag(DIRCTION.RIGHT);
        this.addChild(this._rightButton,10);

        var action1=new cc.FadeOut(2);
        var action2=action1.reverse();
        var action3=new cc.Sequence(action1,action2).repeatForever();
        for(var i=1;i<=2;i++)
        {
            var sp=new cc.Sprite("#tips_"+i+".png");
            sp.setPosition(170+40*(i*i),130);
            this.addChild(sp);
            sp.runAction(action3.clone());
            this._tipArrs.push(sp);
        }
    },
    createRole:function (teamId) {
        var role=new Role(teamId);
        var pos=this._gameCtrl._scorllLayer.convertToNodeSpace(this._gameCtrl._ui_di.getPosition());
        role.setPosition(pos.x,pos.y-15);
        role._originPos=role.getPosition();
        this._gameCtrl._scorllLayer.addChild(role,1);
        if(teamId==SF_INFO.teamId)
        {
            this._sfRole=role;
            var acition=new cc.Follow(this._sfRole,cc.rect(-50000,0,100000,20000));//_halfScreenSize;

            this._gameCtrl._scorllLayer.runAction(acition);
        }else
        {
            role.setOpacity(120);
            this._opRole=role;
        }
        role.playDefaultAction();
    },
    update:function (dt) {
        // if(this._sfRole._runRice==this._opRole._runRice)
        // {
        //     this._scoreLable.setString("并驾齐驱:0米");
        // }else
        // {
        //
        //     var rice=this._sfRole._runRice-this._opRole._runRice;
        //     var str="领先:";
        //     if(rice<0)
        //     {
        //         str="落后:";
        //         rice=Math.abs(rice);
        //     }
        //     this._scoreLable.setString(str+rice+"米");
        // }
       // this._time += dt;
        this.showRank();
        //sthis.opUpdate();
    },
    showRank:function () {
        var sfPos=this._sfRole.getPosition();
        var opPos=this._opRole.getPosition();
        var sfIndex=this._sfRole._currIndex;
        var opIndex=this._opRole._runRice;

        var rect=new cc.Rect(sfPos.x-cc.winSize.width/2,sfPos.y-cc.winSize.height/2,cc.winSize.width,cc.winSize.height);

        if(!cc.rectIntersectsRect(rect,this._opRole.getBoundingBox()))
        {
            if(sfIndex>opIndex)
            {
                this._rankArr[0].setVisible(true);
                this._rankArr[1].setVisible(false);

            }else
            {
                this._rankArr[1].setVisible(true);
                this._rankArr[0].setVisible(false);
            }
        }else
        {
            this._rankArr[0].setVisible(false);
            this._rankArr[1].setVisible(false);
        }


        this._rankArr[3].setString("对方领先:"+Math.abs(sfIndex-opIndex)+"层");
        this._rankArr[2].setString("对方落后:"+Math.abs(sfIndex-opIndex)+"层");
    },
    createUiLayer:function (type,isVertical) {
        var self = this;
        GM_INFO.headWidth=62;
        GM_INFO.headHeight=62;
        var uiLayer = self._uiLayer = new UiLayer(type, isVertical);
        self.addChild(uiLayer,9999);
        // self._uiCtrlCCB.setTimeLabel("00:00:00");
        // self._uiCtrlCCB.setScore(SF_INFO.teamId,"0");   resolutions
    },
    addTouchListenner:function () {
        var self=this;
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch,event) {
                // 获取当前触发事件的对象 TODO【备注】：有比getCurrentTarget更好的选择。
                //  但这里主要是3个精灵引用了同一套的事件处理方案，所以采用此方式。见下面的.clone
                var target = event.getCurrentTarget();
                // 获取点击坐标[基于本地坐标]
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                // 获取当前节点大小
                var size = target.getContentSize();
                // 区域设定
                var rect = cc.rect(0, 0, size.width, size.height);
                // 判断触摸点是否在节点区域内
                if (!(cc.rectContainsPoint(rect, locationInNode))||self._sfRole._over||self._touch) {
                    return false;
                }

                target.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("button_"+target.getTag()+"_1.png"));
                self._touch=true;
                self.addButtonLight(target.getTag());
                self._sfRole.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"3.png"));
                cc.audioEngine.playEffect(res_gaming.JUMP_mp3,false);
                self._sfRole.updateMove(target.getTag(),self._blockArr);
                return true;
            },
            onTouchMoved:function (touch,event) {

            },
            onTouchEnded:function (touch,event) {
                var target = event.getCurrentTarget();
                target.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("button_"+target.getTag()+".png"));
            },
            onTouchCancelled:function () {
                self._touch=false;
            }
        });
        var lister1=this._listener.clone();
        var lister2=this._listener.clone();
        this._listerArr.push(lister1,lister2);
        cc.eventManager.addListener(lister1,this._leftButton);
        cc.eventManager.addListener(lister2,this._rightButton);
    },
    addButtonLight:function (tag) {
        var sp=new cc.Sprite("#light_1.png");
        var button;
        if(tag==1)
        {
            button=this._leftButton;
        }else
        {
            button=this._rightButton;
        }
        var size=button.getContentSize();
        sp.setPosition(size.width/2,size.height/2);
        button.addChild(sp);


        var frames=[];
        var frame1=cc.spriteFrameCache.getSpriteFrame("light_1.png");
        var frame2=cc.spriteFrameCache.getSpriteFrame("light_2.png");
        frames.push(frame1,frame2);
        var animation=new cc.Animation(frames,0.05);
        animation.setRestoreOriginalFrame(false);
        var animate=new cc.Animate(animation);
        var action=new cc.RemoveSelf(true);
        var action2=new cc.Sequence(animate,action);
        sp.runAction(action2) ;

    },
    onEnterTransitionDidFinish: function () {
        this._super();
        if(OP_INFO.isExit){
            this.addResultLayer(1);
        }else{
            this.addListeners();
            if(global_debug)
            {
                this.playGoAction();
            }else
            {
                this.sendReadyGoMsg();
            }
        }

    },

    onExit:function(){
        this._super();
        this.removeListeners();
    },


    addListeners:function(){
        this._super();
        GameTool.addCustomListener(MsgId.msgId_readyGo,this.receiveReadyGoMsg,this);
        GameTool.addCustomListener(MsgId.msgId_move,this.receiveMoveMsg,this);
        GameTool.addCustomListener(MsgId.msgId_exit,this.receiveExitMsg,this);
        GameTool.addCustomListener(MsgId.msgId_gameOver,this.receiveOverMsg,this);
    },

    //游戏开始时重置数据
    initData:function(){
        GM_SCENE=this;
        this._timeArr=new Array();
        this._blockArr=new Array();
        this._listerArr=new Array();
        this._opRoleMoveArr=new Array();
        this._tipArrs=new Array();
        this._rankArr=new Array();
        this.initCache();
        this.addWait();
    },
    initCache:function () {
        cc.spriteFrameCache.addSpriteFrames(res_gaming.img_1_plist,res_gaming.img_1_png);
        cc.spriteFrameCache.addSpriteFrames(res_gaming.game_plist,res_gaming.game_png);
        cc.spriteFrameCache.addSpriteFrames(res_loading.role_plist,res_loading.role_png);
        cc.spriteFrameCache.addSpriteFrames(res_gaming.reslut_plist,res_gaming.reslut_png);

    },


    //添加结算界面
    addResultLayer:function(win,time){
        GM_INFO.isEnd=true;
        if(this._resultLayer)return;

        if(this._timeSp)this._timeSp.removeFromParent(true);
        if(this._wait)this._wait.removeFromParent(true);
        for (var i = this._timeArr.length - 1; i >= 0; i--) {
            clearInterval(this._timeArr[i]);
        };

        this._resultLayer=new ResultLayer(win,time);
        this.addChild(this._resultLayer,100);
        this.removeTouchLister();
        this.unscheduleUpdate();
    },
    addWait:function(){
        this._wait = new cc.Sprite("#wait.png");
        this._wait.setPosition(cc.p(cc.winSize.width*0.5,cc.winSize.height*0.5));
        this.addChild(this._wait,100);
    },

    playGoAction:function(){
        if(this._wait)this._wait.removeFromParent(true);
        GM_INFO.isStart=true;
        cc.audioEngine.playMusic(res_gaming.BGM_mp3,true);
        cc.audioEngine.playEffect(res_gaming.DI_mp3,false);
        this._timeSp = new cc.Sprite("#ready_" + GM_INFO.readyFrames + ".png");
        this._timeSp.setPosition(cc.p(cc.winSize.width*0.5,cc.winSize.height*0.5));
        this.addChild(this._timeSp);
        this._timeArr.push(setTimeout(ready,600));


    },

    //从LoadingScene场景跳转过来 向服务器发送进入游戏的消息
    sendReadyGoMsg:function(){
        var readyGoMsg = new ReadyGoMsg();
        readyGoMsg.content.sfDelay = this._sfDelay;
        tz_network.sendMessage(readyGoMsg);
    },
    //对手退出的消息
    receiveExitMsg:function(){
        this.addResultLayer(1);
    },
    receiveReadyGoMsg:function(event){
        var data = event.getUserData();
        this.playGoAction();
    },
    receiveMoveMsg:function (event) {
        var data = event.getUserData();
        var x=data["x"];
        var y=data["y"];
        var dirction=data["dirction"];
        var invert=data["invert"];
        var index=data["index"];
        var right=data["right"];
        if(this._opRole._over)
        {
            var moveOBj=new moveMsg();
            moveOBj.content.x=x;
            moveOBj.content.y=y;
            moveOBj.content.dirction=dirction;
            moveOBj.content.invert=invert;
            moveOBj.content.index=index;
            moveOBj.content.right=right;
            this._opRoleMoveArr.push(moveOBj);
            cc.log("装进去了--------------------");
        }else
        {
            this._opRole.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+OP_INFO.teamId+"3.png"));
            this._opRole.setPosition(x,y);
            this._opRole._dirction=dirction;
            this._opRole._invert=invert;
            this._opRole._runRice=index;
            cc.log("this._opRole._currIndex=="+this._opRole._currIndex);
            this._opRole._dirctionRight=right;
            this._opRole.setFlippedX(this._opRole._invert);
            this._opRole.updatePos(this._opRole.getPosition());
        }
    },
    receiveOverMsg:function (event) {
        var data = event.getUserData();
        var win=data["win"];
        var time=data["time"];
        time=GameTool.getFormatTime(time);
        GM_INFO.isEnd=true;
        this._sfRole.stopAllActions();
        this._opRole.stopAllActions();
        this.removeTouchLister();
        if(win==1)
        {
            SF_INFO.isWin=true;
            this.raiseFlag(this._sfRole,win,time);
            cc.log("赢");
        }else
        {
            SF_INFO.isWin=false;
            this.raiseFlag(this._opRole,win,time);
            var pos=this._blockArr[this._blockArr.length-1].getPosition();
            this._opRole.setPosition(pos);
            cc.log("输");
        }

    },
});