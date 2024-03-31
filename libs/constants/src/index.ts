export const ERRORCODE = Object.freeze({
  NET_E_SUCCESS: 200, // 성공
  NET_E_NOT_LOGINED: 202, //로그인 되지 않음
  NET_E_EMPTY_TOKEN: 204, // 토큰이 비어있음
  NET_E_EXPIRED_TOKEN: 206, // 토큰 만료
  NET_E_INVALID_TOKEN: 208, // 유효하지 않은 토큰

  NET_E_IS_DORMANT_ACCOUNT: 240, // 휴면 계정 입니다
  NET_E_DUPLICATE_LOGIN: 242, // 중복 로그인
  NET_E_ALREADY_DELETE_USER_ID: 244, // 계정 탈퇴한 사용자 아이디
  NET_E_ALREADY_EXIST_EMAIL: 246, // 이미 존재하는 이메일
  NET_E_ALREADY_EXIST_NICKNAME: 248, // 이미 존재하는 닉네임
  NET_E_ALREADY_MY_NICKNAME: 249, // 이미 나의 닉네임
  NET_E_NOT_MATCH_PASSWORD: 250, // 패스워드 불일치
  NET_E_NOT_EXIST_USER: 252, // 존재하지 않는 사용자
  NET_E_NOT_MATCH_EMAIL_AUTH_CODE: 254, // 존재하지 않는 이메일 인증 코드
  NET_E_NOT_EXIST_EMAIL: 256, // 존재하지 않는 이메일
  NET_E_NOT_AUTH_EMAIL: 258, // 인증 되지 않은 이메일
  NET_E_ALREADY_EXIST_EMAIL_FOR_ARZMETA_LOGIN: 260, //이미 자체 로그인 가입 된 이메일 계정 사용자
  NET_E_EMPTY_PASSWORD: 262, // 패스워드가 없음.
  NET_E_CANNOT_UPDATED_EMAIL: 264, // 이메일 업데이트 불가 (1달에 1번)
  NET_E_SAME_PREVIOUS_EMAIL: 266, // 이메일이 변경 되지 않았음 (기존 이메일과 같다)
  NET_E_SOCIAL_LOGIN_USER: 268, // 소셜 로그인 사용자 입니다.
  NET_E_INVALID_EMAIL: 270, // 유효하지 않은 이메일 입니다.
  NET_E_OVER_COUNT_EMAIL_AUTH: 272, // 이메일 인증 횟수를 초과 하였습니다.
  NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT: 274, // 이미 해당 유형이 연동된 계정 입니다.
  NET_E_CANNOT_RELEASE_LINKED_ACCOUNT: 276, // 계정 연동 해제 불가.
  NET_E_MAX_OVER_BUSINESS_CARD: 278, // 비지니스 명함 갯수 초과
  NET_E_ERROR_BUSINESS_CARD_ID: 280, // 비지니스 명함 아이디 에러
  NET_E_ALREADY_ACCOUNT: 282, // 이미 존재하는 계정
  NET_E_ALREADY_LINKED_OTHER_ACCOUNT: 284, // 이미 다른계정에 연동되어 있습니다.
  NET_E_NOT_EXIST_BUSINESS_CARD: 286, // 존재하지 않는 비지니스 명함
  NET_E_IS_WITHDRAWAL_MEMBER: 288, // 탈퇴가 진행 중인 사용자 입니다.

  NET_E_ALREADY_FRIEND: 302, // 이미 친구 입니다.
  NET_E_ALREADY_RECEIVED_FRIEND_REQUEST: 304, // 이미 친구 요청을 받았습니다.
  NET_E_ALREADY_SEND_FRIEND_REQUEST: 306, // 이미 친구 요청을 보냈습니다.
  NET_E_NOT_EXIST_RECEIVED_REQUEST: 308, // 받은 요청이 없습니다.
  NET_E_NOT_EXIST_REQUEST: 310, // 보낸 요청이 없습니다.
  NET_E_MEMBER_IS_BLOCK: 312, // 차단 된 사용자 입니다.
  NET_E_MY_FRIEND_MAX_COUNT: 314, // 나의 친구 수 초과
  NET_E_TARGET_FRIEND_MAX_COUNT: 316, // 상대의 친구 수 초과
  NET_E_CANNOT_BLOCK_MYSELF: 318, // 자기 자신은 차단 할 수 없음.
  NET_E_CANNOT_REQUEST_MYSELF: 320, // 자기 자신은 친구 요청을 보낼 수 없음.

  NET_E_NOT_HAVE_ITEM: 340, // 소유하지 않은 아이템
  NET_E_ITEM_OVER_COUNT: 342, // 아이템 갯수 초과
  NET_E_NOT_MATCH_ITEM: 344, // 아이템이 일치 하지 않습니다.
  NET_E_ITEM_NOT_REMOVABLE: 346, // 아이템을 배치 해제 할 수 없다.

  NET_E_NOT_SET_RESERVATION_TIME: 350, // 예약 시간 설정이 되지 않았습니다.
  NET_E_DUPLICATE_RESERVATION_TIME: 352, // 예약 시간 설정이 중복 되었습니다.
  NET_E_WRONG_RESERVATION_TIME: 354, // 예약 시간 설정이 잘못 되었습니다.
  NET_E_OFFICE_GRADE_AUTHORITY: 356, // 오피스 권한이 잘못되었습니다.
  NET_E_OVER_CREATE_OFFICE_RESERVATION_COUNT: 358, // 더 이상 룸을 예약 할 수 없습니다.
  NET_E_ERROR_SELECT_OFFICE_ROOM_INFO: 360, // 오피스 룸 선택 오류
  NET_E_OVER_MAX_PERSONNEL: 362, // 최대 인원 초과
  NET_E_OVER_RUNNING_TIME: 364, // 진행 시간 초과
  NET_E_CANNOT_SET_THUMBNAIL: 366, // 썸네일 설정 불가
  NET_E_CANNOT_SET_ADVERTISING: 368, // 홍보노출 설정 불가
  NET_E_CANNOT_SET_WAITING_ROOM: 370, // 대기실 설정 불가
  NET_E_NOT_EXIST_OFFICE: 372, // 존재 하지 않는 오피스
  NET_E_NOT_EXIST_WAITING: 374, // 존재 하지 않는 대기실
  NET_E_OFFICE_CREATE_ME: 376, // 내가 만든 오피스
  NET_E_CANNOT_OFFICE_SET_OBSERVER: 378, // 관전 인원 설정 불가
  NET_E_OVER_MAX_OFFICE_SET_OBSERVER: 380, // 관전 인원 설정 초과
  NET_E_OFFICE_ALREADY_WAITING_USER: 386, // 이미 대기중인 사용자 입니다.

  NET_E_ALREADY_EXIST_MYROOM_ITEM: 390, // 마이룸에 있는 아이템
  NET_E_NOT_EXIST_MYROOM_ITEM: 392, // 마이룸에 없는 아이템
  NET_E_NOT_EXIST_FURNITURE_INVEN_ITEM: 394, // 가구 인벤에 없는 아이템
  NET_E_CANNOT_DELETE_ITEM: 396, // 삭제 불가능 아이템

  NET_E_NOT_EXIST_NOTICE: 402, // 존재 하진 않는 공지사항 입니다.
  NET_E_BAD_PASSWORD: 404, // 잘못된 패스워드 형식 입니다.
  NET_E_CANNOT_VOTE: 426, // 투표 불가.
  NET_E_TOO_MANY_RESPONSE: 428, // 투표 응답 갯수가 너무 많습니다.
  NET_E_ALREADY_VOTE: 430, // 이미 투표를 했습니다.
  NET_E_WRONG_RESPONSE: 432, // 잘못된 응답입니다.
  NET_E_NOT_EXIST_VOTE: 434, // 존재하지 않는 투표입니다.
  NET_E_NOT_EXIST_PROGRESS_VOTE: 436, // 진행 중인 투표가 없습니다.

  NET_E_CANNOT_RECEIVED_POST: 450, // 우편을 수령할 수 없습니다.
  NET_E_NOT_EXIST_POST: 452, // 존재하지 않는 우편입니다..

  NET_E_NOT_EXIST_IMAGE_URL: 470, // 이미지 URL 이 없습니다.
  NET_E_NOT_EXIST_IMAGE_FILE: 472, // 이미지 파일이 없습니다.
  NET_E_IVALID_IMAGE: 474, // 부적절한 이미지 입니다.

  NET_E_ALREADY_LINKED_SAME_WALLET_ADDR: 480, // 이미 연동된 지갑 주속와 같은 지갑 주소 입니다.
  NET_E_ALREADY_EXISTS_LINKED_WALLET_ADDR: 482, // 나의 계정에 이미 지갑이 연동 되어 있는 경우.
  NET_E_ALREADY_EXISTS_LINKED_ACCOUNT: 484, // 지갑 주소가 이미 다른 계정과 연동되어 있는 경우
  NET_E_NOT_EXISTS_LINKED_WALLET_ADDR: 486, // 연동된 지갑 주소가 없음.

  NET_E_NOT_EXISTS_BOOTH: 490, // 존재 하지 않는 부스 입니다.
  NET_E_NOT_EXISTS_EVENT: 491, // 존재 하지 않는 이벤트 입니다.
  NET_E_HAVE_NOT_LICENSE_MEMBER: 492, // 라이선스를 보유지 않은 회원 입니다.
  NET_E_NOT_EXIST_FILE: 494, // 파일이 없습니다.
  NET_E_NOT_EXIST_EVENT: 496, // 진행중인 행사가 없습니다.
  NET_E_UNAUTHORIZE_ADMIN: 498, // 권한이 없습니다.

  NET_E_DB_FAILED: 600, // DB 실패
  NET_E_BAD_REQUEST: 601, // 잘못된 요청입니다.
  NET_E_SERVER_INACTIVATE: 700, // 서버 비활성
  NET_E_NEED_UPDATE: 710, // 업데이트 필요
});

