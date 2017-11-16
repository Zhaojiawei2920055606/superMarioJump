package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.net.protocol.BasicResponse;

/**
 * 玩家信息Response
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_PLAYERINFO)
public class PlayerInfoResponse extends BasicResponse {

    private final static String KEY_OP_PLAYER = "opPlayer";

    public PlayerInfoResponse(GameUser opPlayer) {
        this.putContent(KEY_OP_PLAYER, opPlayer);
    }

}
