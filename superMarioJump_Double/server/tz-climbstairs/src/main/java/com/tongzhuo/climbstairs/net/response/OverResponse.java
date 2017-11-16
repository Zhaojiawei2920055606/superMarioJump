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
@Response(msgId = MessageId.MSGID_OVER)
public class OverResponse extends BasicResponse {

    private final static String KEY_WIN = "win";

    private final static String KEY_TIME = "time";

    public OverResponse(int win, String time) {
        this.putContent(KEY_WIN, win);
        this.putContent(KEY_TIME, time);
    }

}
