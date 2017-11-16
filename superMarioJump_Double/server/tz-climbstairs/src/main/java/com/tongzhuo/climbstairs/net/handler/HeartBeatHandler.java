package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.climbstairs.net.response.HeartBeatResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

@Component
public class HeartBeatHandler implements RequestHandler<ResponseResult> {
    private static final Logger LOGGER = LoggerFactory.getLogger(HeartBeatHandler.class);

    @Autowired
    BroadCastService broadCastService;

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {

        String roomId = "";
        String playerId = "";
        try {
            roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
            playerId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        } catch (Exception e) {
            LOGGER.error("CreateBoardH  andler Error: roomid or userid is Empty!");
            return null;
        }
        try {
            HeartBeatResponse response = new HeartBeatResponse();
            broadCastService.broadcastForOnePlayer(roomId, playerId, response);
        } catch (Exception e) {
            LOGGER.error("", e);
        }

        return null;
    }

}