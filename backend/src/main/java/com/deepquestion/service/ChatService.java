package com.deepquestion.service;

import com.deepquestion.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ChatService {
    
    private final WebClient webClient;
    
    @Value("${ai.service}")
    private String aiService;
    
    @Value("${ai.openai.api-key}")
    private String openaiApiKey;
    
    @Value("${ai.openai.model}")
    private String openaiModel;
    
    @Value("${ai.openai.max-tokens}")
    private Integer openaiMaxTokens;
    
    @Value("${ai.openai.temperature}")
    private Double openaiTemperature;
    
    @Value("${ai.claude.api-key}")
    private String claudeApiKey;
    
    @Value("${ai.claude.model}")
    private String claudeModel;
    
    @Value("${ai.claude.max-tokens}")
    private Integer claudeMaxTokens;
    
    @Value("${ai.system-prompt}")
    private String systemPrompt;
    
    public ChatService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }
    
    public Mono<ChatResponse> processMessage(ChatRequest request) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        
        log.debug("Processing message with AI service: {}", aiService);
        
        if ("claude".equalsIgnoreCase(aiService)) {
            return callClaudeAPI(request.getMessage(), sessionId);
        } else {
            return callOpenAIAPI(request.getMessage(), sessionId);
        }
    }
    
    private Mono<ChatResponse> callOpenAIAPI(String message, String sessionId) {
        OpenAIRequest.Message systemMessage = new OpenAIRequest.Message("system", systemPrompt);
        OpenAIRequest.Message userMessage = new OpenAIRequest.Message("user", message);
        
        OpenAIRequest openAIRequest = new OpenAIRequest(
                openaiModel,
                List.of(systemMessage, userMessage),
                openaiMaxTokens,
                openaiTemperature
        );
        
        return webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(openAIRequest)
                .retrieve()
                .bodyToMono(OpenAIResponse.class)
                .timeout(Duration.ofSeconds(30))
                .map(response -> {
                    if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                        String aiMessage = response.getChoices().get(0).getMessage().getContent();
                        return ChatResponse.success(aiMessage, sessionId);
                    } else {
                        return ChatResponse.error("AI로부터 응답을 받지 못했습니다.", sessionId);
                    }
                })
                .doOnError(error -> log.error("OpenAI API 호출 실패: {}", error.getMessage()))
                .onErrorReturn(ChatResponse.error("AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.", sessionId));
    }
    
    private Mono<ChatResponse> callClaudeAPI(String message, String sessionId) {
        ClaudeRequest.Message userMessage = new ClaudeRequest.Message("user", message);
        
        ClaudeRequest claudeRequest = new ClaudeRequest(
                claudeModel,
                claudeMaxTokens,
                List.of(userMessage),
                systemPrompt
        );
        
        return webClient.post()
                .uri("https://api.anthropic.com/v1/messages")
                .header("x-api-key", claudeApiKey)
                .header("anthropic-version", "2023-06-01")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(claudeRequest)
                .retrieve()
                .bodyToMono(ClaudeResponse.class)
                .timeout(Duration.ofSeconds(30))
                .map(response -> {
                    if (response.getContent() != null && !response.getContent().isEmpty()) {
                        String aiMessage = response.getContent().get(0).getText();
                        return ChatResponse.success(aiMessage, sessionId);
                    } else {
                        return ChatResponse.error("AI로부터 응답을 받지 못했습니다.", sessionId);
                    }
                })
                .doOnError(error -> log.error("Claude API 호출 실패: {}", error.getMessage()))
                .onErrorReturn(ChatResponse.error("AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.", sessionId));
    }
    
    public Mono<String> getHealthCheck() {
        return Mono.just("ChatService is running with AI service: " + aiService);
    }
}