export const ERROR_MESSAGE = (error: number) => {
  switch (error) {
    case ERRORCODE.NET_E_SUCCESS:
      return 'NET_E_SUCCESS';
    case ERRORCODE.NET_E_NOT_LOGINED:
      return 'NET_E_SUCCESS';
    case ERRORCODE.NET_E_EMPTY_TOKEN:
      return 'NET_E_EMPTY_TOKEN';
    case ERRORCODE.NET_E_EXPIRED_TOKEN:
      return 'NET_E_EXPIRED_TOKEN';
    case ERRORCODE.NET_E_INVALID_TOKEN:
      return 'NET_E_INVALID_TOKEN';
    case ERRORCODE.NET_E_DUPLICATE_LOGIN:
      return 'NET_E_DUPLICATE_LOGIN';
    case ERRORCODE.NET_E_ALREADY_DELETE_USER_ID:
      return 'NET_E_ALREADY_DELETE_USER_ID';
    case ERRORCODE.NET_E_ALREADY_EXIST_EMAIL:
      return 'NET_E_ALREADY_EXIST_EMAIL';
    case ERRORCODE.NET_E_ALREADY_EXIST_NICKNAME:
      return 'NET_E_ALREADY_EXIST_NICKNAME';
    case ERRORCODE.NET_E_ALREADY_MY_NICKNAME:
      return 'NET_E_ALREADY_MY_NICKNAME';
    case ERRORCODE.NET_E_NOT_MATCH_PASSWORD:
      return 'NET_E_NOT_MATCH_PASSWORD';
    case ERRORCODE.NET_E_NOT_EXIST_USER:
      return 'NET_E_NOT_EXIST_USER';
    case ERRORCODE.NET_E_IS_WITHDRAWAL_MEMBER:
      return 'NET_E_IS_WITHDRAWAL_MEMBER';
    case ERRORCODE.NET_E_NOT_MATCH_EMAIL_AUTH_CODE:
      return 'NET_E_NOT_MATCH_EMAIL_AUTH_CODE';
    case ERRORCODE.NET_E_NOT_EXIST_EMAIL:
      return 'NET_E_NOT_EXIST_EMAIL';
    case ERRORCODE.NET_E_SAME_PREVIOUS_EMAIL:
      return 'NET_E_SAME_PREVIOUS_EMAIL_';
    case ERRORCODE.NET_E_NOT_AUTH_EMAIL:
      return 'NET_E_NOT_AUTH_EMAIL';
    case ERRORCODE.NET_E_ALREADY_EXIST_EMAIL_FOR_ARZMETA_LOGIN:
      return 'NET_E_ALREADY_EXIST_EMAIL_FOR_ARZMETA_LOGIN';
    case ERRORCODE.NET_E_EMPTY_PASSWORD:
      return 'NET_E_EMPTY_PASSWORD';
    case ERRORCODE.NET_E_SOCIAL_LOGIN_USER:
      return 'NET_E_SOCIAL_LOGIN_USER';
    case ERRORCODE.NET_E_BAD_PASSWORD:
      return 'NET_E_BAD_PASSWORD';
    case ERRORCODE.NET_E_CANNOT_UPDATED_EMAIL:
      return 'NET_E_CANNOT_UPDATED_EMAIL';
    case ERRORCODE.NET_E_CANNOT_VOTE:
      return 'NET_E_CANNOT_VOTE';
    case ERRORCODE.NET_E_ALREADY_VOTE:
      return 'NET_E_ALREADY_VOTE';
    case ERRORCODE.NET_E_TOO_MANY_RESPONSE:
      return 'NET_E_TOO_MANY_RESPONSE';
    case ERRORCODE.NET_E_WRONG_RESPONSE:
      return 'NET_E_WRONG_RESPONSE';
    case ERRORCODE.NET_E_NOT_EXIST_VOTE:
      return 'NET_E_NOT_EXIST_VOTE';
    case ERRORCODE.NET_E_NOT_EXIST_PROGRESS_VOTE:
      return 'NET_E_NOT_EXIST_PROGRESS_VOTE';
    case ERRORCODE.NET_E_ALREADY_RECEIVED_FRIEND_REQUEST:
      return 'NET_E_ALREADY_RECEIVED_FRIEND_REQUEST';
    case ERRORCODE.NET_E_ALREADY_SEND_FRIEND_REQUEST:
      return 'NET_E_ALREADY_SEND_FRIEND_REQUEST';
    case ERRORCODE.NET_E_NOT_EXIST_RECEIVED_REQUEST:
      return 'NET_E_NOT_EXIST_RECEIVED_REQUEST';
    case ERRORCODE.NET_E_ALREADY_FRIEND:
      return 'NET_E_ALREADY_FRIEND';
    case ERRORCODE.NET_E_MY_FRIEND_MAX_COUNT:
      return 'NET_E_MY_FRIEND_MAX_COUNT';
    case ERRORCODE.NET_E_TARGET_FRIEND_MAX_COUNT:
      return 'NET_E_TARGET_FRIEND_MAX_COUNT';
    case ERRORCODE.NET_E_MEMBER_IS_BLOCK:
      return 'NET_E_MEMBER_IS_BLOCK';
    case ERRORCODE.NET_E_INVALID_EMAIL:
      return 'NET_E_INVALID_EMAIL';
    case ERRORCODE.NET_E_OVER_COUNT_EMAIL_AUTH:
      return 'NET_E_OVER_COUNT_EMAIL_AUTH';
    case ERRORCODE.NET_E_ALREADY_LINKED_OTHER_ACCOUNT:
      return 'NET_E_ALREADY_LINKED_OTHER_ACCOUNT';
    case ERRORCODE.NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT:
      return 'NET_E_ALREADY_PROVIDER_TYPELINKED_ACCOUNT';
    case ERRORCODE.NET_E_CANNOT_RELEASE_LINKED_ACCOUNT:
      return 'NET_E_CANNOT_RELEASE_LINKED_ACCOUNT';
    case ERRORCODE.NET_E_DB_FAILED:
      return 'NET_E_DB_FAILED';
    case ERRORCODE.NET_E_NOT_HAVE_ITEM:
      return 'NET_E_NOT_HAVE_ITEM';
    case ERRORCODE.NET_E_ITEM_OVER_COUNT:
      return 'NET_E_ITEM_OVER_COUNT';
    case ERRORCODE.NET_E_NOT_MATCH_ITEM:
      return 'NET_E_NOT_MATCH_ITEM';
    case ERRORCODE.NET_E_ITEM_NOT_REMOVABLE:
      return 'NET_E_ITEM_NOT_REMOVABLE';
    case ERRORCODE.NET_E_NOT_SET_RESERVATION_TIME:
      return 'NET_E_NOT_SET_RESERVATION_TIME';
    case ERRORCODE.NET_E_DUPLICATE_RESERVATION_TIME:
      return 'NET_E_DUPLICATE_RESERVATION_TIME';
    case ERRORCODE.NET_E_WRONG_RESERVATION_TIME:
      return 'NET_E_WRONG_RESERVATION_TIME';
    case ERRORCODE.NET_E_NOT_EXIST_REQUEST:
      return 'NET_E_NOT_EXIST_REQUEST';
    case ERRORCODE.NET_E_CANNOT_BLOCK_MYSELF:
      return 'NET_E_CANNOT_BLOCK_MYSELF';
    case ERRORCODE.NET_E_CANNOT_REQUEST_MYSELF:
      return 'NET_E_CANNOT_REQUEST_MYSELF';
    case ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY:
      return 'NET_E_OFFICE_GRADE_AUTHORITY';
    case ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL:
      return 'NET_E_NOT_EXIST_IMAGE_URL';
    case ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE:
      return 'NET_E_NOT_EXIST_IMAGE_FILE';
    case ERRORCODE.NET_E_IVALID_IMAGE:
      return 'NET_E_IVALID_IMAGE';
    case ERRORCODE.NET_E_OVER_CREATE_OFFICE_RESERVATION_COUNT:
      return 'NET_E_OVER_CREATE_OFFICE_RESERVATION_COUNT';
    case ERRORCODE.NET_E_ALREADY_EXIST_MYROOM_ITEM:
      return 'NET_E_ALREADY_EXIST_MYROOM_ITEM';
    case ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM:
      return 'NET_E_NOT_EXIST_MYROOM_ITEM';
    case ERRORCODE.NET_E_NOT_EXIST_FURNITURE_INVEN_ITEM:
      return 'NET_E_NOT_EXIST_FURNITURE_INVEN_ITEM';
    case ERRORCODE.NET_E_CANNOT_DELETE_ITEM:
      return 'NET_E_CANNOT_DELETE_ITEM';
    case ERRORCODE.NET_E_ERROR_SELECT_OFFICE_ROOM_INFO:
      return 'NET_E_ERROR_SELECT_OFFICE_ROOM_INFO';

    case ERRORCODE.NET_E_OVER_MAX_PERSONNEL:
      return 'NET_E_OVER_MAX_PERSONNEL';

    case ERRORCODE.NET_E_OVER_RUNNING_TIME:
      return 'NET_E_OVER_RUNNING_TIME';

    case ERRORCODE.NET_E_CANNOT_SET_THUMBNAIL:
      return 'NET_E_CANNOT_SET_THUMBNAIL';

    case ERRORCODE.NET_E_CANNOT_SET_ADVERTISING:
      return 'NET_E_CANNOT_SET_ADVERTISING';

    case ERRORCODE.NET_E_CANNOT_SET_WAITING_ROOM:
      return 'NET_E_CANNOT_SET_WAITING_ROOM';

    case ERRORCODE.NET_E_NOT_EXIST_OFFICE:
      return 'NET_E_NOT_EXIST_OFFICE';

    case ERRORCODE.NET_E_NOT_EXIST_WAITING:
      return 'NET_E_NOT_EXIST_WAITING';

    case ERRORCODE.NET_E_OFFICE_CREATE_ME:
      return 'NET_E_OFFICE_CREATE_ME';

    case ERRORCODE.NET_E_OVER_MAX_OFFICE_SET_OBSERVER:
      return 'NET_E_OVER_MAX_OFFICE_SET_OBSERVER';
    case ERRORCODE.NET_E_CANNOT_OFFICE_SET_OBSERVER:
      return 'NET_E_CANNOT_OFFICE_SET_OBSERVER';
    case ERRORCODE.NET_E_MAX_OVER_BUSINESS_CARD:
      return 'NET_E_MAX_OVER_BUSINESS_CARD';
    case ERRORCODE.NET_E_NOT_EXIST_BUSINESS_CARD:
      return 'NET_E_NOT_EXIST_BUSINESS_CARD';
    case ERRORCODE.NET_E_ERROR_BUSINESS_CARD_ID:
      return 'NET_E_ERROR_BUSINESS_CARD_ID';
    case ERRORCODE.NET_E_ALREADY_ACCOUNT:
      return 'NET_E_ALREADY_ACCOUNT';
    case ERRORCODE.NET_E_CANNOT_RECEIVED_POST:
      return 'NET_E_CANNOT_RECEIVED_POST';
    case ERRORCODE.NET_E_NOT_EXIST_POST:
      return 'NET_E_NOT_EXIST_POST';
    case ERRORCODE.NET_E_ALREADY_LINKED_SAME_WALLET_ADDR:
      return 'NET_E_ALREADY_LINKED_SAME_WALLET_ADDR';
    case ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_WALLET_ADDR:
      return 'NET_E_ALREADY_EXISTS_LINKED_WALLET_ADDR';
    case ERRORCODE.NET_E_ALREADY_EXISTS_LINKED_ACCOUNT:
      return 'NET_E_ALREADY_EXISTS_LINKED_ACCOUNT';
    case ERRORCODE.NET_E_NOT_EXISTS_LINKED_WALLET_ADDR:
      return 'NET_E_NOT_EXISTS_LINKED_WALLET_ADDR';
    case ERRORCODE.NET_E_NOT_EXISTS_BOOTH:
      return 'NET_E_NOT_EXISTS_BOOTH'; // 존재 하지 않는 부스 입니다.
    case ERRORCODE.NET_E_NOT_EXISTS_EVENT:
      return 'NET_E_NOT_EXISTS_EVENT'; // 존재 하지 않는 부스 입니다.
    case ERRORCODE.NET_E_HAVE_NOT_LICENSE_MEMBER:
      return 'NET_E_HAVE_NOT_LICENSE_MEMBER'; // 라이선스를 보유지 않은 회원 입니다.
    case ERRORCODE.NET_E_NOT_EXIST_FILE:
      return 'NET_E_NOT_EXIST_FILE'; // 파일이 없습니다.
    case ERRORCODE.NET_E_NOT_EXIST_EVENT:
      return 'NET_E_NOT_EXIST_EVENT'; // 진행중인 행사가 없습니다.
    case ERRORCODE.NET_E_UNAUTHORIZE_ADMIN:
      return 'NET_E_UNAUTHORIZE_ADMIN'; // 권한이 없습니다.
    case ERRORCODE.NET_E_BAD_REQUEST:
      return 'NET_E_BAD_REQUEST'; // 권한이 없습니다.
    default:
      return '';
  }
};

