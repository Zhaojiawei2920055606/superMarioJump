package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.net.protocol.BasicResponse;

/**
 * 准备Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_READYGO)
public class ReadyGoResponse extends BasicResponse {

    private final static String KEY_OP_DELAY = "opDelay";

    public ReadyGoResponse(int opDelay) {
        this.putContent(KEY_OP_DELAY, opDelay);
    }

}
