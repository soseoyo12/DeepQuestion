package com.deepquestion.controller;

import com.deepquestion.dto.ChatRequest;
import com.deepquestion.dto.ChatResponse;
import com.deepquestion.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    
    @PostMapping("/message")
    public Mono<ResponseEntity<ChatResponse>> sendMessage(@Valid @RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request.getMessage().substring(0, Math.min(50, request.getMessage().length())));
        
        return chatService.processMessage(request)
                .map(response -> {
                    if (response.isSuccess()) {
                        log.info("Successfully processed chat request for session: {}", response.getSessionId());
                        return ResponseEntity.ok(response);
                    } else {
                        log.error("Failed to process chat request: {}", response.getError());
                        return ResponseEntity.internalServerError().body(response);
                    }
                })
                .onErrorResume(error -> {
                    log.error("Error processing chat request", error);
                    ChatResponse errorResponse = ChatResponse.error(
                            "시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", 
                            request.getSessionId()
                    );
                    return Mono.just(ResponseEntity.internalServerError().body(errorResponse));
                });
    }
    
    @GetMapping("/health")
    public Mono<ResponseEntity<String>> healthCheck() {
        return chatService.getHealthCheck()
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.internalServerError().body("Service is down"));
    }
    
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("DeepQuestion Chat Service is running");
    }
}