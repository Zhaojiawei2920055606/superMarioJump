package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.net.protocol.BasicResponse;
import com.tongzhuo.climbstairs.basic.MessageId;

/**
 * 延迟Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_DELAY)
public class DelayResponse extends BasicResponse {

}
