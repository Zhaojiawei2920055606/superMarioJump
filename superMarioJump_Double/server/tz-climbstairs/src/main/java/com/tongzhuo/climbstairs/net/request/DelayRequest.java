package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.DelayHandler;

/**
 * 延迟Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = DelayHandler.class, msgId = MessageId.MSGID_DELAY)
public class DelayRequest extends BasicRequest {

}
