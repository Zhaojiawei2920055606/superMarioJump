package com.tongzhuo.climbstairs.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.climbstairs.enums.PlayerStatus;
import com.tongzhuo.climbstairs.net.response.ExitResponse;
import com.tongzhuo.climbstairs.net.response.PlayerInfoResponse;
import com.tongzhuo.climbstairs.net.response.TeamResponse;

/**
 * 玩家服务
 * @author brookLIGX
 */
@Component
public class PlayerService {

    @Autowired
    RoomService roomService;

    @Autowired
    BroadCastService broadCastService;

    public void onPlayerConnect(String roomId, String userId, String nickname, String iconUrl) {
        if (roomService.getRoom(roomId) == null) {
            // TODO 返回异常
            return;
        }
        GameUser currentUser = roomService.getUser(roomId, userId);
        currentUser.setNickname(nickname);
        currentUser.setIconUrl(iconUrl);
        GameUser anotherUser = roomService.getAnotherUser(roomId, userId);
        synchronized (roomId) {// 保证两人同时进入只出发一次
            if (anotherUser == null || anotherUser.getTeam() == 0) {
                Random rdm = new Random(System.currentTimeMillis());
                currentUser.setTeam(Math.abs(rdm.nextInt() % 2) + 1);
            } else {
                currentUser.setTeam((anotherUser.getTeam() == 1) ? 2 : 1);
            }
            broadCastService.broadcastForOnePlayer(roomId, userId, new TeamResponse(currentUser.getTeam()));
            if (anotherUser != null && anotherUser.getStatus() > 0) {// 不是默认状态, currentUser.getStatus() == 0 && 
                String anotherId = anotherUser.getUserId();
                // 两人都连入服务器发送对方的玩家信息
                broadCastService.broadcastForOnePlayer(roomId, anotherId,
                    new PlayerInfoResponse(currentUser));
                broadCastService.broadcastForOnePlayer(roomId, userId, new PlayerInfoResponse(anotherUser));
            }
            currentUser.setStatus(PlayerStatus.ENTER_ROOM.getValue());
        }
    }

    public void playerExit(String roomId, String userId) {
        GameRoom room = roomService.getRoom(roomId);
        if (room == null) {
            return;
        }
        broadCastService.broadcastToOthers(roomId, userId, new ExitResponse(userId));
        roomService.destroyRoom(roomId);
    }
}