export const OFFICE_GRADE_TYPE = Object.freeze({
  BASIC: 1,
  PRO: 2,
});

export const LICENSE_TYPE = Object.freeze({
  BASIC: 1,
  PRO: 2,
});

export const LICENSE_FUNCSTION = Object.freeze({
  OFFICE: 1,
  FREE_MONEY: 2,
  CHARGED_MONEY: 3,
  COSTUME: 4,
});

export const PROVIDER_TYPE = Object.freeze({
  ARZMETA: 1,
  NAVER: 2,
  GOOGLE: 3,
  APPLE: 4,
  KAKAO: 5,
});

export const LOG_ACTION_TYPE = Object.freeze({
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
});

export const LOG_CONTENT_TYPE = Object.freeze({
  OFFICE_GRADE_TYPE: 1,
});

export const POSTAL_LOG_TYPE = Object.freeze({
  SUBJECT: 1,
  SUMMARY: 2,
  CONTENT: 3,
  POSTAL_TYPE: 4,
  POSTAL_STATE: 5,
  CREATED_AT: 6,
  SENDED_AT: 7,
  ORDER_NUM: 8,
  APPEND_TYPE: 9,
  ITEM: 10,
  COUNT: 11,
  RECEIVER: 12,
});

export const FRAME_IMAGE_APPEND_TYPE = Object.freeze({
  LOCAL_IMAGE: 1,
  IMAGE_URL: 2,
});

