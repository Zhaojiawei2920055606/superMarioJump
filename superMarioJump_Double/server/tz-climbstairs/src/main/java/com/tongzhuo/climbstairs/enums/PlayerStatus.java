package com.tongzhuo.climbstairs.enums;

import com.tongzhuo.basic.enums.INameEnum;

/**
 * 玩家状态
 * @author brookLIGX
 */
public enum PlayerStatus implements INameEnum{

    DEFAULT(0, "默认状态"),
    ENTER_ROOM(1, "进入房间"),
    IN_GAME(2, "游戏中"),
    ;

    private int value;
    private String name;
    private PlayerStatus(int value, String name){
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
