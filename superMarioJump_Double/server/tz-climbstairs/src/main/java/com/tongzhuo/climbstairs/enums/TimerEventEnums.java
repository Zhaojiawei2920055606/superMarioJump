package com.tongzhuo.climbstairs.enums;

import com.tongzhuo.basic.enums.INameEnum;

/**
 * Timer事件枚举
 * 
 * @author Xiong
 */
public enum TimerEventEnums implements INameEnum {

    Interval(1, 2, "间隔"),
    ;

    private int value;

    private int delay;

    private String name;

    private TimerEventEnums(int value, int delay, String name) {
        this.value = value;
        this.delay = delay;
        this.name = name;
    }

    public int getDelay() {
        return this.delay;
    }

    public void setDelay(int delay) {
        this.delay = delay;
    }

    @Override
    public int getValue() {
        return this.value;
    }

    @Override
    public String getLabel() {
        return this.name;
    }

    /**
     * 通过数值获取枚举对象
     * 
     * @param value
     * @return
     */
    public static TimerEventEnums parse(int value) {
        TimerEventEnums type = null;
        for (TimerEventEnums t : TimerEventEnums.values()) {
            if (value == t.getValue()) {
                type = t;
                break;
            }
        }
        return type;
    }

}
