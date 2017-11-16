package com.tongzhuo.climbstairs.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.AppContextHolder;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.climbstairs.net.response.JumpResponse;
import com.tongzhuo.climbstairs.net.response.OverResponse;

/**
 * 游戏服务
 * @author brookLIGX
 */
@Component
public class GameService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GameService.class);

    @Autowired
    RoomService roomService;

    @Autowired
    BroadCastService broadCastService;

    /**
     * 发送跳转场景消息
     */
    public void sendJumpMessage(String roomId) {
        GameRoom room = roomService.getRoom(roomId);
        // 向客户端发送开始消息
        int seed = initData(room);

        GameUser player1 = room.getUsers().get(0);
        GameUser player2 = room.getUsers().get(1);

        // 向客户端发送开始消息
        BroadCastService broadCastService = AppContextHolder.getBean(BroadCastService.class);
        JumpResponse response1 = new JumpResponse(seed, player1.getTeam(), player2.getTeam());
        JumpResponse response2 = new JumpResponse(seed, player2.getTeam(), player1.getTeam());
        broadCastService.broadcastForOnePlayer(roomId, player1.getUserId(), response1);
        broadCastService.broadcastForOnePlayer(roomId, player2.getUserId(), response2);
    }

    /**
     * 初始化数据
     */
    private int initData(GameRoom room) {
        Random rdm = new Random(System.currentTimeMillis());
        int seed = Math.abs(rdm.nextInt());

        //        int team1 = Math.abs(rdm.nextInt() % 2);
        //        int team2 = team1 ^ 1;
        //
        //        GameUser player1 = room.getUsers().get(0);
        //        player1.setTeam(team1 + 1);
        //        GameUser player2 = room.getUsers().get(1);
        //        player2.setTeam(team2 + 1);

        LOGGER.info("Init game :>> seed=" + seed + " room=" + room.getRoomId());
        return seed;
    }

    public void gameOver(GameRoom room, String userId) {
        synchronized (room.getRoomId().intern()) {
            if (room.getWinner() == null) {
                String time = getTimeStr(System.currentTimeMillis() - room.getBeginTime() - 1800);// 1800是倒计时消耗的时间
                GameUser winner = roomService.getUser(room.getRoomId(), userId);
                if (winner == null) {
                    broadCastService.broadcastToAll(room.getRoomId(), new OverResponse(0, time));
                } else {
                    room.setWinner(userId);
                    broadCastService.broadcastForOnePlayer(room.getRoomId(), userId, new OverResponse(1, time));
                    broadCastService.broadcastToOthers(room.getRoomId(), userId, new OverResponse(2, time));
                }
            }
        }
    }

    private String getTimeStr(long time) {
        String timeStr = new SimpleDateFormat("mm:ss:SSS").format(new Date(time));
        return timeStr.substring(0, timeStr.length() - 1);
    }

}
