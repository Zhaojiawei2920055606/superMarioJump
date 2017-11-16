package com.tongzhuo.climbstairs.contorller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tongzhuo.net.protocol.ResponseResult;
import com.tongzhuo.climbstairs.basic.GameConfig;
import com.tongzhuo.climbstairs.cache.GameCache;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.timer.TimerCache;

@RestController 
public class TestController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class); 

    @Autowired GameConfig gameConfig;


    @GetMapping(value = "/roomTest")
    public ResponseResult roomTest(String roomId) {
        TimerCache.stopRoomTimer(roomId);
        LOGGER.info("[Test]创建房间：" + roomId);
        GameRoom room = new GameRoom(roomId);
        GameCache.putGameRoom(room);
        for (int i = 0; i < gameConfig.getMaxPlayerCount(); i++) {
            GameUser user = buildGameUser(String.valueOf(i));
            room.getAllUser().put(user.getUserId(), user);
        }
        return buildRoomResponseResult(room);
    }

    private GameUser buildGameUser(String key) {
        GameUser user = new GameUser();
        user.setUserId("user-" + key);
        user.setNickname("玩家-" + key);
        user.setIconUrl("http://7xjxba.com1.z0.glb.clouddn.com/14358229262529?e=1751182930&token=bz2giEcTM9os8itpIhHdGYMjBQHeaS1dkxEqLWu4:BbZGTXWyJ4GyCetpt28UbymZ384=");
        return user;
    }

    private ResponseResult buildRoomResponseResult(GameRoom room) {
        ResponseResult result =  new ResponseResult();
        List<String> players = new ArrayList<>();
        for (GameUser user : room.getUsers()) {
            players.add(user.getUserId());
        }
        result.addData("players", players);
        result.addData("room", room.getRoomId());
        return result;
    }

}
