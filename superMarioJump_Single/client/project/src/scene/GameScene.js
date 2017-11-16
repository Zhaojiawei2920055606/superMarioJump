/**
 * Created by wenjiawei on 17/1/1.
 */
var GM_SCENE=null;
navigator.vibrate = navigator.vibrate
    || navigator.webkitVibrate
    || navigator.mozVibrate
    || navigator.msVibrate;
var GameScene = BaseScene.extend({
    _gameCtrl:null,
    _startCtrl:null,
    _sfRole:null,
    _blockArr:null,
    _maxBlock:100,
    _listener:null,
    _leftButton:null,
    _rightButton:null,
    _listerArr:null,
    _currMap:1,
    _time:0,
    _posY:0,
    _flagSp:null,
    _touch:false,
    _tipArrs:null,
    ctor: function () {
        this._super();
        this.initData();
        this._gameCtrl=this.addCCBI(res_gaming.game_ccb);
        this._startCtrl = this.addCCBI(res_gaming.begin_ccbi,100);
        this.createRole(SF_INFO.teamId);
        this.createBlock();
        this.creatUiButton();
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
        this.scheduleUpdate();
        this.addTouchListenner();
    },
    gameEnd:function () {
        this.removeTouchLister();
        this.unscheduleUpdate();
        this.raiseFlag(this._sfRole);
        this._gameCtrl._scorllLayer.stopAllActions();
        cc.log("到达终点 ");
    },
    removeTouchLister:function () {
        for(var key in this._listerArr)
        {
            cc.eventManager.removeListener(this._listerArr[key]);
        }
    },
    judgCollsion:function () {
        if(this._sfRole._dirctionRight)//cc.rectOverlapsRect(role.getBoundingBox(),this._blockArr[role._currIndex].getBoundingBox())
        {
            this._sfRole._currIndex++;
            this._sfRole._frontInvert=this._sfRole._invert;
            this._sfRole._frontDirction=this._sfRole._dirction;
            if(this._sfRole._currIndex==this._maxBlock)
            {
                this.gameEnd();
            }
            this.updateBgMove(this._currMap);
        }else
        {
            this.dead();
        }
        this._touch=false;
    },
    dead:function () {
        cc.log("gameOver");
        cc.audioEngine.playEffect(res_gaming.DOWN_mp3,false);
        this._sfRole._over=true;
        var sp=new cc.Sprite("#role_"+SF_INFO.teamId+"4.png");
        sp.setAnchorPoint(cc.p(0.5,0));
        sp.setPosition(this._sfRole.getPosition());
        sp.setFlippedX(this._sfRole._invert);

        this._gameCtrl._scorllLayer.addChild(sp);
        this._sfRole.setVisible(false);
        var action4=new cc.DelayTime(0.2);
        var action1=new cc.MoveBy(0.2,0,-540);
        var action2=new cc.CallFunc(function () {
            sp.removeFromParent();
            this._sfRole.overAction();
        },this);
        var action3=new cc.Sequence(action4,action1,action2);
        sp.runAction(action3);
        if(navigator.vibrate)
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
                cc.log("randomNum=="+randomNum);
                cc.log("-------------");
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
        this._leftButton.setPosition(120,100);
        this._leftButton.setTag(DIRCTION.LEFT);
        //this._leftButton.setScale(0.8);
        this.addChild(this._leftButton,10);

        this._rightButton=new cc.Sprite("#button_2.png");
        this._rightButton.setPosition(420,100);
        //this._rightButton.setScale(0.8);
        this._rightButton.setTag(DIRCTION.RIGHT);
        this.addChild(this._rightButton,10);

        var action1=new cc.FadeOut(2);
        var action2=action1.reverse();
        var action3=new cc.Sequence(action1,action2).repeatForever();
        for(var i=1;i<=2;i++)
        {
            var sp=new cc.Sprite("#tips_"+i+".png");
            sp.setPosition(170+40*(i*i),100);
            this.addChild(sp);
            sp.runAction(action3.clone());
            this._tipArrs.push(sp);
        }
    },
    createRole:function (teamId) {
        var role=new Role(teamId);
        var pos=this._gameCtrl._scorllLayer.convertToNodeSpace(this._gameCtrl._ui_di.getPosition());
        var uiSize=this._gameCtrl._ui_di.getContentSize();
        role.setPosition(pos.x,pos.y-15);
        // role.setPosition(cc.winSize.width/2,198);
        role._originPos=role.getPosition();
        // this._gameCtrl._scorllLayer.addChild(role,1);
        this._gameCtrl._scorllLayer.addChild(role,1);
        if(teamId==SF_INFO.teamId)
        {
            this._sfRole=role;
            var acition=new cc.Follow(this._sfRole,cc.rect(-50000,0,100000,20000));//_halfScreenSize
            // acition._fullScreenSize=cc.size(this._sfRole.getPositionY(),cc.winSize.height);
            // var y=this._sfRole.getPositionY()/cc.winSize.height;
            // acition._halfScreenSize=cc.pMult(acition._fullScreenSize, y);

            this._gameCtrl._scorllLayer.runAction(acition);
        }

        role.playDefaultAction();
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
                // cc.log("x=="+self._gameCtrl["scrollLayer"].getPositionX());
                //cc.log("y=="+self._gameCtrl["scrollLayer"].getPositionY());
                self._sfRole.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"3.png"));
                cc.audioEngine.playEffect(res_gaming.JUMP_mp3,false);
                self._sfRole.updateMove(target.getTag());
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
        this.addListeners();
        this.schedule(this.exitGame,1);
    },
    onEnter: function () {
        this._super();
    },
    onExit:function(){
        this._super();
        this.removeListeners();
    },
    addListeners:function () {
        this._super();
        // GameTool.addCustomListener(EventId.gameOver,this.receiveGameOver,this);
    },
    //添加结算界面
    addResultLayer:function(){
        GM_INFO.isEnd=false;
        cc.audioEngine.playEffect(res_gaming.WIN_mp3,false);
        if(SF_INFO.bestScore>this._time||SF_INFO.bestScore==0)
        {
            SF_INFO.bestScore=this._time;
        }
        SF_INFO.currScore=this._time;
        cc.audioEngine.stopMusic(false);
        cc.director.runScene(new cc.TransitionFade(0.8,new GameScene()));
    },
    initData:function () {
        GM_SCENE=this;
        this._blockArr=new Array();
        this._listerArr=new Array();
        this._tipArrs=new Array();
        this.initCache();
    },
    initCache:function () {
        cc.spriteFrameCache.addSpriteFrames(res_loading.loading_plist,res_loading.loading_png);
        cc.spriteFrameCache.addSpriteFrames(res_gaming.game_plist,res_gaming.game_png);
        cc.spriteFrameCache.addSpriteFrames(res_gaming.role_plist,res_gaming.role_png);
    },
    update:function(dt){
        this._time += dt;
        this._gameCtrl["trainTime"].setString(GameTool.getFormatTime(parseInt(this._time*1000)));
    },
    exitGame:function () {
        this._startCtrl["time"].setString(this._startCtrl["time"].getString()-1);
        if(this._startCtrl["time"].getString()=="0")
        {
            this.unschedule(this.exitGame);
            hideGame(Math.floor(SF_INFO.bestScore*100)/100);
        }
    },
    playGoAction:function(){
        this.unschedule(this.exitGame);
        this._startCtrl["zuijiaSp"].setVisible(false);
        this._startCtrl["startLayer"].setVisible(false);
        this._gameCtrl["trainTime"].setVisible(true);
        GM_INFO.isStart=true;
        cc.audioEngine.playMusic(res_gaming.BGM_mp3,true);
        this.gameBein();
    },
    playFlagWinAction:function () {
      var action1=GameTool.createFrameAction(1,3,"flag_",0.1,false,false);
      var action2=new cc.CallFunc(function () {
          this.addResultLayer();
      },this);
      var action3=new cc.Sequence(action1,action2);
      this._flagSp.runAction(action3);
    },
    raiseFlag:function (role) {
        cc.audioEngine.playEffect(res_gaming.END_mp3,false);
        role.stopAllActions();
        role.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+role._teamId+"3.png"));
        var action1=new cc.JumpBy(0.1,0,50,50,1);
        var action2=new cc.MoveBy(0.2,cc.p(0,-40));
        var action3=new cc.Sequence(action1,action2);
        role.runAction(action3);
        var action4=GameTool.createFrameAction(1,3,"flag_",0.2,false,false);
        var action5=new cc.CallFunc(function () {
            this._sfRole.stopAllActions();
            this.addResultLayer();
        },this);
        var action6=new cc.Sequence(action4,action5);
        this._flagSp.runAction(action6);

    },
});