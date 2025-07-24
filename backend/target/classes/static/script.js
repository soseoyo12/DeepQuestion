class DeepQuestionChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.voiceButton = document.getElementById('voiceButton');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.isRecording = false;
        this.recognition = null;
        this.messageHistory = [];
        this.isProcessing = false;
        this.sessionId = null;
        
        
        this.initializeEventListeners();
        this.initializeSpeechRecognition();
        this.autoResizeTextarea();
        
        // 페이지 가시성 변경 감지
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.voiceButton.addEventListener('click', () => this.toggleVoiceRecording());
        
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateSendButtonState();
        });
    }
    
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'ko-KR';
            
            this.recognition.onstart = () => {
                this.isRecording = true;
                this.voiceButton.classList.add('recording');
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.autoResizeTextarea();
                this.updateSendButtonState();
            };
            
            this.recognition.onend = () => {
                this.isRecording = false;
                this.voiceButton.classList.remove('recording');
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.voiceButton.classList.remove('recording');
                this.addMessage('ai', '음성 인식 중 오류가 발생했습니다. 다시 시도해주세요.');
            };
        } else {
            this.voiceButton.style.display = 'none';
            console.log('Speech recognition not supported');
        }
    }
    
    toggleVoiceRecording() {
        if (!this.recognition) return;
        
        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    updateSendButtonState() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isProcessing;
    }
    
    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;
        
        // 중복 실행 방지
        this.isProcessing = true;
        
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.updateSendButtonState();
        
        this.showLoading();
        
        try {
            const response = await this.getAIResponse(message);
            this.addMessage('ai', response);
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('ai', '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            this.hideLoading();
            this.isProcessing = false; // 처리 완료 후 플래그 해제
            this.updateSendButtonState(); // 버튼 상태 업데이트
        }
    }
    
    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // 메시지 아바타 생성
        const messageAvatar = document.createElement('div');
        messageAvatar.className = 'message-avatar';
        
        const avatarSmall = document.createElement('div');
        avatarSmall.className = 'avatar-small';
        avatarSmall.textContent = type === 'ai' ? '🤖' : '👤';
        
        messageAvatar.appendChild(avatarSmall);
        
        // 메시지 콘텐츠 생성
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        // 멀티라인 텍스트 처리
        const formattedContent = (content || '').replace(/\n/g, '<br>');
        messageText.innerHTML = formattedContent;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString('ko-KR', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(messageAvatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // 메시지 애니메이션
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
        this.sendButton.disabled = true;
    }
    
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
        this.updateSendButtonState();
    }
    
    async getAIResponse(message) {
        // 세션 ID가 없으면 생성
        if (!this.sessionId) {
            this.sessionId = this.generateSessionId();
        }
        
        // 메시지 히스토리에 추가 (현재 메시지는 백엔드에서 처리)
        // this.messageHistory.push({ role: 'user', content: message }); // 이 줄을 제거
        
        // 메시지를 백엔드로 전송
        try {
            const response = await fetch('/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId,
                    messageHistory: this.messageHistory.map(msg => ({ role: msg.role, content: msg.content })) // role과 content를 명확히 지정
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // AI 응답을 히스토리에 추가
                this.messageHistory.push({ role: 'assistant', content: data.message });
                return data.message;
            } else {
                console.error('AI response error:', data.error);
                return data.error || '응답을 받을 수 없습니다.';
            }
        } catch (error) {
            console.error('Network error:', error);
            
            // 백엔드 연결 실패 시 데모 응답 제공
            return this.getDemoResponse(message);
        }
    }
    
    getDemoResponse(message) {
        const demoResponses = [
            '현재 시스템이 일시적으로 연결되지 않아 데모 모드로 동작하고 있습니다.',
            '말씀해주신 내용을 잘 들었습니다. 시스템이 복구되면 더 자세한 답변을 드릴 수 있습니다.',
            '흥미로운 질문이네요! 지금은 데모 모드이지만, 실제 시스템에서는 더 깊이 있는 분석을 제공할 수 있습니다.',
            '좋은 생각이에요! 시스템이 정상화되면 이에 대해 더 구체적으로 이야기해보겠습니다.'
        ];
        
        return demoResponses[Math.floor(Math.random() * demoResponses.length)];
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    
    handleVisibilityChange() {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 (탭 전환, 최소화 등)
            if (this.isRecording) {
                this.recognition.stop();
            }
        }
    }
}

// 페이지 로드 시 채팅 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DeepQuestionChat();
});