/**
 * 
 */
package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.MoveHandler;
import com.tongzhuo.net.protocol.BasicRequest;

/**
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = MoveHandler.class, msgId = MessageId.MSGID_MOVE)
public class MoveRequest extends BasicRequest {

    private double x;

    private double y;

    private int dirction;

    private boolean invert;

    private int index;

    private boolean right;

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public int getDirction() {
        return dirction;
    }

    public void setDirction(int dirction) {
        this.dirction = dirction;
    }

    public boolean isInvert() {
        return invert;
    }

    public void setInvert(boolean invert) {
        this.invert = invert;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public boolean isRight() {
        return right;
    }

    public void setRight(boolean right) {
        this.right = right;
    }

}
