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

나의 오브젝트를 애니메이션을 위한 요청.

### 요청 정보

| 항목      | 값                     |
| --------- | ---------------------- |
| type      | `player`               |
| eventName | `C_BASE_SET_ANIMATION' |

### 요청 데이터 구조

```json
{
  "objectId": number,
  "animationId": string,
  "animation": string
}
```

### 응답 정보

- eventName : S_BASE_SET_TRANSFORM

```json
{
  "objectId": 50,
  "animationId": "23",
  "animation": "animation"
}
```
