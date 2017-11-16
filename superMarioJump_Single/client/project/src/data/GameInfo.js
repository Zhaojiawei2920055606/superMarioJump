/**
 * Created by yangyanfei on 16/1/1.
 */





var GM_INFO = {
    _isCollision:false,
    readyFrames:3,//3代表3 2 1, 2代表ready go,1代表是回合游戏 不用播放
    isEnd:false,
    currSeed:new Date().getTime(),
    nextSeed:0,
    headWidth:85,//头像宽
    headHeight:85,//头像高
    pillarTag:0,
};


var SF_INFO = {
    currScore:0,
    bestScore:0,
    isWin:false,
    percent:0,
    teamId:1
};