export const UPLOAD_TYPE = Object.freeze({
  LOCAL_IMAGE: 1,
  IMAGE_URL: 2,
});

export const MONEY_TYPE = Object.freeze({
  JURI: 1,
  HALF_FREE: 2,
  PAID: 3,
  EVENT: 4,
  CASH: 5,
  NOT_FOR_SALE: 6,
});

export const SERVER_TYPE = Object.freeze({
  DEV_SERVER: 1,
  STAGING_SERVER: 2,
  LIVE_SERVER: 3,
});

export const POSTAL_SEND_TYPE = Object.freeze({
  ALL_SEND: 1,
  EACH_SEND: 2,
  COND_SEND: 3,
});

export const SERVER_STATE = Object.freeze({
  ACTIVATE: 1,
  INACTIVATE: 2,
  TEST: 3,
  NEED_UPDATE: 4,
});

export const ADMIN_PAGE = Object.freeze({
  LIST_PAGE_COUNT: 10,
});

export const FRIEND = Object.freeze({
  REQUEST_LIMIT_COUNT: 2,
});

export const ROLE_TYPE = Object.freeze({
  SYSTEM_ADMIN: 0,
  SUPER_ADMIN: 1,
  MIDDLE_ADMIN: 2,
  DEV_ADMIN: 3,
  NORMAL_ADMIN: 4,
  UNAUTHORIZED: 5,
});

export const ADMIN_TYPE = Object.freeze({
  ARZMETA_ADMIN: 0,
  CSAF_ADMIN: 1,
});

export const VOTE_DIV_TYPE = Object.freeze({
  ALTERNATIVE: 1,
  CHOICE: 2,
});

export const VOTE_ALTER_RES_TYPE = Object.freeze({
  O_X: 1,
  YES_NO: 2,
});

export const VOTE_RES_TYPE = Object.freeze({
  SINGLE: 1,
  MULTIPLE: 2,
});

export const VOTE_RESULT_TYPE = Object.freeze({
  ALWAYS: 1,
  VOTE_USER: 2,
  NONE: 3,
});

export const VOTE_RESULT_EXPOSURE_TYPE = Object.freeze({
  RATE: 1,
  COUNT: 2,
  MUTIPLE: 3,
});

