# DeepQuestion - AI 개인 성장 스토리 어시스턴트 🌱

개인의 과거 경험을 체계적으로 탐구하여 성장 스토리를 발굴하는 AI 대화형 웹 애플리케이션입니다.

## 📖 프로젝트 소개

이 프로젝트는 **AI 기반 개인 성장 스토리 발굴 서비스**를 구현한 Spring Boot 웹 애플리케이션입니다. 전문적으로 설계된 프롬프트 엔지니어링을 통해 사용자의 과거 경험을 단계적으로 탐구하고, 이를 바탕으로 의미 있는 성장 내러티브를 구성하는 것이 핵심 기능입니다.

### 🎯 개발 목표
- AI 대화형 인터페이스를 통한 개인 스토리 발굴
- 텍스트와 음성 입력을 모두 지원하는 멀티모달 UX
- 체계적인 질문 체계로 사용자 경험의 의미 도출
- 개인의 핵심 역량과 성장 패턴 식별

## ⚡ 핵심 기능

### 🤖 AI 대화 시스템
- **Google Gemini API** 통합으로 자연스러운 대화 구현
- **전문 프롬프트 설계**로 개인 성장 스토리에 특화된 질문 생성
- **단계적 질문 체계**를 통한 점진적 경험 탐구

### 🎙️ 멀티모달 입력
- **텍스트 채팅**: 실시간 타이핑 인터페이스
- **음성 인식**: Google Cloud Speech-to-Text API 활용
- **반응형 UI**: 모던한 glassmorphism 디자인 적용

### 💡 개인화된 경험
- **맞춤형 후속 질문**: 사용자 답변에 기반한 적응형 대화
- **핵심 역량 식별**: 문제해결력, 리더십, 창의성 등 강점 발굴
- **성장 스토리 구성**: 파편적 경험의 통합적 내러티브 생성

## 🏗️ 기술 아키텍처

### 백엔드 (Spring Boot)
- **Spring Boot 3.2.0** - REST API 서버 프레임워크
- **Java 17** - 프로그래밍 언어
- **Maven** - 빌드 도구 및 의존성 관리

### AI 통합
- **Google Gemini API** - 대화형 AI 엔진
- **Google Cloud Speech-to-Text** - 음성 인식 서비스
- **커스텀 프롬프트 엔지니어링** - 성장 스토리 특화 대화 로직

### 프론트엔드
- **Vanilla JavaScript** - 클라이언트 사이드 기능
- **HTML5/CSS3** - 구조 및 스타일링
- **Web API** - 마이크 권한, 파일 업로드 등
- **Glassmorphism UI** - 모던 디자인 시스템

### 프로젝트 구조
```
DeepQuestion/
├── backend/                          # Spring Boot 애플리케이션
│   ├── src/main/java/com/deepquestion/
│   │   ├── DeepQuestionApplication.java    # 메인 애플리케이션
│   │   ├── controller/ChatController.java  # REST API 컨트롤러
│   │   ├── service/ChatService.java       # 비즈니스 로직
│   │   └── dto/                           # 데이터 전송 객체
│   ├── src/main/resources/
│   │   ├── application.properties         # 설정 파일
│   │   └── static/index.html             # 프론트엔드 UI
│   └── pom.xml                           # Maven 설정
└── README.md                             # 프로젝트 문서
```

## 🛠️ 실행 방법

### 필수 준비사항
- **Java 17** 이상
- **Maven 3.6** 이상  
- **Google Gemini API 키** ([발급 방법](https://makersuite.google.com/app/apikey))

### 1. 환경 설정
```bash
# 저장소 클론
git clone <repository-url>
cd DeepQuestion

# 환경변수 설정
cp .env.example .env
# .env 파일에서 GEMINI_API_KEY 값 수정
```

### 2. 실행
```bash
cd backend
mvn clean package
java -jar target/deep-question-1.0.0.jar
```

### 3. 접속
브라우저에서 `http://localhost:8080` 접속

## 💡 주요 구현 사항

### API 엔드포인트
- **POST /api/chat** - 텍스트 채팅
- **POST /api/chat/voice** - 음성 채팅 (multipart/form-data)

### 보안 설정
- API 키 환경변수 관리
- 민감한 프롬프트 정보 외부화
- CORS 정책 적용

### 기능 특징
- **단계적 질문 체계**: 쉬운 질문부터 심화 질문으로 진행
- **역량 중심 분석**: 문제해결력, 리더십, 창의성 등 강점 발굴
- **적응형 대화**: 사용자 답변에 기반한 맞춤형 후속 질문

## ⭐ 프로젝트 특징

### 개발 의도
이 프로젝트는 **AI 프롬프트 엔지니어링**과 **대화형 UX 설계**에 중점을 둔 실험적 프로젝트입니다. 단순한 채팅봇을 넘어서, 특정 도메인(개인 성장 스토리)에 특화된 AI 대화 시스템을 구현했습니다.

### 기술적 도전
- **프롬프트 엔지니어링**: 체계적인 질문 프레임워크 설계
- **멀티모달 인터페이스**: 텍스트/음성 입력의 통합 처리
- **적응형 대화 로직**: 사용자 응답에 따른 동적 질문 생성
- **RESTful API 설계**: 확장 가능한 백엔드 아키텍처

### 학습 성과
- Spring Boot 3.x 기반 웹 애플리케이션 개발
- Google Cloud API 통합 (Gemini, Speech-to-Text)
- 프론트엔드-백엔드 연동 및 비동기 통신
- 환경변수 관리 및 보안 설정
- Maven 빌드 시스템 활용

---

## 🔧 개발 환경 설정

### 로컬 개발
```bash
# 개발 서버 실행
cd backend
mvn spring-boot:run

# 또는 IDE에서 DeepQuestionApplication.java 실행
```

### 빌드 및 패키징
```bash
mvn clean package -DskipTests
java -jar target/deep-question-1.0.0.jar
```

---

**📝 Portfolio Project** - AI 대화 시스템과 웹 풀스택 개발 역량을 보여주는 프로젝트입니다.