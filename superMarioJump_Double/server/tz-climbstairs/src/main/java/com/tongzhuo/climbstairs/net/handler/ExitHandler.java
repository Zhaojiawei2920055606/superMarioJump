package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.net.request.ExitRequest;
import com.tongzhuo.climbstairs.net.response.ExitResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;
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
public class ExitHandler implements RequestHandler<ResponseResult> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExitHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);
        RoomService roomService = AppContextHolder.getBean(RoomService.class);

        String roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
        String currUserId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            LOGGER.debug("[ExitHandler error] room " + roomId + " not found !");
            return null;
        }

        if (!(request instanceof ExitRequest)) {
            LOGGER.debug("[ExitHandler error] convert error in " + roomId + "! " + request.getClass().getName());
            return null;
        }

        ExitResponse resp_exit = new ExitResponse(currUserId);
        broadCastService.broadcastToOthers(roomId, currUserId, resp_exit);
        return null;
    }
}
