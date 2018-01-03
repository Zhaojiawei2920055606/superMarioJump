/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("LoadingCtrl", {
    _progress: null,
    onDidLoadFromCCB: function () {
        this["name1"].setString(SF_INFO.nickname);
        // this["role_"+SF_INFO.teamId].setVisible(true);
        this.initPlayerInfo();
    },
    completedAnimationSequenceNamed: function (animationName) {

    },
    changeProgressTimer: function (percent) {
        this["precent" + OP_INFO.teamId].setString(percent + "%");
    },
    changeName: function () {
        this["name2"].setString(OP_INFO.nickname);
    },
    initPlayerInfo: function () {
        //设置头像
        GM_INFO.headWidth = 105;
        GM_INFO.headHeight = 105;
        if (SF_INFO.iconUrl) {
            cc.loader.loadImg(SF_INFO.iconUrl, function (err, img) {
                var sprite = new cc.Sprite(img);
                if (sprite) {

                    var sfHeadBg = this["sf_head_bg"];
                    var headBgSize = sfHeadBg.getContentSize();

                    var headSp = GameTool.getHead(sprite);
                    headSp.setPosition(cc.p(headBgSize.width * 0.5, headBgSize.height * 0.5));
                    sfHeadBg.addChild(headSp);
                }
            }.bind(this));
        }

        if (OP_INFO.iconUrl) {
            cc.loader.loadImg(OP_INFO.iconUrl, function (err, img) {
                var sprite = new cc.Sprite(img);
                if (sprite) {
                    var opHeadBg = this["op_head_bg"];
                    var headBgSize = opHeadBg.getContentSize();

                    var headSp = GameTool.getHead(sprite);
                    headSp.setPosition(cc.p(headBgSize.width * 0.5, headBgSize.height * 0.5));
                    opHeadBg.addChild(headSp);
                }

            }.bind(this));
        }
    },
});