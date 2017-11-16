package com.tongzhuo.climbstairs.net;

import java.nio.charset.Charset;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.tongzhuo.net.handler.WebSocketServerHandler;
import com.tongzhuo.net.protocol.BasicRequest;
import com.tongzhuo.net.protocol.ProtocolMapper;
import com.tongzhuo.net.protocol.ResponseResult;
import com.tongzhuo.climbstairs.cache.SocketSessionCache;
import com.tongzhuo.climbstairs.service.PlayerService;
import com.tongzhuo.utils.StringUtil;

import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.QueryStringDecoder;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PingWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PongWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory;
import io.netty.handler.timeout.IdleState;
import io.netty.handler.timeout.IdleStateEvent;
import io.netty.util.AttributeKey;

@Sharable
@Component
public class WebSocketHandlerImpl extends WebSocketServerHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketHandlerImpl.class);
    @Autowired SocketSessionCache socketSessionCache;
    @Autowired PlayerService playerService;

    @Override
    protected void otherRequest(ChannelHandlerContext ctx, ByteBuf msg) {
        LOGGER.info("WebSocketHandlerImpl   otherRequest :" + msg.toString(Charset.defaultCharset()));
    }

    @Override
    protected void doHandlerRemoved(ChannelHandlerContext ctx) throws Exception {
        readTimeOut(ctx.channel());
    }

    @Override
    protected void handleHttpRequest(final ChannelHandlerContext ctx, final FullHttpRequest req) {
        WebSocketServerHandshakerFactory factory = new WebSocketServerHandshakerFactory(this.getWebSocketLocation(req),
                null, true);
        WebSocketServerHandshaker handShaker = factory.newHandshaker(req);
        if (handShaker == null) {
            WebSocketServerHandshakerFactory.sendUnsupportedVersionResponse(ctx.channel());
        } else {
            handShaker.handshake(ctx.channel(), req).addListener(new ChannelFutureListener() {
                public void operationComplete(ChannelFuture future) throws Exception {
                    // 握手结束
                    LOGGER.info("{} handshake end...", future.channel().remoteAddress().toString());
                    // 存储session
//                    String[] params = Util.getWsUriParams(req.uri());
//                    String roomId = params[0];
//                    String userId = params[1];
                    QueryStringDecoder decoder = new QueryStringDecoder(req.uri());
                    String roomId = decoder.parameters().get("roomId").get(0);
                    String userId = decoder.parameters().get("userId").get(0);
                    String nickname = decoder.parameters().get("nickname").get(0);
                    String iconUrl = decoder.parameters().get("iconUrl").get(0);
                    if (!StringUtil.isEmpty(roomId) && !StringUtil.isEmpty(userId)) {
                        // 判断是否已经存在
//                        if (socketSessionCache.getSession(userId, roomId) == null) {
                            ctx.channel().attr(AttributeKey.valueOf("userId")).set(userId);
                            ctx.channel().attr(AttributeKey.valueOf("roomId")).set(roomId);
                            socketSessionCache.saveSession(userId, roomId, ctx.channel().id());
                            // 防止重入
//                        } else {
//                            return;
//                        }
                        playerService.onPlayerConnect(roomId, userId, nickname, iconUrl);
                    }

                }
            });
        }
    }

    @Override
    protected void handleWsRequest(ChannelHandlerContext ctx, WebSocketFrame msg) {
        LOGGER.info("WebSocketHandlerImpl   handleWsRequest");
        if (msg instanceof CloseWebSocketFrame) {
            LOGGER.info("Socket 断开连接.");
            readTimeOut(ctx.channel());
            ctx.channel().write(new CloseWebSocketFrame());
        } else if (msg instanceof PingWebSocketFrame) {
            ctx.channel().write(new PongWebSocketFrame(msg.content().retain()));

        } else if (msg instanceof TextWebSocketFrame) {
            String userId = null;
            String roomId = null;
            try {
                AttributeKey<String> attrUserId = AttributeKey.valueOf("userId");
                AttributeKey<String> attrRoomId = AttributeKey.valueOf("roomId");
                userId = ctx.channel().attr(attrUserId).get().toString();
                roomId = ctx.channel().attr(attrRoomId).get().toString();
            } catch (Exception e) {
                
            }
            LOGGER.info("收到WebSocket消息: {}, {} - {}", userId, roomId, ((TextWebSocketFrame) msg).text());
            // 获取请求数据
            JSONObject json = JSONObject.parseObject(((TextWebSocketFrame) msg).text());
            int msgId = Integer.parseInt(json.get("msgId").toString());
            String msgBody = json.get("content").toString();
            // 转成对应的Request对象
            Class<? extends BasicRequest> requestModel = ProtocolMapper.getRequestModel(msgId);
            BasicRequest request = JSON.parseObject(msgBody, requestModel);
            this.handle(request, ctx.channel());
        } else {
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        super.userEventTriggered(ctx, evt);
        if (evt instanceof IdleStateEvent) {
            IdleStateEvent event = (IdleStateEvent) evt;
            // 读操作超时-服务端发给客户端后，没有响应
            if (event.state().equals(IdleState.READER_IDLE)) {
                readTimeOut(ctx.channel());
            } else if (event.state().equals(IdleState.WRITER_IDLE)) {
            } else if (event.state().equals(IdleState.ALL_IDLE)) {
            }
        }
    }

    @Override
    protected void sendResponse(Channel channel, ResponseResult response) {
    }

    private void readTimeOut(Channel channel) {
        LOGGER.info("Socket客户端 连接断开。 IP ：{}", channel.remoteAddress().toString());
        AttributeKey<String> attrUserId = AttributeKey.valueOf("userId");
        AttributeKey<String> attrRoomId = AttributeKey.valueOf("roomId");

        // 判断是否存在
        if (channel.hasAttr(attrUserId) && channel.hasAttr(attrRoomId)) {
            String roomId = null;
            String userId = null;
            try {
                roomId = channel.attr(attrRoomId).get().toString();
                userId = channel.attr(attrUserId).get().toString();
            } catch(Exception e) {
                // nothing
            }

            // 从ChannelSeesion中移除
            super.removeChannelCache(channel);
            channel.close();

            // 从RedisSession中移除
            socketSessionCache.removeSession(userId, roomId);
            // 发送退出消息
            playerService.playerExit(roomId, userId);
        }

    }
}
