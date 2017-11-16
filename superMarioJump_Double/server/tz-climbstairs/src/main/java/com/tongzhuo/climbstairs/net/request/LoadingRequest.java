package com.tongzhuo.climbstairs.net.request;

import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Request;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.climbstairs.basic.MessageId;
import com.tongzhuo.climbstairs.net.handler.LoadingHandler;

/**
 * 进度Request
 * 
 * @author brookLIGX
 */
@Component
@Request(handler = LoadingHandler.class, msgId = MessageId.MSGID_LOADING)
public class LoadingRequest extends BasicRequest {

    private int percent = 0;

	public int getPercent() {
		return percent;
	}

	public void setPercent(int percent) {
		this.percent = percent;
	}

}
