package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.net.protocol.BasicResponse;

/**
 * 跳转场景Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_TEAM)
public class TeamResponse extends BasicResponse {

    private final static String KEY_TEAM = "team";

    public TeamResponse(int team) {
        this.putContent(KEY_TEAM, team);
    }

}
