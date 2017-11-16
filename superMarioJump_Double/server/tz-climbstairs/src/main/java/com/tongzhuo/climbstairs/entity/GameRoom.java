package com.tongzhuo.climbstairs.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 房间信息
 * 
 * @author brookLIGX
 */
public class GameRoom {

    /**
     * 房间ID
     */
    private String roomId;

    /**
     * 房间状态值
     */
    private int status;

    /**
     * 胜者ID
     */
    private String winner;

    /**
     * 用户数据
     */
    private Map<String, GameUser> users = new HashMap<String, GameUser>();

    private long beginTime;

    /**
     * 开始时间
     */
    public String getRoomId() {
        return roomId;
    }

    public GameRoom(String roomId) {
        this.roomId = roomId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public GameUser getUser(String userId) {
        return users.get(userId);
    }

    public List<GameUser> getUsers() {
        return new ArrayList<GameUser>(users.values());
    }

    public Map<String, GameUser> getAllUser() {
        return users;
    }

    public long getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(long beginTime) {
        this.beginTime = beginTime;
    }

}
