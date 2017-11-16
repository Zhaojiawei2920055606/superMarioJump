/**
 * 
 */
package com.tongzhuo.climbstairs.net.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.net.protocol.BasicResponse;
import com.tongzhuo.climbstairs.basic.MessageId;

/**
 * 
 * @author brookLIGX
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@Response(msgId = MessageId.MSGID_MOVE)
public class MoveResponse extends BasicResponse {

    private final static String KEY_X = "x";

    private final static String KEY_Y = "y";

    private final static String KEY_DIRCTION = "dirction";

    private final static String KEY_INVERT = "invert";

    private final static String KEY_INDEX = "index";

    private final static String KEY_RIGHT = "right";

    public MoveResponse(double x, double y, int dirction, boolean invert, int index, boolean right) {
        this.putContent(KEY_X, x);
        this.putContent(KEY_Y, y);
        this.putContent(KEY_DIRCTION, dirction);
        this.putContent(KEY_INVERT, invert);
        this.putContent(KEY_INDEX, index);
        this.putContent(KEY_RIGHT, right);
    }

}
