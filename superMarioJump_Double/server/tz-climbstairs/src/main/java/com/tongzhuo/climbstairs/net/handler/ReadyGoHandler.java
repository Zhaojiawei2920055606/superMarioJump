package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.climbstairs.net.request.ReadyGoRequest;
import com.tongzhuo.climbstairs.net.response.ReadyGoResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;
import com.tongzhuo.climbstairs.service.RoomService;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

/**
 * 准备Handler
 * 
 * @author brookLIGX
 */
@Component
public class ReadyGoHandler implements RequestHandler<ResponseResult>{

    private static final Logger LOGGER = LoggerFactory.getLogger(ReadyGoHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        RoomService roomService = AppContextHolder.getBean(RoomService.class);

        String roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
        String currUserId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            LOGGER.debug("[ReadyGoHandler error] room " + roomId + " not found !");
            return null;
        }
        if (!(request instanceof ReadyGoRequest)) {
            LOGGER.debug("[ReadyGoRequest error] convert error in " + roomId + "! " + request.getClass().getName());
            return null;
        }


        GameUser currUser = room.getUser(currUserId);
        GameUser anotherUser = roomService.getAnotherUser(roomId, currUserId);

        synchronized (roomId.intern()) {
            if (anotherUser != null && anotherUser.isEnterGameScene() && !currUser.isEnterGameScene()) {// 开始游戏
                BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);
                broadCastService.broadcastToAll(roomId, new ReadyGoResponse(0));
                room.setBeginTime(System.currentTimeMillis());
            }
            currUser.setEnterGameScene(true);
        }

        LOGGER.info("User " + currUser.getNickname() + "[" + currUser.getUserId() + "] is ready!");

        return null;
    }

}
