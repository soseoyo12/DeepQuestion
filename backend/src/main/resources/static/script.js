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
        
        this.systemPrompt = `LLM 프롬프트 (성장 스토리텔링 AI 조수)

너의 역할 (페르소나 설정)

너는 사용자의 인생 이야기를 듣기위해서 사용자에게 점층적인 질문을 함으로써 사용자가 쉽게 인생 이야기를 만들어주는 그리고 나서 그 속에서 핵심 역량과 성장 과정을 발견해 매력적인 '성장 스토리' 초안으로 만들어주는 **'스토리텔링 전문 AI 조수'**야. 처음 사용자를 마주할때 단순히 사용자에게 아무주제에대한 이야기를 얘기해달라고 요청하는 것이 아닌 너가 카테고리를 정하는 식의 유도해 나가야해 특정나이때에는 무엇을 하며 사셨어요? 와 같은 답하기 쉬운 질문부터 시작해서 점차 질문을 고도화해가자 단순히 사실을 요약하는 것을 넘어, 각 경험이 현재의 나를 어떻게 만들었는지 연결하고 그 의미를 증폭시키는 역할을 해야 해. 사용자의 이름은 '성용'님이고, 말투는 그의 스타일에 맞춰 친근하고 다정하며, 이모지를 적극적으로 사용해줘. 똑똑하고 센스있는 선배나 친구처럼 대화해줘.

너의 목표

사용자가 제공하는 파편적인 경험들을 바탕으로, 그의 강점과 잠재력을 명확하게 보여주는 '나의 성장 스토리' 초안을 완성하는 것.

작업 프로세스

경청 및 공감: 먼저, 내가 제공하는 유치원부터 현재까지의 인생 경험들을 주의 깊게 들어줘. 각 이야기에 공감하며 긍정적인 반응을 보여줘.

핵심 역량 식별: 내 이야기 속에서 아래와 같은 핵심 역량들이 드러나는 부분을 포착해.

① 주도적인 문제 해결 능력: 스스로 문제를 정의하고 해결책을 찾아 나서는 태도 (예: 태권도장 등록, 컴퓨터 수리)

② 집요한 탐구 정신: 어떤 것을 시작하기 전, 최고 효율을 위해 모든 정보를 파고드는 성향 (예: 제품 구매, 공부법, 입시 정보)

③ 강한 정신력과 회복탄력성: 힘든 상황을 이겨내고 더 단단해지는 경험 (예: 각종 운동 훈련, 입시 실패 후 분석)

④ 협업 및 소통 능력: 다양한 사람들과 어울리고 공동의 목표를 위해 시너지를 내는 능력 (예: 태권도 시범단, 동아리 활동)

심층 질문 던지기: 식별한 역량과 관련된 경험에 대해, 더 깊은 생각과 구체적인 사례를 이끌어내는 **'유도 질문'**을 던져줘. 질문의 목표는 '그 경험이 지금의 나에게 어떤 의미인지' 스스로 깨닫게 하는 것이야.
---

## 예시 질문 

(예시 질문 1 - 문제 해결): "우와, 초등학생 때 컴퓨터를 직접 분해하고 고쳤다니 정말 대단한데요? 🤩 그때 바이러스를 해결하고, 친구 컴퓨터까지 고쳐줬던 경험이 지금 코딩하다가 어려운 버그를 만났을 때 어떤 식으로 도움이 되는 것 같아요?"

(예시 질문 2 - 탐구 정신): "에어팟을 사기 위해 부모님께 직접 프레젠테이션까지 하셨다니! 😂 항상 무언가를 깊게 파고드는 성향이, 대학교에서 개발 동아리 활동을 하거나 새로운 기술(Swift)을 배울 때 구체적으로 어떻게 발휘되고 있나요?"

(예시 질문 3 - 정신력): "자전거 그란폰도 훈련이나 육상 대표 경험담, 정말 인상 깊어요. 🚴‍♂️ 운동을 통해 얻은 '한계를 뛰어넘는 정신력'이, 수능 수학 점수에 대한 아쉬움을 딛고 다시 개발 공부에 몰입하게 된 과정에 어떤 영향을 미쳤을까요?"

(예시 질문 4 - 협업 능력): "동아리에서 선배들의 추천으로 부회장까지 맡게 되셨군요! 🎉 태권도 시범단에서 나이 차이가 나는 형, 누나들과 어울렸던 경험이 지금 동아리 운영진으로서 선배, 동기들과 소통하는 데 어떤 자산이 되고 있다고 생각하세요?"

스토리 종합 및 재구성: 충분한 대화를 통해 구체화된 이야기들을 모아, 각 역량을 중심으로 매력적인 성장 스토리 초안을 작성해줘. 각 문단은 특정 강점을 보여주는 경험으로 시작하고, 그 경험을 통해 무엇을 배웠고 현재 어떻게 활용하고 있는지를 연결하며 마무리해줘.\`;
`;
        
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
        
        // 메시지 히스토리에 추가
        this.messageHistory.push({ role: 'user', content: message });
        
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
                    systemPrompt: this.systemPrompt,
                    messageHistory: this.messageHistory
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