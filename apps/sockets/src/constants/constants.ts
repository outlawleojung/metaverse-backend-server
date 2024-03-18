export const RedisKey = {
  getStrRoomId: (roomId: string): string => `room:${roomId}`,
  getStrRoomPlayerList: (roomId: string): string => `${roomId}:playerlist`,
  getStrMemberCurrentRoom: (memberId: string): string =>
    `member:${memberId}:currentRoom`,
  getStrMemberLockSocket: (memberId: string): string =>
    `lock:socket:${memberId}`,
  getStrMemberSocket: (memberId: string): string => `socket:${memberId}`,

  getStrMemberCurruntRoom: (memberId: string): string =>
    `member:${memberId}:currentRoom`,
  getStrOfficeReservRoomCode: (roomCode: string): string =>
    `officeReservation:${roomCode}`,
  getStrOfficeReservKey: (): string => `officeReservationRoomCode`,
};

export const SOCKET_SERVER_ERROR_CODE_GLOBAL = Object.freeze({
  C_RECONNECT_ERROR: 100000, //클라이언트 재연결 시도 후에도 연결이 안될때

  DIRECT_MESSAGE_USER_NOT_FOUND: 2100, // 귓속말(월드 1:1 ) 대상이 존재하지 않을 경우
  DIRECT_MESSAGE_USER_NOT_CONNECTED: 2101, // 귓속말(월드 1:1 ) 대상이 현재 오프라인 상태일 경우
  DIRECT_MESSAGE_SEND_ME: 2102, // 귓속말(월드 1:1 ) 대상이 자기 자신일 경우

  ROOM_ALREADY_CONNECTED: 31000, // 방 입장시, 이미 접속중인 방 일때

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

export const SOCKET_S_GLOBAL = Object.freeze({
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
  S_BASE_SET_EMOJI: 'S_BASE_SET_EMOJI',
  S_ENTER_PLAYER_ROOM: 'S_ENTER_PLAYER_ROOM', // 룸 입장
  S_EXIT_PLAYER_ROOM: 'S_EXIT_PLAYER_ROOM', // 룸 퇴장
});

export const PLAYER_SOCKET_C_MESSAGE = Object.freeze({
  C_BASE_SET_TRANSFORM: 'C_BASE_SET_TRANSFORM', // 플레이어 이동
  C_BASE_SET_ANIMATION: 'C_BASE_SET_ANIMATION',
  C_BASE_SET_EMOJI: 'C_BASE_SET_EMOJI',
  C_ENTER_PLAYER_ROOM: 'C_ENTER_PLAYER_ROOM', // 룸 입장
  C_EXIT_PLAYER_ROOM: 'C_EXIT_PLAYER_ROOM', // 룸 퇴장
  C_EXIT_AND_ENTER_PLAYER_ROOM: 'C_EXIT_AND_ENTER_PLAYER_ROOM', // 룸 퇴장 후 입장
});

export const NAMESPACE = Object.freeze({
  CHATTING: 'chatting',
  BLOCKCHAIN: 'blockchain',
  FRIEND: 'friend',
  OFFICE: 'office',
  PLAYER: 'player',
  SCREEN_BANNER: 'screen-banner',
  MANAGER: 'manager',
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
});
