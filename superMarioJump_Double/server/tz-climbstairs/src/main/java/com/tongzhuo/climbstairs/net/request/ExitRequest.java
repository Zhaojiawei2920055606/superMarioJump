package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.ExitHandler;

/**
 * 玩家退出Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = ExitHandler.class, msgId = MessageId.MSGID_EXIT)
public class ExitRequest extends BasicRequest {

}
