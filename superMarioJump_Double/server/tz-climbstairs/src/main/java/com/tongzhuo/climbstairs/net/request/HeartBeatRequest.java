package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.HeartBeatHandler;
import com.tongzhuo.net.protocol.BasicRequest;

/**
 * 心跳Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = HeartBeatHandler.class, msgId = MessageId.MSGID_HEARTBEAT)
public class HeartBeatRequest extends BasicRequest { 
}