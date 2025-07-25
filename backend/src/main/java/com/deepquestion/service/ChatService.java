package com.deepquestion.service;

import com.deepquestion.dto.ChatRequest;
import com.deepquestion.dto.ChatResponse;
import com.deepquestion.dto.GeminiRequest;
import com.deepquestion.dto.GeminiResponse;
import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class ChatService {
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    
    private final WebClient webClient;
    private final String geminiApiKey;
    private final String geminiApiUrl;
    // 시스템 기본 프rompt (application.properties에서 설정)
    private final String systemPrompt;
    
    public ChatService(@Value("${gemini.api.key}") String geminiApiKey,
                      @Value("${gemini.api.url}") String geminiApiUrl,
                      @Value("${app.system.prompt:}") String systemPrompt) {
        this.geminiApiKey = geminiApiKey;
        this.geminiApiUrl = geminiApiUrl;
        // application.properties의 app.system.prompt 값을 주입받음 (기본값: 빈 문자열)
        this.systemPrompt = systemPrompt;
        this.webClient = WebClient.builder().build();
    }
    
    public ChatResponse processChat(ChatRequest chatRequest) {
        try {
            // 사용자 메시지와 시스템 프롬프트를 조합하여 최종 프롬프트 생성
            String finalPrompt = buildFinalPrompt(chatRequest.getMessage());
            
            GeminiRequest geminiRequest = createGeminiRequest(finalPrompt);
            
            GeminiResponse geminiResponse = callGeminiApi(geminiRequest);
            
            String responseText = extractResponseText(geminiResponse);
            
            return new ChatResponse(responseText, true);
            
        } catch (Exception e) {
            logger.error("Error processing chat request", e);
            return new ChatResponse("죄송합니다. 요청을 처리하는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 시스템 프롬프트와 사용자 메시지를 조합하여 최종 프롬프트를 생성하는 핵심 메소드
     * 시스템 프롬프트 > 기본 메시지
     */
    private String buildFinalPrompt(String userMessage) {
        StringBuilder finalPrompt = new StringBuilder();
        
        // 시스템 프롬프트 사용 (application.properties에서 설정)
        if (systemPrompt != null && !systemPrompt.trim().isEmpty()) {
            finalPrompt.append("다음 지침에 따라 답변해주세요:\n");
            finalPrompt.append(systemPrompt);
            finalPrompt.append("\n\n사용자 질문: ");
        }
        // 실제 사용자 질문 추가
        finalPrompt.append(userMessage);
        
        return finalPrompt.toString();
    }
    
    private GeminiRequest createGeminiRequest(String prompt) {
        GeminiRequest.Part part = new GeminiRequest.Part(prompt);
        GeminiRequest.Content content = new GeminiRequest.Content(Arrays.asList(part));
        return new GeminiRequest(Arrays.asList(content));
    }
    
    private GeminiResponse callGeminiApi(GeminiRequest request) {
        try {
            return webClient.post()
                    .uri(geminiApiUrl)
                    .header("x-goog-api-key", geminiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            logger.error("Gemini API error: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Gemini API 호출 실패: " + e.getMessage());
        }
    }
    
    private String extractResponseText(GeminiResponse response) {
        if (response == null || response.getCandidates() == null || response.getCandidates().isEmpty()) {
            throw new RuntimeException("Invalid response from Gemini API");
        }
        
        GeminiResponse.Candidate candidate = response.getCandidates().get(0);
        if (candidate.getContent() == null || candidate.getContent().getParts() == null || 
            candidate.getContent().getParts().isEmpty()) {
            throw new RuntimeException("No content in Gemini API response");
        }
        
        return candidate.getContent().getParts().get(0).getText();
    }
    
    public ChatResponse processVoiceChat(MultipartFile audioFile) {
        try {
            logger.info("Processing voice chat with file: {}", audioFile.getOriginalFilename());
            
            // 음성을 텍스트로 변환
            String transcribedText = transcribeAudio(audioFile);
            
            if (transcribedText == null || transcribedText.trim().isEmpty()) {
                return new ChatResponse("음성을 인식할 수 없습니다. 다시 시도해주세요.");
            }
            
            logger.info("Transcribed text: {}", transcribedText);
            
            // 변환된 텍스트로 채팅 처리
            ChatRequest chatRequest = new ChatRequest(transcribedText);
            return processChat(chatRequest);
            
        } catch (Exception e) {
            logger.error("Error processing voice chat", e);
            return new ChatResponse("음성 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    private String transcribeAudio(MultipartFile audioFile) {
        try (SpeechClient speechClient = SpeechClient.create()) {
            // 오디오 파일을 ByteString으로 변환
            ByteString audioBytes = ByteString.copyFrom(audioFile.getBytes());
            
            // 오디오 설정
            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();
            
            // 인식 설정
            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.WEBM_OPUS)
                    .setSampleRateHertz(48000)
                    .setLanguageCode("ko-KR") // 한국어 설정
                    .addAlternativeLanguageCodes("en-US") // 영어도 지원
                    .setEnableAutomaticPunctuation(true)
                    .build();
            
            // 음성 인식 수행
            RecognizeResponse response = speechClient.recognize(config, audio);
            List<SpeechRecognitionResult> results = response.getResultsList();
            
            if (results.isEmpty()) {
                logger.warn("No speech recognition results found");
                return null;
            }
            
            // 가장 신뢰도가 높은 결과 반환
            StringBuilder transcript = new StringBuilder();
            for (SpeechRecognitionResult result : results) {
                if (!result.getAlternativesList().isEmpty()) {
                    SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                    transcript.append(alternative.getTranscript());
                    logger.info("Transcription confidence: {}", alternative.getConfidence());
                }
            }
            
            return transcript.toString().trim();
            
        } catch (IOException e) {
            logger.error("Error transcribing audio with Google Cloud Speech-to-Text", e);
            // Fallback: 간단한 더미 응답
            logger.warn("Using fallback transcription due to error");
            return "음성 인식 중 오류가 발생했습니다.";
        }
    }
}