package com.tongzhuo.climbstairs.entity;

/**
 * 玩家信息
 * 
 * @author brookLIGX
 */
public class GameUser {

    /* ******模拟App接口内容****** */
    private String userId;

    private String nickname;

    private String iconUrl;

    private String skin;

    private int progress;

    private boolean enterGameScene = false;

    private int status;

    /* ******游戏相关内容****** */
    private int team;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getSkin() {
        return skin;
    }

    public void setSkin(String skin) {
        this.skin = skin;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public boolean isEnterGameScene() {
        return enterGameScene;
    }

    public void setEnterGameScene(boolean enterGameScene) {
        this.enterGameScene = enterGameScene;
    }

    public int getTeam() {
        return team;
    }

    public void setTeam(int team) {
        this.team = team;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

}
