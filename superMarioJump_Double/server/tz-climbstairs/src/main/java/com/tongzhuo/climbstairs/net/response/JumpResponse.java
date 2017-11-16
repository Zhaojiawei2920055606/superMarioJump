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
@Response(msgId = MessageId.MSGID_JUMP)
public class JumpResponse extends BasicResponse {

    private final static String KEY_SEED = "seed";


    private final static String KEY_SF_TEAM_ID = "sfTeamId";

    private final static String KEY_OP_TEAM_ID = "opTeamId";

    public JumpResponse(int seed, int sfTeamId, int opTeamId) {
        this.putContent(KEY_SEED, seed);
        this.putContent(KEY_SF_TEAM_ID, sfTeamId);
        this.putContent(KEY_OP_TEAM_ID, opTeamId);
    }

}
