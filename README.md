# DeepQuestion - AI 채팅 서비스 🤖

claude.md 파일의 요구사항을 바탕으로 구현된 AI 채팅 웹 서비스입니다. 텍스트와 음성 입력을 모두 지원하며, Spring Boot 백엔드와 연동되어 실제 AI API(OpenAI GPT 또는 Claude)를 사용할 수 있습니다.

## 🚀 주요 기능

- **채팅 인터페이스**: 실시간 채팅 형태의 직관적인 UI
- **텍스트 입력**: 키보드 입력 및 Enter 키 지원
- **음성 입력**: 브라우저 음성 인식 기능 (Chrome 권장)
- **AI 연동**: OpenAI GPT 또는 Claude API 지원
- **반응형 디자인**: 모바일/데스크톱 호환
- **세션 관리**: 대화 세션별 관리
- **스토리텔링 AI**: 사용자의 인생 이야기를 듣고 성장 스토리로 만들어주는 전문 AI

## 🛠 설치 및 실행

### 1. 백엔드 실행 (Spring Boot)

```bash
# 백엔드 디렉토리로 이동
cd backend

# Maven으로 의존성 설치 및 빌드
mvn clean install

# 환경 변수 설정 (OpenAI 사용 시)
export OPENAI_API_KEY=your-openai-api-key-here

# 또는 Claude 사용 시
export CLAUDE_API_KEY=your-claude-api-key-here

# 애플리케이션 실행
mvn spring-boot:run
```

### 2. 프론트엔드 실행

```bash
# 프로젝트 루트 디렉토리에서
# 웹 서버 실행 (Python 예시)
python -m http.server 3000

# 또는 Node.js 서버
npx http-server -p 3000

# 브라우저에서 접속
open http://localhost:3000
```

## 📁 프로젝트 구조

```
DeepQuestion/
├── index.html          # 메인 웹페이지
├── styles.css          # 스타일시트
├── script.js           # 프론트엔드 JavaScript
├── CLAUDE.md           # 프로젝트 요구사항
├── README.md           # 이 파일
└── backend/            # Spring Boot 백엔드
    ├── pom.xml
    └── src/main/
        ├── java/com/deepquestion/
        │   ├── DeepQuestionApplication.java
        │   ├── controller/ChatController.java
        │   ├── service/ChatService.java
        │   ├── config/WebConfig.java
        │   └── dto/
        │       ├── ChatRequest.java
        │       ├── ChatResponse.java
        │       ├── OpenAIRequest.java
        │       ├── OpenAIResponse.java
        │       ├── ClaudeRequest.java
        │       └── ClaudeResponse.java
        └── resources/
            └── application.properties
```

## ⚙️ 설정 방법

### AI API 설정

`backend/src/main/resources/application.properties` 파일에서 AI 서비스를 설정할 수 있습니다:

```properties
# 사용할 AI 서비스 선택 (openai 또는 claude)
ai.service=openai

# OpenAI 설정
ai.openai.api-key=${OPENAI_API_KEY:your-openai-api-key-here}
ai.openai.model=gpt-3.5-turbo
ai.openai.max-tokens=1000
ai.openai.temperature=0.7

# Claude 설정  
ai.claude.api-key=${CLAUDE_API_KEY:your-claude-api-key-here}
ai.claude.model=claude-3-sonnet-20240229
ai.claude.max-tokens=1000

# 시스템 프롬프트 커스터마이즈
ai.system-prompt=당신은 DeepQuestion AI입니다...
```

### 환경 변수 설정

실제 AI API를 사용하려면 환경 변수로 API 키를 설정해야 합니다:

```bash
# macOS/Linux
export OPENAI_API_KEY="sk-your-openai-key"
export CLAUDE_API_KEY="sk-ant-your-claude-key"

# Windows
set OPENAI_API_KEY=sk-your-openai-key
set CLAUDE_API_KEY=sk-ant-your-claude-key
```

## 🎯 사용법

1. **백엔드 서버 실행**: `mvn spring-boot:run`
2. **프론트엔드 서버 실행**: 웹 서버로 index.html 제공
3. **브라우저 접속**: http://localhost:3000
4. **채팅 시작**: 텍스트 입력 또는 🎤 버튼으로 음성 입력

## 🔧 개발 모드

API 키가 설정되지 않았거나 백엔드 서버가 실행되지 않은 경우, 프론트엔드는 자동으로 데모 모드로 전환되어 시뮬레이션된 응답을 제공합니다.

## 📋 API 엔드포인트

### POST /api/chat/message
채팅 메시지 처리

**Request:**
```json
{
  "message": "안녕하세요",
  "sessionId": "session-123"
}
```

**Response:**
```json
{
  "message": "안녕하세요! 무엇을 도와드릴까요?",
  "sessionId": "session-123",
  "timestamp": "2024-01-01T10:00:00",
  "success": true,
  "error": null
}
```

### GET /api/chat/health
서비스 상태 확인

### GET /api/chat/status
서비스 실행 상태 확인

## 🐛 문제 해결

### 음성 인식이 작동하지 않는 경우
- Chrome 브라우저 사용 권장
- HTTPS 환경에서 테스트 (localhost는 HTTP도 가능)
- 마이크 권한 허용 확인

### 백엔드 연결 실패
- 백엔드 서버가 8080 포트에서 실행 중인지 확인
- CORS 오류 시 WebConfig 설정 확인
- 콘솔에서 네트워크 오류 메시지 확인

### AI API 오류
- API 키가 올바르게 설정되었는지 확인
- API 사용량 한도 확인
- 네트워크 연결 상태 확인

## 🏗 기술 스택

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Web Speech API (음성 인식)
- Fetch API (HTTP 통신)

**Backend:**
- Spring Boot 3.2.0
- Java 17
- Spring WebFlux (비동기 HTTP 클라이언트)
- Maven

**AI APIs:**
- OpenAI GPT-3.5/4
- Anthropic Claude 3

## 📄 라이센스

이 프로젝트는 개인 프로젝트용으로 제작되었습니다.