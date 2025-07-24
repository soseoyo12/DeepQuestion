package com.deepquestion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    @NotBlank(message = "메시지는 비어있을 수 없습니다")
    @Size(max = 4000, message = "메시지는 4000자를 초과할 수 없습니다")
    private String message;
    
    private String sessionId;

    private List<OpenAIRequest.Message> messageHistory;
}