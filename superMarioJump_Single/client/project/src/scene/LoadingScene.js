/**
 * Created by yangyanfei on 15/5/23.
 */

var LoadingScene = BaseScene.extend({
    _isLoaded : false,
    _isPlayerInfo:false,
    _loadingCtrl:null,
    ctor:function(){
        this._super();
        // var obj=navigator.geolocation.getCurrentPosition(function (obj) {
        //     cc.log("obj="+obj);
        // });
        GM_INFO.currSeed = new Date().getTime();
        GM_INFO.nextSeed = new Date().getTime();
        this.loadLoading();
        SF_INFO.teamId=parseInt(GameTool.getSeedRandom(1,3));
    },



    onEnter: function () {
        this._super();
    },

    onExit:function(){
        this._super();
        this.removeListeners();
    },

    addListeners:function(){
        this._super();
    },

    loadLoading:function(){
        var self = this;
        cc.loader.load(g_resources_loading,
            function (result, count, loadedCount) {
            }, function () {
                self._loadingCtrl = self.addCCBI(res_loading.loading_ccb);
                startLoading();
                self.loadGaming();
            });
    },

    loadGaming:function(){
        var self = this;
        cc.loader.load(g_resources_gaming,
            function (result, count, loadedCount) {
                var percent = ((loadedCount+1) / count * 100) | 0;
                self._loadingCtrl["_progress"].setPercentage(percent);
            }, function () {
                self._isLoaded = true;
                cc.director.runScene(new cc.TransitionFade(0.8,new GameScene()));
            });

    }

});