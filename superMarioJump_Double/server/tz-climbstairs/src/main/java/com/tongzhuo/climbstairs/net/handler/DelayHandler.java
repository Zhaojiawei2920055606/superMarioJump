package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;
import com.tongzhuo.climbstairs.net.response.DelayResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

/**
 * 延迟Handler
 * 
 * @author brookLIGX
 */
@Component
public class DelayHandler implements RequestHandler<ResponseResult> {

    private static final Logger LOGGER = LoggerFactory.getLogger(DelayHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);

        String roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
        String userId = channel.attr(AttributeKey.valueOf("userId")).get().toString();

        LOGGER.info("DelayHandler " + userId + "/" + roomId + "!");
        broadCastService.broadcastForOnePlayer(roomId, userId, new DelayResponse());
        return null;
    }

}