export const VOTE_STATE_TYPE = Object.freeze({
  SCHEDULED: 1,
  PROGRESS: 2,
  COMPLETED: 3,
  END: 4,
});

export const SELECT_VOTE_STATE_TYPE = Object.freeze({
  SCHEDULED: 1,
  PROGRESS_RESULT: 2,
  PROGRESS_NOT_RESULT: 3,
  COMPLETED_NOT_RESULT: 4,
  COMPLETED_RESULT: 5,
  END: 6,
});

export const APPEND_TYPE = Object.freeze({
  ITEM: 1,
  MONEY: 2,
  PACKAGE: 3,
});

export const AVATAR_PARTS_TYPE = Object.freeze({
  HAIR: 1,
  TOP: 2,
  BOTTOM: 3,
  BODY: 4,
  SHOES: 5,
  EYES: 6,
  FACE: 7,
  MOUTH: 8,
  EAR: 9,
  HAND: 10,
  BACK: 11,
  ALL: 12,
  FULL_SET: 13,
});

export const OFFICE_MODE_TYPE = Object.freeze({
  MEETING: 1,
  LECTURE: 2,
  CONFERENCE: 3,
  CONSULTING: 4,
  EXHIBITION: 5,
});

export const OFFICE_TOPIC_TYPE = Object.freeze({
  MEETING: 1,
  LECTURE: 2,
  EVENT: 3,
  CONSULTING: 4,
  ETC: 5,
});

export const SEARCH_TYPE = Object.freeze({
  ALL: 'ALL',
  NAME: 'NAME',
  NICKNAME: 'NICKNAME',
  PHONENUMBER: 'PHONENUMBER',
  PROVIDER_TYPE: 'PROVIDER_TYPE',
  EMAIL: 'EMAIL',
  ACCOUNT_TOKEN: 'ACCOUNT_TOKEN',
  COUNTRY_CODE: 'COUNTRY_CODE',
  CREATED_AT: 'CREATED_AT',
  STATE_TYPE: 'STATE_TYPE',
  ROLE_TYPE: 'ROLE_TYPE',
  DEPARTMENT_TYPE: 'DEPARTMENT_TYPE',
  LOGINED_AT: 'LOGINED_AT',
  SUBJECT: 'SUBJECT',
  STARTED_AT: 'STARTED_AT',
  ENDED_AT: 'ENDED_AT',
  CONTENT: 'CONTENT',
  NEWS_TYPE: 'NEWS_TYPE',
  STATE_NAME: 'STATE_NAME',
  CONTENT_TYPE: 'CONTENT_TYPE',
  ACTION_TYPE: 'ACTION_TYPE',
  OS_TYPE: 'OS_TYPE',
  DIV_TYPE: 'DIV_TYPE',
  RES_TYPE: 'RES_TYPE',
  ALTER_RES_TYPE: 'ALTER_RES_TYPE',
  RESULT_TYPE: 'RESULT_TYPE',
  MEMBER_CODE: 'MEMBER_CODE',
  OFFICE_GRADE_TYPE: 'OFFICE_GRADE_TYPE',
  TOTAL: 'TOTAL',
  INQUIRY_TYPE: 'INQUIRY_TYPE', // 문의 타입
  REPORT_TYPE: 'REPORT_TYPE', // 신고 유형
  REASON_TYPE: 'REASON_TYPE', // 신고 상세 사유
  AFFILIATION: 'AFFILIATION', // 소속
  OFFICE_DOMAIN_NAME: 'OFFICE_DOMAIN_NAME', // 오피스 도메인
  OFFICE_LICENSE_NAME: 'OFFICE_LICENSE_NAME', // 오피스 라이선스 이름
  REG_PATH_TYPE: 'REG_PATH_TYPE', // 최초 가입 경로
  SENDED_AT: 'SENDED_AT', // 발송 일시
  POSTAL_TYPE: 'POSTAL_TYPE', // 우편 타입
  LOG_ACTION_TYPE: 'LOG_ACTION_TYPE', // 로그 액션 타입
  POSTAL_LOG_TYPE: 'POSTAL_LOG_TYPE', // 우편 로그 타입
  POSTAL_SEND_TYPE: 'POSTAL_SEND_TYPE', // 발송 타입
  POSTBOX_ID: 'POSTBOX_ID', // 우편 아이디
  RECEIVED_AT: 'RECEIVED_AT', // 우편 수령 일시
  POSTAL_STATE: 'POSTAL_STATE', // 우편 발송 상태
  SUMMARY: 'SUMMARY',
  ORDER_NUM: 'ORDER_NUM',
  APPEND_TYPE: 'APPEND_TYPE',
  ITEM: 'ITEM',
  COUNT: 'COUNT',
  RECEIVER: 'RECEIVER',
  PERIOD: 'PERIOD',
  VOTE_ITEM_NUM: 'VOTE_ITEM_NUM',
  APP_VERSION: 'APP_VERSION',
  BANNER: 'BANNER',
  SCREEN: 'SCREEN',
  EVENT_NAME: 'EVENT_NAME',
  ADMIN_TYPE: 'ADMIN_TYPE',
  CATEGORY_TYPE: 'CATEGORY_TYPE',
});

export const ITEM_TYPE = Object.freeze({
  GENERAL: 1,
  INTERIOR: 2,
  COSTUME: 3,
  NFT_COSTUME: 4,
});

export const FRND_REQUEST_TYPE = Object.freeze({
  NICKNAME: 1,
  MEMBER_CODE: 2,
});

export const BUSINISS_CARD_TYPE = Object.freeze({
  ARZMETA: 1,
  BUSINESS_1: 2,
});

export const INQUIRY_TYPE = Object.freeze({
  SERVICE_USE: 1,
  ACCOUNT: 2,
  PURCHASE: 3,
  PARTNERSHIP: 4,
  SUGGESTIONS: 5,
  ETC: 6,
});

export const INQUIRY_ANSWER_TYPE = Object.freeze({
  WAITING: 1,
  COMPLETE: 2,
  HOLD: 3,
  RESERV: 4,
});

export const REPORT_STATE_TYPE = Object.freeze({
  RECEIPT: 1,
  CONFIRM_COMPLETE: 2,
  REQUEST_RESTRICTION: 3,
  RESTRICTION_COMPLETE: 4,
});

export const ALL_LICENSE_STATE_TYPE = Object.freeze({
  NOT_REGISTERED: 1,
  IS_USING: 2,
  EXPIRED: 3,
  IS_USE_COMPLETED: 4,
});

export const EVENT_STATE_TYPE = Object.freeze({
  PREVIOUS: 1,
  PROGRESS: 2,
  COMPLETE: 3,
});

export const AFFILIATION_LICENSE_STATE_TYPE = Object.freeze({
  IS_USING: 1,
  EXPIRED: 2,
  WAITING_USE: 3,
});

