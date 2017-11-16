package com.tongzhuo.climbstairs.enums;

import com.tongzhuo.basic.enums.INameEnum;

/**
 * 房间状态
 * @author Xiong
 */
public enum RoomStatus implements INameEnum{

    GAME_READY(0, "游戏准备"),
    GAME_PLAYING(1, "游戏中"),
    GAME_OVER(2, "游戏结束"),
    ;

    private int value;
    private String name;
    private RoomStatus(int value, String name){
        this.value = value;
        this.name = name;
    }

    @Override
    public int getValue() {
        return this.value;
    }

    @Override
    public String getLabel() {
        return this.name;
    }

}
