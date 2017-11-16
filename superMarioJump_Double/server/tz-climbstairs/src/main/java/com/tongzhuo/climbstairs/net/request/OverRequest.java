/**
 * 
 */
package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.OverHandler;
import com.tongzhuo.net.protocol.BasicRequest;

/**
 * 进度Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = OverHandler.class, msgId = MessageId.MSGID_OVER)
public class OverRequest extends BasicRequest {

}
