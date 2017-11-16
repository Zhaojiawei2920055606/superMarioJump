package com.tongzhuo.climbstairs.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.climbstairs.cache.GameCache;
import com.tongzhuo.climbstairs.cache.SocketSessionCache;
import com.tongzhuo.climbstairs.entity.GameRoom;
import com.tongzhuo.climbstairs.entity.GameUser;

/**
 * 房间服务
 * 
 * @author brookLIGX
 */
@Component
public class RoomService {

    @Autowired
    SocketSessionCache socketSessionCache;

    /**
     * 获取房间信息
     */
    public GameRoom getRoom(String roomId) {
        return GameCache.getGameRoom(roomId);
    }

    /**
     * 获取另一个用户
     */
    public GameUser getAnotherUser(String roomId, String currUserId) {
        GameRoom room = this.getRoom(roomId);
        Map<String, GameUser> users = room.getAllUser();
        for (String userId : users.keySet()) {
            if (userId != null && !userId.equals(currUserId)) {
                return users.get(userId);
            }
        }
        return null;
    }

    /**
     * 获取用户信息
     */
    public GameUser getUser(String roomId, String userId) {
        GameRoom room = this.getRoom(roomId);
        return room == null ? null : room.getUser(userId);
    }

    /**
     * 销毁房间
     */
    public void destroyRoom(String roomId) {
        GameCache.destroyRoom(roomId);
    }
}
