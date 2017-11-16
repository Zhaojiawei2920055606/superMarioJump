package com.tongzhuo.climbstairs.cache;

import java.util.HashMap;
import java.util.Map;

import com.tongzhuo.climbstairs.entity.GameRoom;

public class GameCache {

    private static Map<String, GameRoom> rooms = new HashMap<String, GameRoom>();

    public static GameRoom getGameRoom(String roomId) {
        return rooms.get(roomId);
    }

    public static void putGameRoom(GameRoom room) {
        rooms.put(room.getRoomId(), room);
    }

    public static void destroyRoom(String roomId) {
        rooms.remove(roomId);
    }

}
