package com.tongzhuo.climbstairs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.tongzhuo.net.NettyServer;
import com.tongzhuo.net.protocol.ProtocolMapper;
import com.tongzhuo.climbstairs.basic.GameConfig;
import com.tongzhuo.climbstairs.net.WebSocketHandlerImpl;

@Component
@ComponentScan(value = "com.tongzhuo")
public class ApplicationStartup {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(ApplicationStartup.class);

    @Autowired
    GameConfig socketConf;

    @Autowired
    NettyServer nettyServer;

    @Autowired
    WebSocketHandlerImpl handler;

    public void init(ApplicationContext act) {
        LOGGER.info(">>>>>> Spring Boot 启动， 开始初始化配置加载 。。。。。");
        ProtocolMapper.init(act);

        LOGGER.info(">>>>>> WebSocket 开始初始化，HOST=" + socketConf.getHost()
                + ", PORT=" + socketConf.getPort() + " 。。。。。");
        nettyServer.host(socketConf.getHost(), socketConf.getPort(), handler)
                .start();
    }

}