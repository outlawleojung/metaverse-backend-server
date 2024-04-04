# WebSocket 서버 요청 명세서

## 메시지 인터페이스

### 요청: C_REQUEST

클라이언트에서 서버로 보내는 기본 요청 형식입니다.

모든 요청의 이벤트 이름은 C_REQUEST 입니다.

```c#
emit.("C_REQUEST", payload);
```

- **Payload 구조**:
- payload 의 type에 요청을 받는 게이트웨이 이름을 명시합니다.
- eventName에 실제 요청의 이벤트 이름을 명시 합니다.
- data에 보내는 요청 데이터를 보냅니다.
- 요청 기본 예시

  ```json
  {
    "type": "게이트웨이 타입",
    "eventName": "이벤트 이름",
    "data": {
      "추가 데이터"
    }
  }
  ```

# type : main

## 룸 입장하기

룸에 참여하기 위한 요청.

### 요청 정보

| 항목      | 값        |
| --------- | --------- |
| type      | `player`  |
| eventName | `C_ENTER` |

### 요청 데이터 구조

```json
{
  "roomId": string,
  "sceneName" : string,
  "clientId" : string,
}
```

### 응답 정보

- eventName : S_ENTER

```json
{
  "result": "success"
}
```

## 다른 사용자의 퇴장

다른 사용자가 룸에서 퇴장 했을 때 응답

### 요청 정보

- 없음.

### 요청 데이터 구조

- 없음.

### 응답 정보

- eventName : S_LEAVE

```json
{
  "ojbectId": "12",
  "clientId": "DV3G5BQ2"
}
```

# type : player

## 클라이언트 목록 요청

룸에 입장한 클라이언트 목록 요청.

### 요청 정보

| 항목      | 값             |
| --------- | -------------- |
| type      | `player`       |
| eventName | `C_GET_CLIENT` |

### 요청 데이터 구조

- 없음.

### 응답 정보

- eventName : S_ADD_CLIENT

```json
[
  {
    "clientId": "7TQ9VUL4TEWN",
    "nickname": "연봉협상가"
  },
  {
    "clientId": "QALMD6528WKL",
    "nickname": "애플심사"
  }
]
```

## 오브젝트 생성 요청

나의 아바타 오브젝트를 생성 하기 위한 요청.

### 요청 정보

| 항목      | 값                          |
| --------- | --------------------------- |
| type      | `player`                    |
| eventName | `C_BASE_INSTANTIATE_OBJECT` |

### 요청 데이터 구조

```json
{
  "prefabName": string,
  "objectData": string,
  "position": {
    "x": number,
    "y": number,
    "z": number
  },

  "rotation": {
    "x": number,
    "y": number,
    "z": number
  }
}
```

### 응답 정보

- eventName : S_BASE_INSTANTIATE_OBJECT

```json
{
  "success": true,
  "objectId": 30
}
```

- eventName : S_BASE_ADD_OBJECT

```json
{
  "gameObjects": [
    {
      "animations": {},
      "objectId": 30,
      "prefabName": "ADDRESSABLE/PREFAB/PLAYER/PLAYER_REALTIME",
      "position": {
        "x": 123,
        "y": 22,
        "z": 25.3
      },
      "rotation": {
        "x": 90.0,
        "y": 0,
        "z": 0
      },
      "objectData": "aaaa",
      "ownerId": "7TQ9VUL4TEWN"
    }
  ]
}
```

## 오브젝트 목록 요청

내가 입장한 룸의 모든 오브젝트를 조회 하기 위한 요청.

### 요청 정보

| 항목      | 값                  |
| --------- | ------------------- |
| type      | `player`            |
| eventName | `C_BASE_GET_OBJECT` |

### 요청 데이터 구조

- 없음.

### 응답 정보

- eventName : S_BASE_ADD_OBJECT

```json
{
  "gameObjects": [
    {
      "animations": {},
      "objectId": 30,
      "prefabName": "ADDRESSABLE/PREFAB/PLAYER/PLAYER_REALTIME",
      "position": {
        "x": 123,
        "y": 22,
        "z": 25.3
      },
      "rotation": {
        "x": 90.0,
        "y": 0,
        "z": 0
      },
      "objectData": "aaaa",
      "ownerId": "7TQ9VUL4TEWN"
    }
  ]
}
```

## 인터렉션 생성 요청

나의 인터랙션을 생성 하기 위한 요청.

### 요청 정보

| 항목      | 값                       |
| --------- | ------------------------ |
| type      | `player`                 |
| eventName | `C_INTERACTION_SET_ITEM` |

### 요청 데이터 구조

```json
{
    "id": string
}
```

### 응답 정보

- eventName ; S_INTERACTION_SET_ITEM

```json
{
  "success": true
}
```

- eventName : S_INTERACTION_SET_ITEM_NOTICE

```json
{
  "id": "x: 123, y: 21, x: 76"
}
```

## 인터렉션 삭제 요청

나의 인터랙션을 삭제 하기 위한 요청.

### 요청 정보

| 항목      | 값                          |
| --------- | --------------------------- |
| type      | `player`                    |
| eventName | `C_INTERACTION_REMOVE_ITEM` |

### 요청 데이터 구조