export const BOOLEAN = Object.freeze({
  TRUE: 1,
  FALSE: 0,
});

export const OS_TYPE = Object.freeze({
  AOS: 1,
  IOS: 2,
  UNITY_EDITOR: 3,
});

export const REG_PATH_TYPE = Object.freeze({
  AOS: 1,
  IOS: 2,
  WEB: 3,
  ETC: 4,
});

export const POSTAL_STATE = Object.freeze({
  SCHEDULED: 1,
  COMPLETE: 2,
  PENDDING: 3,
});

export const POSTAL_TYPE = Object.freeze({
  NOTICE: 1,
  EVENT: 2,
  REWARD: 3,
  PURCHASE: 4,
});

export const stringState = (str: any) => {
  if (str === undefined || str === 'undefined' || str === null || str === '') {
    return false;
  }

  return true;
};

export const FUNCTION_TABLE = Object.freeze({
  REQUEST_FRIEND_COUNT: 1001,
  RECEIVE_FRIEND_COUNT: 1002,
  MAX_FRIEND_COUNT: 1003,
  BUSINISS_CARD_DEFAULT_COUNT: 2011,
  BUSINISS_CARD_MAX_COUNT: 2012,
  OFFICE_ROOM_BEFORE_ENTER_ENABLE_TIME: 2021,
  NORMAL_INVENTORY_MAX_SLOT_COUNT: 3011,
  INTERIOR_INVENTORY_MAX_SLOT_COUNT: 3012,
  COSTUME_INVENTORY_MAX_COUNT: 3013,
  MAX_EMAIL_AUTH: 4001,
  VOTE_ITEM_MIN_COUNT: 5001,
  VOTE_ITEM_MAX_COUNT: 5002,
  VOTE_MIN_COUNT: 5003,
  VOTE_MAX_COUNT: 5004,
  SCREEN_ROLLING_MAX_COUNT: 6001,
  BANNER_ROLLING_MAX_COUNT: 6002,
});

export const SCREEN_CONTENT_TYPE = Object.freeze({
  STORAGE: 1,
  YOUTUBU_NORMAL: 2,
  YOUTUBU_LIVE: 3,
});

export const NOTICE_EXPOSURE_TYPE = Object.freeze({
  ONE_DAY: 1,
  SELECT: 2,
  ALWAYS: 3,
});

export const NOTICE_TYPE = Object.freeze({
  ENTER_NOTICE_EVENT: 1,
  NOTICE: 2,
  EVENT: 3,
});

export const MEDIA_ROLLING_TYPE = Object.freeze({
  SINGLE: 1,
  MULTI: 2,
});

export const MEDIA_EXPOSURE_TYPE = Object.freeze({
  ALL: 1,
  EVENT: 2,
});

export const randomString = (num: number) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
  const stringLength = num;
  let randomstring = '';
  for (let i = 0; i < stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};

// Socket

export const RedisKey = {
  getStrRoomId: (roomId: string): string => `room:${roomId}`,
  getStrRooms: (): string => `rooms`,
  getRoomsByType: (type): string => `roomType:${type}`,
  getStrRoomPlayerList: (roomId: string): string => `${roomId}:playerlist`,
  getStrMemberCurrentRoom: (memberId: string): string =>
    `member:${memberId}:currentRoom`,
  getStrMemberLockSocket: (memberId: string): string =>
    `lock:socket:${memberId}`,
  getStrMemberSocket: (memberId: string): string => `socket:${memberId}`,
  getStrRedisLockKey: (gateway: string): string =>
    `lock:gateway:init:${gateway}`,
  getStrObjectRedisLockKey: (data: string): string => `lock:object:${data}`,
  getStrOfficeReservRoomCode: (roomCode: string): string =>
    `officeReservation:${roomCode}`,
  getStrOfficeReservKey: (): string => `officeReservationRoomCode`,
  getStrRoomIdCounter: (): string => `roomIdCounter`,
  getStrObjectIdCounter: (): string => `objectIdCounter`,
  getStrMyRoom: (roomId): string => `myroom:${roomId}`,
  getStrGameObject: (roomId): string => `gameObject:${roomId}`,
};

export const SOCKET_SERVER_ERROR_CODE_GLOBAL = Object.freeze({
  C_RECONNECT_ERROR: 100000, //클라이언트 재연결 시도 후에도 연결이 안될때

  DIRECT_MESSAGE_USER_NOT_FOUND: 2100, // 귓속말(월드 1:1 ) 대상이 존재하지 않을 경우
  DIRECT_MESSAGE_USER_NOT_CONNECTED: 2101, // 귓속말(월드 1:1 ) 대상이 현재 오프라인 상태일 경우
  DIRECT_MESSAGE_SEND_ME: 2102, // 귓속말(월드 1:1 ) 대상이 자기 자신일 경우

  ROOM_ALREADY_CONNECTED: 31000, // 방 입장시, 이미 접속중인 방 일때
  NOT_IN_ROOM: 31002, // 룸에 입장 하지 않았습니다.
  NOT_EXIST_ROOM: 31004, // 룸이 없습니다.

  OFFICE_RESERVATION_SUCCESSFUL: 30000, // 회의실 입장 예약 대기 성공
  OFFICE_USER_NOT_EXIST: 30001, // 회의실 입장 예약시, 사용자가 존재하지 않을 경우
  OFFICE_USER_ALREADY_RESERVED: 30002, // 회의실 입장 예약시, 이미 예약된 사용자일 경우
  OFFICE_OVER_CAPACITY: 30003, // 회의실 입장 예약시, 인원 초과일 경우
  OFFICE_NOT_EXIST: 30004, // 회의실 입장 예약시, 회의실이 존재하지 않을 경우
  OFFICE_RESERVATION_LEAVE: 30005, // 회의실 입장 예약 대기 나가기
  OFFICE_RESERVATION_ROOM_CREATE: 30006, // 회의실 방 생성 알림
  OFFICE_RESERVATION_ROOM_DELETE: 30007, // 회의실 방 삭제 알림

  FRIEND_NOT_FRIEND: 40001, // 친구가 아닐 경우
  FRIEND_IS_OFFLINE: 40002, // 친구가 온라인일 경우
  FRIEND_NOT_EXIST: 40003, // 친구가 존재하지 않을 경우
  FRIEND_FOLLOW: 40010, // 친구 따라가기 성공
  FRIEND_BRING: 40011, // 친구 따라가기 취소 성공
});

export const SOCKET_C_GLOBAL = Object.freeze({
  C_REQUEST: 'C_REQUEST', // 클라이언트 소켓 요청
});

