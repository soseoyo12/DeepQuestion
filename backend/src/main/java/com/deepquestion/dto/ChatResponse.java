package com.deepquestion.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private String message;
    private String sessionId;
    private LocalDateTime timestamp;
    private boolean success;
    private String error;
    
    public static ChatResponse success(String message, String sessionId) {
        return new ChatResponse(message, sessionId, LocalDateTime.now(), true, null);
    }
    
    public static ChatResponse error(String error, String sessionId) {
        return new ChatResponse(null, sessionId, LocalDateTime.now(), false, error);
    }
}