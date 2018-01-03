/**
 * Created by yangyanfei on 5/5/16.
 */


var DisconnectLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var layerColor = new cc.LayerColor(cc.BLACK, cc.winSize.width, cc.winSize.height);
        layerColor.setOpacity(120);
        this.addChild(layerColor);

        var loseLineSp = new cc.Sprite("#loseline_1.png");
        loseLineSp.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.58));
        this.addChild(loseLineSp);


        // var menu = new cc.Menu(sureItem);
        // menu.setPosition(cc.p(cc.winSize.width*0.5,cc.winSize.height*0.4));
        // this.addChild(menu);


    },
    onEnter: function () {
        this._super();
        this._listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                return true;
            }
        });
        cc.eventManager.addListener(this._listener, this);
    },
    onExit: function () {
        this._super();
        cc.eventManager.removeListener(this._listener);

    },

    sureItemCallback: function () {
    }
});