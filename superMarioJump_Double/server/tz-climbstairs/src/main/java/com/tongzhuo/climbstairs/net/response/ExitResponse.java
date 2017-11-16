package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.net.protocol.BasicResponse;

/**
 * 玩家退出Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_EXIT)
public class ExitResponse extends BasicResponse{

    private final static String KEY_PLAYER_ID = "playerId";

    public ExitResponse(String playerId) {
        this.putContent(KEY_PLAYER_ID, playerId);
    }

}
