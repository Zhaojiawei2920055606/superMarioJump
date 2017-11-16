package com.tongzhuo.climbstairs.basic;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 游戏配置
 * @author brookLIGX
 */
@Component
@ConfigurationProperties(ignoreUnknownFields = false, prefix = "game")
public class GameConfig {

    private String host;
    private int port;
    private String socketUrl;
    private int maxPlayerCount;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getSocketUrl() {
        return socketUrl;
    }

    public void setSocketUrl(String socketUrl) {
        this.socketUrl = socketUrl;
    }

    public int getMaxPlayerCount() {
        return maxPlayerCount;
    }

    public void setMaxPlayerCount(int maxPlayerCount) {
        this.maxPlayerCount = maxPlayerCount;
    }

}
