/**
 * Created by tongzhuogame on 2017/11/3.
 */
var Role=cc.Sprite.extend({
    _size:null,
    _teamId:null,
    _frontDirction:DIRCTION.RIGHT,
    _dirction:DIRCTION.RIGHT,
    _currIndex:0,
    _blockSize:null,
    _invert:false,
    _frontInvert:false,
    _first:true,
    _over:false,
    _originPos:null,
    _dirctionRight:true,
    _endPos:null,
    ctor:function (teamid) {
        this._super("#role_"+teamid+"1.png");
        this.setAnchorPoint(cc.p(0.5,0));
        this._size=this.getContentSize();
        this._teamId=teamid;
        this._blockSize=cc.size(133,50);
    },
    updatePos:function () {
        var currPos=this.getPosition();
        var indexPos;
        if(this._dirction==DIRCTION.LEFT)
        {
            if(this._first)
            {
                indexPos=cc.p(currPos.x-this._blockSize.width+this._blockSize.width/2,currPos.y+this._blockSize.height);
                this._first=false;
            }else
            {
                indexPos=cc.p(currPos.x-this._blockSize.width,currPos.y+this._blockSize.height);
            }

        }else
        {

            if(this._first)
            {
                indexPos=cc.p(currPos.x+this._size.width/2+this._blockSize.width-this._blockSize.width/2,currPos.y+this._blockSize.height);
                this._first=false;
            }else
            {
                indexPos=cc.p(currPos.x+this._blockSize.width,currPos.y+this._blockSize.height);
            }


        }

        this.playJupmAction(indexPos);

        // var bgPos=GM_SCENE._gameCtrl["bg1_1"].getPositionY()-currPos.y+this._blockSize.height;
        // GM_SCENE._gameCtrl["bg1_1"].setPositionY(bgPos/5);
    },
    updateMove:function (tag) {
        if(tag==1)
        {
            if(this._invert)
            {
                this._invert=false;
            }else
            {
                this._invert=true;
            }

            this.setFlippedX(this._invert);
            if(this._dirction==DIRCTION.LEFT)
            {
                this._dirction=DIRCTION.RIGHT;
            }else
            {
                this._dirction=DIRCTION.LEFT;
            }
        }
        var nextIndex=this._currIndex;
        if(nextIndex<=99)
        {
            if(nextIndex==5)
            {
                for (var i=GM_SCENE._tipArrs.length-1;i>=0;i--)
                {
                    var tips=GM_SCENE._tipArrs[i];
                    tips.removeFromParent(true);
                    GM_SCENE._tipArrs.splice(i,1);
                }

            }

            if(GM_SCENE._blockArr[this._currIndex]._dirction==this._dirction)
            {
                this._dirctionRight=true;
            }else
            {
                cc.log("方向不对,掉!!");
                this._dirctionRight=false;
            }
        }else
        {
            cc.log("到头了!!");
        }
        this.updatePos();
    },
    overAction:function () {
        this.reset();
        var action=new cc.Blink(1,5);
        var action1=new cc.CallFunc(function () {
            this._over=false;
        },this);
        var action2=new cc.Sequence(action,action1);
        this.runAction(action2);
    },
    playJupmAction:function (pos) {
        var height=0;
        this.stopAllActions();
        if(GM_INFO.isEnd)
        {
            height=100;
        }else
        {
            height=0;
        }

        var action1 = new cc.JumpTo(0.05, pos,height,1);
        var action2=new cc.CallFunc(function () {
             this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("role_"+this._teamId+"1.png"));
             this.playJupmDoneAction();
             if(this._dirctionRight) {
                 var pos1 = GM_SCENE._blockArr[this._currIndex].getPosition();
                 this.setPosition(pos1.x,pos1.y-10);
             }
            GM_SCENE.judgCollsion();
        },this);
        //var action4=this.playJupmDoneAction();
        var action3=new cc.Sequence(action1,action2);
        //var action5=new cc.Sequence(action3,action2);


        this.runAction(action3);
    },
    playDefaultAction:function () {
        var frames=[];
        var frame1=cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"1.png");
        var frame3=cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"2.png");
        frames.push(frame1,frame3);
        var animation=new cc.Animation(frames,0.5);
        animation.setRestoreOriginalFrame(false);
        var animate=new cc.Animate(animation);
        // var action1=new cc.DelayTime(0.5);
        // var action2=new cc.Sequence(animate,action1);
        this.runAction(animate).repeatForever() ;
    },
    playJupmDoneAction:function () {
        var frames=[];
        var frame1=cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"1.png");
        var frame3=cc.spriteFrameCache.getSpriteFrame("role_"+SF_INFO.teamId+"2.png");
        frames.push(frame1,frame3);
        var animation=new cc.Animation(frames,0.05);
        animation.setRestoreOriginalFrame(false);
        var animate=new cc.Animate(animation);
        var action=new cc.CallFunc(function () {
            this.playDefaultAction();
        },this);
        var action2=new cc.Sequence(animate,action);
        this.runAction(action2) ;
    },
    reset:function () {
        if(this._currIndex==0)
        {
            this._first=true;
            this._invert=false;
            this._dirction=DIRCTION.RIGHT;
            this.setFlippedX(this._invert);
            this.setPosition(this._originPos.x,this._originPos.y-10);
        }else
        {
            this._invert=this._frontInvert;
            this.setFlippedX(this._invert);
            this._dirction=this._frontDirction;
            var pos=GM_SCENE._blockArr[this._currIndex-1].getPosition();
            this.setPosition(pos.x,pos.y-10);
        }
        this.setVisible(true);
    },

});