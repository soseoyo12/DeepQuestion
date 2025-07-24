package com.deepquestion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    @NotBlank(message = "메시지는 비어있을 수 없습니다")
    @Size(max = 1000, message = "메시지는 1000자를 초과할 수 없습니다")
    private String message;
    
    private String sessionId;
}