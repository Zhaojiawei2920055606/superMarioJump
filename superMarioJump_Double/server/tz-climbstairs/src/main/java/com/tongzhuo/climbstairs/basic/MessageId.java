package com.tongzhuo.climbstairs.basic;

public class MessageId {

    /* ************通用消息************ */
    public static final int MSGID_HEARTBEAT = 100;//心跳

    public static final int MSGID_PLAYERINFO = 801;//服务器自动下发的玩家信息的消息

    public static final int MSGID_EXIT = 802;//对方退出的消息

    public static final int MSGID_LOADING = 200;//更新进度条

    public static final int MSGID_JUMP = 201;//跳转到游戏场景的消息* ignore添加bin目录

    public static final int MSGID_DELAY = 203;//校准时间

    public static final int MSGID_READYGO = 204;//播放readyGo消息(如果没有readyGo动画 直接开始游戏)

    public static final int MSGID_OVER = 205;//游戏结束

    /* ************climbstairs消息************ */
    public static final int MSGID_MOVE = 206;//移动

    public static final int MSGID_TEAM = 300;//分队(加载页面时使用)

}