package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.net.protocol.BasicResponse;

@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_HEARTBEAT)
public class HeartBeatResponse extends BasicResponse {

    public HeartBeatResponse() {
    }

    @Override
    public String toString() {
        return "HeartBeatResponse []";
    }
}