```json
{
    "id": string
}
```

### 응답 정보

- eventName : S_INTERACTION_REMOVE_ITEM

```json
{
  "success": true
}
```

- eventName ; S_INTERACTION_REMOVE_ITEM_NOTICE

```json
{
  "id": "x: 123, y: 21, x: 76"
}
```

## 오브젝트 이동 요청

나의 오브젝트를 이동 하기 위한 요청.

### 요청 정보

| 항목      | 값                     |
| --------- | ---------------------- |
| type      | `player`               |
| eventName | `C_BASE_SET_TRANSFORM` |

### 요청 데이터 구조

```json
{
  "objectId": number,
  "position": {
    "x": number,
    "y": number,
    "z": number
  },
  "rotation": {
    "x": number,
    "y": number,
    "z": number
  }
}
```

### 응답 정보

- eventName : S_BASE_SET_TRANSFORM

```json
{
  "objectId": 48,
  "position": {
    "x": 20.4,
    "y": 30.1,
    "z": 40.6
  },
  "rotation": {
    "x": 20.7,
    "y": 30.3,
    "z": 40.9
  }
}
```

## 오브젝트 애니메이션 요청

나의 오브젝트 애니메이션 요청.

### 요청 정보

| 항목      | 값                     |
| --------- | ---------------------- |
| type      | `player`               |
| eventName | `C_BASE_SET_ANIMATION` |

### 요청 데이터 구조

```json
{
  "objectId": number,
  "animationId": string,
  "animation": string
}
```

### 응답 정보

- eventName : S_BASE_SET_ANIMATION

```json
{
  "objectId": 50,
  "animationId": "23",
  "animation": "animation"
}
```

## 오브젝트 이모지 애니메이션 요청

나의 오브젝트의 이모지 애니메이션 요청.

### 요청 정보

| 항목      | 값                          |
| --------- | --------------------------- |
| type      | `player`                    |
| eventName | `C_BASE_SET_ANIMATION_ONCE` |

### 요청 데이터 구조

```json
{
  "objectId": number,
  "animationId": string,
  "isLoop": boolean,
  "blend": number
}
```

### 응답 정보

- eventName : S_BASE_SET_ANIMATION_ONCE

```json
{
  "objectId": 50,
  "animationId": "23",
  "isLoop": false,
  "blend": 0
}
```

# type : my-room

## 마이룸 정보 요청

내가 입장한 마이룸 정보 요청

### 요청 정보

| 항목      | 값                      |
| --------- | ----------------------- |
| type      | `my-room`               |
| eventName | `C_MYROOM_GET_ROOMINFO` |

### 요청 데이터 구조

- 없음.

### 응답 정보

- eventName : S_MYROOM_GET_ROOMINFO

```json
{
  "ownerId": "7TQ9VUL4TEWN",
  "ownerNickname": "연봉협상가",
  "isShutdown": false,
  "ownerAvatarInfo": {
    "1": 310002,
    "2": 320010,
    "3": 330015,
    "6": 360001
  }
}
```

## 마이룸 편집 시작 요청

나의 마이룸에 입장 후 마이룸 편집 요청

### 요청 정보

| 항목      | 값                    |
| --------- | --------------------- |
| type      | `my-room`             |
| eventName | `C_MYROOM_START_EDIT` |

### 요청 데이터 구조

- 없음.

### 응답 정보

- eventName : S_MYROOM_START_EDIT

```json
{}
```

## 마이룸 편집 종료 요청

나의 마이룸에 입장 후 마이룸 편집 요청

### 요청 정보

| 항목      | 값                  |
| --------- | ------------------- |
| type      | `my-room`           |
| eventName | `C_MYROOM_END_EDIT` |

### 요청 데이터 구조

```json
{
  "isChanged": boolean
}
```

### 응답 정보

- eventName : S_MYROOM_END_EDIT

```json
{
  "isChanged": true
}
```

# type : chat

## 채팅 메세지 보내기 요청

현재 룸에 채팅 메세지 보내기 요청

### 요청 정보

| 항목      | 값               |
| --------- | ---------------- |
| type      | `chat`           |
| eventName | `C_SEND_MESSAGE` |

### 요청 데이터 구조

```json
{
  "message": string,
  "color": string,
  "roomCode": string,
  "roomName": string
}
```

### 응답 정보

- eventName : S_SEND_MESSAGE

```json
{
  "sendNickname": "한쏘주",
  "color": "222, 111, 123",
  "message": "메세지 내용 입니다."
}
```

## DM 채팅 메세지 보내기 요청

특정 사용자에게 채팅 메세지 보내기 요청

### 요청 정보

| 항목      | 값                      |
| --------- | ----------------------- |
| type      | `chat`                  |
| eventName | `C_SEND_DIRECT_MESSAGE` |

### 요청 데이터 구조

```json
{
  "recvNickName": string,
  "message": string,
  "color": string,
  "roomCode": string,
  "roomName": string
}
```

### 응답 정보

- eventName : S_SEND_DIRECT_MESSAGE

```json
{
  "sendNickname": "한쏘주",
  "recvNickname": "연봉협상가",
  "color": "222, 111, 123",
  "message": "메세지 내용 입니다."
}
```
