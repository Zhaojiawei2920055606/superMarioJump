package com.tongzhuo.climbstairs.entity;

import com.tongzhuo.climbstairs.enums.TimerEventEnums;
import com.tongzhuo.timer.ITimerMessage;

/**
 * 房间定时器消息
 * <pre>
 * 当房间中设置的定时器被触发时，发送该消息
 * </pre>
 */
public class TimerMessage implements ITimerMessage{
	private String roomId;
	private String playerId;
	private TimerEventEnums event;
	private long beginTime;
	
	public TimerMessage() { }
	public TimerMessage(String roomId, TimerEventEnums event) {
		this.roomId = roomId; 
		this.event = event;
		this.beginTime = System.currentTimeMillis();
	}
	public TimerMessage(String roomId, String playerId, TimerEventEnums event) {
		this.roomId = roomId;
		this.playerId = playerId;
		this.event = event;
		this.beginTime = System.currentTimeMillis();
	}
	
	
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
	public String getPlayerId() {
		return playerId;
	}
	public void setPlayerId(String playerId) {
		this.playerId = playerId;
	}
	public TimerEventEnums getEvent() {
		return event;
	}
	public void setEvent(TimerEventEnums event) {
		this.event = event;
	}
	public int getEventId() {
		return event.getValue();
	} 
	public int getDelay() {
		return event.getDelay();
	} 
	public long getBeginTime() { 
		return beginTime;
	}  
}