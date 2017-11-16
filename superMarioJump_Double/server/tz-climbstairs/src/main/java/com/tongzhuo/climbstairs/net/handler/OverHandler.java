package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.net.request.OverRequest;
import com.tongzhuo.climbstairs.service.GameService;
import com.tongzhuo.climbstairs.service.RoomService;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

/**
 * 玩家退出Handler
 * 
 * @author brookLIGX
 */
@Component
public class OverHandler implements RequestHandler<ResponseResult> {

    private static final Logger LOGGER = LoggerFactory.getLogger(OverHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        GameService gameService = AppContextHolder.getBean(GameService.class);
        RoomService roomService = AppContextHolder.getBean(RoomService.class);

        String roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
        String currUserId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            LOGGER.debug("[OverHandler error] room " + roomId + " not found !");
            return null;
        }

        if (!(request instanceof OverRequest)) {
            LOGGER.debug("[OverHandler error] convert error in " + roomId + "! " + request.getClass().getName());
            return null;
        }

        gameService.gameOver(room, currUserId);
        return null;
    }

}
