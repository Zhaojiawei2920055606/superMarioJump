package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.ReadyGoHandler;
import com.tongzhuo.net.protocol.BasicRequest;

/**
 * 准备Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = ReadyGoHandler.class, msgId = MessageId.MSGID_READYGO)
public class ReadyGoRequest extends BasicRequest {

    private int sfDelay = 0;

    public synchronized int getSfDelay() {
        return sfDelay;
    }

    public synchronized void setSfDelay(int delay) {
        this.sfDelay = delay;
    }

}
