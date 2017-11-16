package com.tongzhuo.climbstairs.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.basic.annotation.Response;
import com.tongzhuo.net.handler.WebSocketServerHandler;
import com.tongzhuo.net.protocol.BasicResponse;
import com.tongzhuo.redis.SerializeRedisDao;
import com.tongzhuo.utils.JsonUtils;

import io.netty.channel.Channel;
import io.netty.channel.ChannelId;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;


/**
 * WebSocket 连接缓存
 * @author brookLIGX
 */ 
@Component
public class SocketSessionCache {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
     
    @Autowired
    private SerializeRedisDao serRedisTemplateDao;
    

    public void saveSession(String userId, String roomId, ChannelId channelId) {
        String key = "climbstairs:" + userId + "_" + roomId;  
        serRedisTemplateDao.saveObject(key, channelId); 
    }

    public void removeSession(String userId, String roomId) {
        String key = "climbstairs:" + userId + "_" + roomId;
        serRedisTemplateDao.deleteObject(key);
    }

    public ChannelId getSessionId(String userId, String roomId) {
        String key = "climbstairs:" + userId + "_" + roomId;
        Object obj = serRedisTemplateDao.getObject(key);
        return obj == null ? null : (ChannelId)obj ;
    }
    
    public Channel getSession(String userId, String roomId){
        ChannelId id = this.getSessionId(userId, roomId);
        if (id == null) {
            return null;
        }
        return WebSocketServerHandler.channels.find(id);
    }

    public void sendToUser(String userId, String roomId, BasicResponse response){
        Channel channel = this.getSession(userId, roomId);
        if ((channel != null) && channel.isActive() && channel.isOpen()){
            Response info = response.getClass().getAnnotation(Response.class);
            response.setMsgId(info.msgId());
            Object content = response.getContent();
            response.setContent(JsonUtils.toJSONString(content));
            String msg = JsonUtils.toJSONString(response); 
            response.setContent(content);
            logger.info("发送给客户端：user：{}, {} ", userId, msg);
            channel.writeAndFlush(new TextWebSocketFrame(msg)); 
        }
    }

    public void sendMessage(Channel channel, BasicResponse response){  
        Response info = response.getClass().getAnnotation(Response.class);
        response.setMsgId(info.msgId());
        String msg = JsonUtils.toJSONString(response); 

        logger.info("发送给客户端： {} ", msg, channel.id().asShortText());
        channel.writeAndFlush(new TextWebSocketFrame(msg));  
    }
}
