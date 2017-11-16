package com.tongzhuo.climbstairs.net.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.climbstairs.net.request.LoadingRequest;
import com.tongzhuo.climbstairs.net.response.LoadingResponse;
import com.tongzhuo.climbstairs.service.BroadCastService;
import com.tongzhuo.climbstairs.service.GameService;
import com.tongzhuo.climbstairs.service.RoomService;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.RequestHandler;
import com.tongzhuo.net.protocol.ResponseResult;

import io.netty.channel.Channel;
import io.netty.util.AttributeKey;

/**
 * 进度Handler
 * 
 * @author brookLIGX
 */
@Component
public class LoadingHandler implements RequestHandler<ResponseResult> {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoadingHandler.class);

    @Override
    public ResponseResult handleRequest(BasicRequest request, Channel channel) {
        BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);
        RoomService roomService = AppContextHolder.getBean(RoomService.class);
        GameService gameService = AppContextHolder.getBean(GameService.class);

        String roomId = null;
        String currUserId = null;
        try {
            roomId = channel.attr(AttributeKey.valueOf("roomId")).get().toString();
            currUserId = channel.attr(AttributeKey.valueOf("userId")).get().toString();
        } catch (Exception e) {
            LOGGER.error("[LoadingHandler error] roomId or userId is empty!");
            return null;
        }

        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            LOGGER.error("[LoadingHandler error] room " + roomId + " not found !");
            return null;
        }

        if (!(request instanceof LoadingRequest)) {
            LOGGER.error("[LoadingHandler error] convert error in " + roomId + "! " + request.getClass().getName());
            return null;
        }

        GameUser currUser = (GameUser) room.getUser(currUserId);
        GameUser anotherUser = roomService.getAnotherUser(roomId, currUserId);

        LoadingRequest requ_progress = (LoadingRequest) request;

        if (anotherUser != null) {// 如果对方存在，则发送
            LoadingResponse resp_loading = new LoadingResponse(requ_progress.getPercent());
            broadCastService.broadcastForOnePlayer(roomId, anotherUser.getUserId(), resp_loading);
        }
        synchronized (roomId) { // 避免两人同时进入, 避免同一人进两次, 保证Jump只触发一次
            if (currUser.getProgress() < 100 && requ_progress.getPercent() == 100 && anotherUser != null
                    && anotherUser.getProgress() == 100) {
                LOGGER.info("Game[" + roomId + ", " + currUserId + ", " + anotherUser.getUserId() + "] begin");
                gameService.sendJumpMessage(roomId);
            }
            currUser.setProgress(requ_progress.getPercent());
        }
        return null;
    }

}
