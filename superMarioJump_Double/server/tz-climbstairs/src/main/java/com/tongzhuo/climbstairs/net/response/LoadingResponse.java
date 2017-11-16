package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.net.protocol.BasicResponse;

/**
 * 进度Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_LOADING)
public class LoadingResponse extends BasicResponse{

    private final static String KEY_PERCENT = "percent";

    public LoadingResponse(int percent) {
        this.putContent(KEY_PERCENT, percent);
    }

}
