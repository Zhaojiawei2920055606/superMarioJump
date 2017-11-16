/**
 * Created by tongzhuogame on 2017/11/2.
 */
var Block=cc.Sprite.extend({
    _index:null,
    _bPos:null,
    _bSize:null,
    _type:null,
    _dirction:DIRCTION.RIGHT,
    ctor:function (index,type) {
        this._super("#box_"+type+".png");
        this._index=index;
        this._type=type;
        this.setAnchorPoint(cc.p(0.5,1));
        this._bSize=this.getContentSize();
    },
});