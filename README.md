<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Metaverse NestJS Monorepo Project

## 프로젝트 소개

이 프로젝트는 NestJS를 사용하여 모노레포 구조로 구성된 백엔드 서버입니다. 여러 기능별 애플리케이션과 공용 라이브러리로 이루어져 있습니다.

## 디렉토리 구조

```plaintext
metaverse-backend-server/
├── apps/
│   ├── account/
│   │   ├── src/
│   │   │   └── main.ts
│   ├── admin/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── contents/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── gateway/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── pass-auth/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── payments/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── sockets/
│   │   ├── src/
|   │   │   └── main.ts
│   ├── webview/
│   │   ├── src/
|   │   │   └── main.ts
├── libs/
│   ├── common/
│   ├── constants/
│   ├── entity/
│   ├── mongodb/
│   ├── redis/
├── package.json
├── nest-cli.json
├── tsconfig.json
└── README.md
```

## 디렉토리 설명

### `apps/`

- **account/**
  - **기능:** 사용자 인증 및 사용자 정보 관리
  - **설명:** 계정 생성, 로그인, 사용자 정보 조회
- **admin/**
  - **기능:** 관리자 페이지 API
  - **설명:** 관리자 페이지 API
- **contents/**
  - **기능:** 컨텐츠 관리
  - **설명:** 친구, 마이룸, 오피스 회의, 우편함, 투표 등의 각종 컨텐츠 제공 서버
- **gateway/**
  - **기능:** 버전 및 서버 상태 체크
  - **설명:** 애플리케이션 실행 시 버전 일치 여부 및 서버 상태를 확인하여 접속할 서버 URL과 상태 정보를 제공하는 서버
- **pass-auth/**
  - **기능:** pass 인증
  - **설명:** pass 앱으로 본인 인증을 하는 서버
- **payments/**
  - **기능:** 결제 관리
  - **설명:** 토스페이먼츠 결제 서버
- **sockets/**
  - **기능:** 웹소켓
  - **설명:** 사용자 오브젝트 동기화, 채팅 기능을 하는 웹소켓 서버
- **webview/**
  - **기능:** 웹뷰
  - **설명:** 유니티 클라이언트 내에서 노출 되는 웹뷰 API 


### `libs/`
- **common/**
  - **기능:** 공용 프로젝트
  - **설명:** 각 서버에서 공용으로 사용 되는 함수 프로젝트
- **constants/**
  - **기능:** 상수 프로젝트
  - **설명:** 각 서버에서 공용으로 사용 되는 상수 모음 프로젝트
- **entity/**
  - **기능:** 데이터베이스 entity
  - **설명:** mysql, typeorm으로 작성된 entity 프로젝트
- **mongodb/**
  - **기능:** mongodb
  - **설명:** mongoose로 작성된 mongodb schema 프로젝트
- **redis/**
  - **기능:** redis
  - **설명:** redis 공용 함수 프로젝트


## 설치 및 실행

### 설치

프로젝트를 클론한 후 의존성을 설치합니다.

```bash
git clone https://github.com/username/my-nestjs-monorepo.git
cd my-nestjs-monorepo
yarn install
```
