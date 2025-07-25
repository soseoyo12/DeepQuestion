package com.deepquestion.dto;

/**
 * 채팅 요청 데이터를 담는 DTO 클래스
 * 사용자의 질문을 전달받음
 */
public class ChatRequest {
    // 사용자가 입력한 실제 질문/메시지
    private String message;
    
    public ChatRequest() {}
    
    public ChatRequest(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}