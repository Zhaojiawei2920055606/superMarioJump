/**
 * Created by tongzhuogame on 2017/8/24.
 */
var ResultLayer = cc.Layer.extend({
    angle: 1,
    _time: null,
    ctor: function (isWin, time) {
        this._super();
        this.setContentSize(cc.size(cc.winSize.width, cc.winSize.height));
        this.initBgLayer();
        var size = this.getContentSize();
        var head = new cc.Sprite("#win_1.png");
        head.setPosition(size.width / 2, size.height / 2 + 160);
        this.addChild(head, 11);

        var headBg = new cc.Sprite("#win_2.png");
        headBg.setPosition(head.getPosition());
        this.addChild(headBg, 9, 123);
        var size1 = head.getContentSize();


        if (time) {
            this._time = new cc.LabelTTF(time, "newFont", 60);
            this._time.setPosition(size1.width / 2, size1.height / 2 - 90);
            head.addChild(this._time);
        }


        if (isWin == 2) {
            head.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("lose.png"));
            headBg.setVisible(false);
            cc.audioEngine.playEffect(res_gaming.LOST_mp3, false);
        } else {

            cc.audioEngine.playEffect(res_gaming.WIN_mp3, false);
        }

        this.scheduleUpdate();
        setTimeout(function () {
            cc.audioEngine.stopMusic();
            hideGame();
        }, 2000);
    },
    initBgLayer: function () {
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 100), cc.winSize.width, cc.winSize.height);
        this.addChild(layer, 1);
    },
    update: function (dt) {
        this.getChildByTag(123).setRotation(++this.angle);
    },

});