export const SOCKET_S_GLOBAL = Object.freeze({
  ERROR: 'ERROR',
  S_SYSTEM_MESSAGE: 'S_SYSTEM_MESSAGE', // 시스템 메시지
  S_DROP_PLAYER: 'S_DROP_PLAYER', // 플레이어 강제 퇴장
  S_PLAYER_CONNECTED: 'S_PLAYER_CONNECTED', // 플레이어 접속
});

// Socket.IO  C_ -> S_ Global Constants
export const CHATTING_SOCKET_C_GLOBAL = Object.freeze({
  C_CHANGE_NICKNAME: 'C_CHANGE_NICKNAME', // 플레이어 닉네임 변경
});

export const CHATTING_ROOM_ENTER = Object.freeze({
  C_NICKNAME: 'C_NICKNAME', // 플레이어 닉네임
});

// Socket.IO Server -> Client Chatting Message Constants
export const CHATTING_SOCKET_S_MESSAGE = Object.freeze({
  S_SYSTEM_MESSAGE: 'S_SYSTEM_MESSAGE', // 시스템 메시지
  S_SEND_MESSAGE: 'S_SEND_MESSAGE', // 채팅 메시지 보내기

  S_SEND_DIRECT_MESSAGE: 'S_SEND_DIRECT_MESSAGE', // 다이렉트 메시지 보내기
  S_SEND_FRIEND_DIRECT_MESSAGE: 'S_SEND_FRIEND_DIRECT_MESSAGE', // 친구 다이렉트 메시지 보내기
});

// Socket.IO C_ -> S_ Chatting Message Constants
export const CHATTING_SOCKET_C_MESSAGE = Object.freeze({
  C_SEND_MESSAGE: 'C_SEND_MESSAGE', // 채팅 메시지 보내기
  C_RECEIVE_MESSAGE: 'C_RECEIVE_MESSAGE', // 채팅 메시지 받기

  C_SEND_DIRECT_MESSAGE: 'C_SEND_DIRECT_MESSAGE', // 다이렉트 메시지 보내기
  C_RECEIVE_DIRECT_MESSAGE: 'C_RECEIVE_DIRECT_MESSAGE', // 다이렉트 메시지 받기
  C_SEND_FRIEND_DIRECT_MESSAGE: 'C_SEND_FRIEND_DIRECT_MESSAGE', // 친구 다이렉트 메시지 보내기
});

// Socket.IO Server -> Client Office Message Constants
export const OFFICE_SOCKET_S_MESSAGE = Object.freeze({
  S_OFFICE_QUEUE_REGISTER: 'S_OFFICE_QUEUE_REGISTER', // 회의실 입장 예약하기 결과 반환
  S_OFFICE_QUEUE_EXIT: 'S_OFFICE_QUEUE_EXIT', // 회의실 입장 예약 나가기 결과 반환
  S_OFFICE_QUEUE_START: 'S_OFFICE_QUEUE_START', // 회의실  방 생성 알림
  S_OFFICE_QUEUE_DELETE: 'S_OFFICE_QUEUE_DELETE', // 회의실 방 삭제 알림
});

// Socket.IO C_ -> S_ Office Message Constants
export const OFFICE_SOCKET_C_MESSAGE = Object.freeze({
  C_OFFICE_QUEUE_REGISTER: 'C_OFFICE_QUEUE_REGISTER', // 회의실 입장 예약하기
  C_OFFICE_QUEUE_EXIT: 'C_OFFICE_QUEUE_EXIT', // 회의실 입장 예약 나가기
});

// Socket.IO Server -> Client Office Message Constants
export const FRIEND_SOCKET_S_MESSAGE = Object.freeze({
  S_FRIEND_LIST: 'S_FRIEND_LIST', // 친구 목록 불러오기
  S_FRIEND_FOLLOW: 'S_FRIEND_FOLLOW', // 친구 따라가기
  S_FRIEND_BRING: 'S_FRIEND_BRING', // 친구 불러오기
});

// Socket.IO C_ -> S_ Office Message Constants
export const FRIEND_SOCKET_C_MESSAGE = Object.freeze({
  C_FRIEND_LIST: 'C_FRIEND_LIST', // 친구 목록 불러오기
  C_FRIEND_FOLLOW: 'C_FRIEND_FOLLOW', // 친구 따라가기
  C_FRIEND_BRING: 'C_FRIEND_BRING', // 친구 불러오기
});

// Socket.IO Server -> Client ScreenBanner Message Constants
export const SCREEN_BANNER_SOCKET_S_MESSAGE = Object.freeze({
  S_SCREEN_LIST: 'S_SCREEN_LIST', // 스크린 리스트 보내기
  S_BANNER_LIST: 'S_BANNER_LIST', // 배너 리스트 보내기
});

// 동기화
export const PLAYER_SOCKET_S_MESSAGE = Object.freeze({
  S_BASE_SET_TRANSFORM: 'S_BASE_SET_TRANSFORM', // 플레이어 이동
  S_BASE_SET_ANIMATION: 'S_BASE_SET_ANIMATION',
  S_BASE_SET_ANIMATION_ONCE: 'S_BASE_SET_ANIMATION_ONCE',
  S_ENTER: 'S_ENTER', // 룸 입장
  S_EXIT: 'S_EXIT', // 룸 퇴장
  S_REENTER: 'S_REENTER',
  S_ADD_CLIENT: 'S_ADD_CLIENT',
  S_BASE_INSTANTIATE_OBJECT: 'S_BASE_INSTANTIATE_OBJECT',
  S_INTERACTION_GET_ITEMS: 'S_INTERACTION_GET_ITEMS',
  S_INTERACTION_SET_ITEM: 'S_INTERACTION_SET_ITEM',
  S_INTERACTION_SET_ITEM_NOTICE: 'S_INTERACTION_SET_ITEM_NOTICE',
  S_INTERACTION_REMOVE_ITEM: 'S_INTERACTION_REMOVE_ITEM',
  S_INTERACTION_REMOVE_ITEM_NOTICE: 'S_INTERACTION_REMOVE_ITEM_NOTICE',
  S_BASE_ADD_OBJECT: 'S_BASE_ADD_OBJECT',
  S_BASE_REMOVE_OBJECT: 'S_BASE_REMOVE_OBJECT',
});

