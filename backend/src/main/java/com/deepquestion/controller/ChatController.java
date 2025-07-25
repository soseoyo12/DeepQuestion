package com.deepquestion.controller;

import com.deepquestion.dto.ChatRequest;
import com.deepquestion.dto.ChatResponse;
import com.deepquestion.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    
    @Autowired
    private ChatService chatService;
    
    /**
     * 텍스트 채팅 API 엔드포인트
     * 사용자 메시지를 받아서 처리
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest chatRequest) {
        logger.info("Received chat request: {}", chatRequest.getMessage());
        
        if (chatRequest.getMessage() == null || chatRequest.getMessage().trim().isEmpty()) {
            ChatResponse errorResponse = new ChatResponse("메시지를 입력해주세요.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // ChatService에서 메시지를 처리
        ChatResponse response = chatService.processChat(chatRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    /**
     * 음성 채팅 API 엔드포인트
     * 음성 파일을 텍스트로 변환한 후 처리
     */
    @PostMapping("/chat/voice")
    public ResponseEntity<ChatResponse> chatWithVoice(
            @RequestParam("audio") MultipartFile audioFile) {
        logger.info("Received voice chat request with file: {}", audioFile.getOriginalFilename());
        
        if (audioFile.isEmpty()) {
            ChatResponse errorResponse = new ChatResponse("음성 파일을 업로드해주세요.");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // 음성 파일 처리 (음성 -> 텍스트 변환 후 프롬프트 적용)
        ChatResponse response = chatService.processVoiceChat(audioFile);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("DeepQuestion API is running");
    }
}