/**
 * Created by yangyanfei on 6/6/16.
 */


var GameTool = {
    _startTime: 0,
    _totalTime: 0,
    _listeners: [],
    getHead: function (sp) {
        sp.setScaleX(GM_INFO.headWidth / sp.getContentSize().width);
        sp.setScaleY(GM_INFO.headHeight / sp.getContentSize().height);
        var testStencil = cc.DrawNode.create();
        var nCount = 400;
        var circleArray = [];
        var angel = 2.0 * Math.PI / nCount;
        for (var i = 0; i < nCount; i++) {
            var radian = i * angel;
            circleArray.push(cc.p(GM_INFO.headWidth / 2 * Math.cos(radian), GM_INFO.headHeight / 2 * Math.sin(radian)))
        }
        testStencil.drawPoly(circleArray, nCount, cc.RED, 0, cc.RED);
        var clipper = new cc.ClippingNode(testStencil);
        clipper.addChild(sp);
        return clipper;
    },
    //创建帧动画
    createFrameAction: function (minNum, maxNum, name, time, isRestoreOriginalFrame, isRepeatForever) {
        var animation = new cc.Animation();
        for (var i = minNum; i <= maxNum; i++) {
            var frameName = name + i + ".png";
            animation.addSpriteFrame(frameName);
        }
        animation.setDelayPerUnit(time);//0.2
        animation.setRestoreOriginalFrame(isRestoreOriginalFrame);//false
        var action = null;
        if (isRepeatForever == true) {
            action = cc.animate(animation).repeatForever();
        } else {
            action = cc.animate(animation);
        }
        return action;
    },
    getSeedRandom: function (min, max) {//包含min 不包含max
        max = max || 1;
        min = min || 0;
        GM_INFO.currSeed = (GM_INFO.currSeed * 9301 + 49297) % 233280;
        var rnd = GM_INFO.currSeed / 233280.0;

        var tmp = min + rnd * (max - min);
        return parseInt(tmp);
    },

    addCustomListener: function (msgId, callback, target) {
        cc.eventManager.addCustomListener(msgId, callback.bind(target));
        this._listeners.push(msgId);
    },
    removeCustomListers: function () {
        var len = this._listeners.length;
        for (var i = len - 1; i >= 0; i--) {
            cc.eventManager.removeCustomListeners(this._listeners.splice(i, 1));
        }
    },

    getAnimate: function (num1, num2, str, time) {
        var frames = [];
        for (var i = num1; i <= num2; i++) {
            var name = str + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(name);
            frames.push(frame);
        }
        var animation = new cc.Animation(frames, time);
        animation.setRestoreOriginalFrame(false);
        var animate = new cc.Animate(animation);
        return animate;
    },

    begainTiming: function () {
        this._startTime = new Date().getTime();

    },
    endTiming: function () {
        var endTime = new Date().getTime();
        this._totalTime = endTime - this._startTime;
    },

    getCurrentTime: function () {
        var endTime = new Date().getTime();
        return endTime - this._startTime;
    },

    getFormatTime: function (totalTime) {

        var date = new Date();
        date.setTime(totalTime);

        var ms = date.getMilliseconds();
        // var msString = date.getMilliseconds();
        var msString = parseInt(ms / 10) % 100;

        var secondString = date.getSeconds();

        var minString = date.getMinutes();

        if (msString < 10) {
            msString = "0" + msString;
        }
        if (secondString < 10) {
            secondString = "0" + secondString;
        }
        secondString = secondString + ":";

        if (minString < 10) {
            minString = "0" + minString;
        }
        minString = minString + ":";

        return minString + secondString + msString;

    }
};
var GetLength = function (str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

var cutstr = function (str, len) {
    var str_length = 0;
    var str_len = 0;
    var str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        } else if (/[A-Z]/.test(a)) {
            str_length += 0.5;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
};


DIRCTION = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2
};