export const PLAYER_SOCKET_C_MESSAGE = Object.freeze({
  C_BASE_SET_TRANSFORM: 'C_BASE_SET_TRANSFORM', // 플레이어 이동
  C_BASE_SET_ANIMATION: 'C_BASE_SET_ANIMATION',
  C_BASE_SET_ANIMATION_ONCE: 'C_BASE_SET_ANIMATION_ONCE',
  C_ENTER: 'C_ENTER', // 룸 입장
  C_EXIT: 'C_EXIT', // 룸 퇴장
  C_REENTER: 'C_REENTER',
  C_GET_CLIENT: 'C_GET_CLIENT',
  C_EXIT_AND_ENTER_PLAYER_ROOM: 'C_EXIT_AND_ENTER_PLAYER_ROOM', // 룸 퇴장 후 입장
  C_BASE_INSTANTIATE_OBJECT: 'C_BASE_INSTANTIATE_OBJECT',
  C_INTERACTION_GET_ITEMS: 'C_INTERACTION_GET_ITEMS',
  C_INTERACTION_SET_ITEM: 'C_INTERACTION_SET_ITEM',
  C_INTERACTION_SET_ITEM_NOTICE: 'C_INTERACTION_SET_ITEM_NOTICE',
  C_INTERACTION_REMOVE_ITEM: 'C_INTERACTION_REMOVE_ITEM',
  C_INTERACTION_REMOVE_ITEM_NOTICE: 'C_INTERACTION_REMOVE_ITEM_NOTICE',
  C_BASE_GET_OBJECT: 'C_BASE_GET_OBJECT',
  C_BASE_REMOVE_OBJECT: 'C_BASE_REMOVE_OBJECT',
});

export const MY_ROOM_SOCKET_S_MESSAGE = Object.freeze({
  S_MYROOM_GET_ROOMINFO: 'S_MYROOM_GET_ROOMINFO',
  S_MYROOM_SET_ROOMINFO: 'S_MYROOM_SET_ROOMINFO',
  S_MYROOM_OTHER_ROOM_LIST: 'S_MYROOM_OTHER_ROOM_LIST',
  S_MYROOM_START_EDIT: 'S_MYROOM_START_EDIT',
  S_MYROOM_END_EDIT: 'S_MYROOM_END_EDIT',
  S_MYROOM_KICK: 'S_MYROOM_KICK',
  S_MYROOM_SHUTDOWN: 'S_MYROOM_SHUTDOWN',
});

export const MY_ROOM_SOCKET_C_MESSAGE = Object.freeze({
  C_MYROOM_GET_ROOMINFO: 'C_MYROOM_GET_ROOMINFO',
  C_MYROOM_SET_ROOMINFO: 'C_MYROOM_SET_ROOMINFO',
  C_MYROOM_OTHER_ROOM_LIST: 'C_MYROOM_OTHER_ROOM_LIST',
  C_MYROOM_START_EDIT: 'C_MYROOM_START_EDIT',
  C_MYROOM_END_EDIT: 'C_MYROOM_END_EDIT',
  C_MYROOM_KICK: 'C_MYROOM_KICK',
  C_MYROOM_SHUTDOWN: 'C_MYROOM_SHUTDOWN',
});

export const NAMESPACE = Object.freeze({
  CHAT: 'chat',
  BLOCKCHAIN: 'blockchain',
  FRIEND: 'friend',
  OFFICE: 'office',
  PLAYER: 'player',
  MY_ROOM: 'my-room',
  SCREEN_BANNER: 'screen-banner',
  MANAGER: 'manager',
});

export const HUB_SOCKET_C_MESSAGE = Object.freeze({
  C_GET_GAMEOBJECTS: 'C_GET_GAMEOBJECTS', // 게임오브젝트 목록 조회 요청
  C_SEND_GAMEOBJECTS: 'C_SEND_GAMEOBJECTS', // 게임오브젝트 목록 전송
  C_GET_INTERACTIONS: 'C_GET_INTERACTIONS', // 인터랙션 목록 조회 요청
  C_SEND_INTERACTIONS: 'C_SEND_INTERACTIONS', // 인터랙션 목록 전송
});

export const HUB_SOCKET_S_MESSAGE = Object.freeze({
  S_GET_GAMEOBJECTS: 'S_GET_GAMEOBJECTS', // 게임오브젝트 목록 조회 요청
  S_GAMEOBJECTS_RESULT: 'S_GAMEOBJECTS_RESULT', // 게임오브젝트 목록 조회 요청의 최종 응답
  S_GET_INTERACTIONS: 'S_GET_INTERACTIONS', // 인터랙션 목록 조회 요청
  S_INTERACTIONS_RESULT: 'S_INTERACTIONS_RESULT', // 게인터랙션 목록 조회 요청의 최종 응답
});

// ROOM_NAME
export const HUB_SOCKET_ROOM = Object.freeze({
  GAMEOBJECT: 'GAMEOBJECT', // 게임오브젝트 조회 용도의 룸
});

// NATS

export const NATS_URL = 'NATS_URL';

export const NATS_EVENTS = Object.freeze({
  ENTER_PLAYER_ROOM: 'ENTER_PLAYER_ROOM',
  EXIT_AND_ENTER_PLAYER_ROOM: 'EXIT_AND_ENTER_PLAYER_ROOM',
  EXIT_PLAYER_ROOM: 'EXIT_PLAYER_ROOM',
  PLAYER_MOVE_TRANSFORM: 'PLAYER_MOVE_TRANSFORM',
  CREATE_PLAYER_ROOM: 'CREATE_PLAYER_ROOM',
  DELETE_PLAYER_ROOM: 'DELETE_PLAYER_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  SYNC_ROOM: 'SYNC_ROOM',
  PLAYER_ROOM: 'PLAYER_ROOM',
  MY_ROOM: 'MY_ROOM',

  CREATE_OFFICE: 'CREATE_OFFICE',
  DELETE_OFFICE: 'DELETE_OFFICE',

  SCREEN: 'SCREEN',
  BANNER: 'BANNER',

  CHAT_ROOM: 'CHAT_ROOM',
  CREATE_CHAT_ROOM: 'CREATE_CHAT_ROOM',
  DELETE_CHAT_ROOM: 'DELETE_CHAT_ROOM',
  EXIT_AND_ENTER_CHAT_ROOM: 'EXIT_AND_ENTER_CHAT_ROOM',
  EXIT_CHAT_ROOM: 'EXIT_CHAT_ROOM',

  NATS_CONNECTED: 'NATS_CONNECTED',
  DUPLICATE_LOGIN_USER: 'DUPLICATE_LOGIN_USER',

  REQ_GET_GAMEOBJECTS: 'REQ_GET_GAMEOBJECTS',
  RES_GET_GAMEOBJECTS: 'RES_GET_GAMEOBJECTS',

  START_EDIT_MY_ROOM: 'START_EDIT_MY_ROOM',
  END_EDIT_MY_ROOM: 'END_EDIT_MY_ROOM',
});

export const ROOM_TYPE = Object.freeze({
  Arz: 0,
  Busan: 1,
  JumpingMatching: 2,
  OXQuiz: 3,
  Lecture: 4,
  Meeting: 5,
  Consulting: 6,
  MyRoom: 7,
  Conference: 8,
  Game: 9,
  Office: 10,
  Store: 11,
  Vote: 12,
  Hospital: 13,
  Festival: 14,
  Unknown: 15,
});
