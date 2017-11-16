/**
 * Created by yangyanfei on 16/1/1.
 */





var GM_INFO = {
    readyFrames:3,//3代表3 2 1, 2代表ready go,1代表是回合游戏 不用播放
    isEnd:false,
    currSeed:new Date().getTime(),
    nextSeed:0,
    isStart:false,
    headWidth:62,//头像宽
    headHeight:62,//头像高
};


var SF_INFO = {
    userId:tz_url.userId,
    iconUrl:tz_url.iconUrl,
    nickname:tz_url.nickname,
    isWin:false,
    percent:0,
    teamId:1,
};

var OP_INFO = {
    userId:null,
    iconUrl:null,
    nickname:null,
    isExit:false,
    percent:0,
    teamId:2
};

