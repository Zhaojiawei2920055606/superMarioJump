package com.tongzhuo.climbstairs.service;

import java.util.Iterator;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.tongzhuo.net.protocol.BasicResponse;
import com.tongzhuo.climbstairs.cache.SocketSessionCache;
import com.tongzhuo.climbstairs.entity.GameUser;
import com.tongzhuo.utils.StringUtil;
 
/**
 * 发送数据的service层
 * @author brookLIGX
 */
@Component
public class BroadCastService {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired RoomService roomService;
	@Autowired SocketSessionCache sessionCache;
	


	/**
	 * 将消息广播给所有人
	 */
	public void broadcastToAll(String roomId, BasicResponse response) {
		Map<String, GameUser> players = roomService.getRoom(roomId).getAllUser(); 
		Iterator<String> iterator = players.keySet().iterator();
		while (iterator.hasNext()) {
			String userId = iterator.next();
			try {
				sessionCache.sendToUser(userId,roomId, response);
			} catch (Exception e) {
				logger.error("给客户端[" + roomId + ", " + userId + "]发送" + response.getClass().getSimpleName() + "异常", e);
			}
		}
	} 
	
	/**
	 * 把自己的数据、状态 广播给房间内的其他人 
	 */
	public void broadcastToOthers(String roomId, String selfId, BasicResponse response) {
		Map<String, GameUser> players = roomService.getRoom(roomId).getAllUser(); 
		Iterator<String> iterator = players.keySet().iterator();
		while (iterator.hasNext()) {
			String userId = iterator.next();
			if (StringUtil.isEmpty(selfId) || !userId.equals(selfId)){
				try {
					sessionCache.sendToUser(userId,roomId, response);
				} catch (Exception e) {
					logger.error("给客户端[" + roomId + ", " + userId + "]发送" + response.getClass().getSimpleName() + "异常", e);
				}
			}
		}
	}
	
	/**
	 * 广播数据给某一个人 
	 */
	public void broadcastForOnePlayer(String roomId, String userId, BasicResponse response) {
		sessionCache.sendToUser(userId, roomId, response); 
	}
}
