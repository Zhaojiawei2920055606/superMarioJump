/**
 * 
 */
package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.net.request.MoveRequest;
import com.tongzhuo.climbstairs.net.response.MoveResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;
import com.tongzhuo.climbstairs.service.RoomService;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

/**
 * 
 * @author brookLIGX
 */
@Component
public class MoveHandler implements RequestHandler<ResponseResult> {

    private static final Logger LOGGER = LoggerFactory.getLogger(MoveHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        RoomService roomService = AppContextHolder.getBean(RoomService.class);
        BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);

        String roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
        String userId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            LOGGER.debug("[MoveHandler error] room " + roomId + " not found !");
            return null;
        }
        if (!(request instanceof MoveRequest)) {
            LOGGER.debug("[MoveHandler error] convert error in " + roomId + "! " + request.getClass().getName());
            return null;
        }
        double x = ((MoveRequest) request).getX();
        double y = ((MoveRequest) request).getY();
        int dirction = ((MoveRequest) request).getDirction();
        boolean invert = ((MoveRequest) request).isInvert();
        int index = ((MoveRequest) request).getIndex();
        boolean right = ((MoveRequest) request).isRight();
        broadCastService.broadcastToOthers(roomId, userId, new MoveResponse(x, y, dirction, invert, index, right));
        return null;
    }

}
