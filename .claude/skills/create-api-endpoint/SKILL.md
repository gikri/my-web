# create-api-endpoint

FastAPI 엔드포인트를 Pydantic 스키마와 함께 생성한다.

## Trigger

사용자가 다음을 요청할 때 자동 사용:
- "API 엔드포인트 만들어"
- "FastAPI 라우터 추가"
- `my-api/app/routers/` 에 새 파일 추가 시

## Rules

1. 라우터: `APIRouter(prefix="/v1/[resource]", tags=["[Resource]"])`
2. 스키마(schemas)와 DB 모델(models) 파일 분리 — 절대 혼용 금지
3. 응답 모델은 항상 `response_model` 파라미터로 명시
4. 에러: `HTTPException`으로 명시적 raise — silent catch 금지
5. 비즈니스 로직은 `services/[resource]_service.py`에 분리

## 파일 구조

```
app/
  routers/users.py         # 라우터 (HTTP 레이어만)
  schemas/user.py          # Pydantic 입출력 스키마
  models/user.py           # SQLAlchemy ORM 모델
  services/user_service.py # 비즈니스 로직
```

## Router 패턴

```python
# app/routers/users.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/v1/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str) -> UserResponse:
    user = await UserService.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(payload: UserCreate) -> UserResponse:
    return await UserService.create(payload)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, payload: UserUpdate) -> UserResponse:
    user = await UserService.update(user_id, payload)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: str) -> None:
    deleted = await UserService.delete(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
```

## Schema 패턴

```python
# app/schemas/user.py
from pydantic import BaseModel, Field
from datetime import datetime

class UserCreate(BaseModel):
    email: str = Field(..., description="사용자 이메일")
    name:  str = Field(..., min_length=1, max_length=50)

class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)

class UserResponse(BaseModel):
    id:         str
    email:      str
    name:       str
    created_at: datetime

    class Config:
        from_attributes = True
```

## 에러 응답 구조 (통일)

```python
# app/core/exceptions.py
from fastapi import Request
from fastapi.responses import JSONResponse

async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": str(exc.status_code), "message": exc.detail}},
    )
```

## main.py 등록

```python
# app/main.py
from app.routers import users

app.include_router(users.router)
```

## Checklist

- [ ] `response_model` 명시
- [ ] 에러는 `HTTPException` — 빈 except 금지
- [ ] Schema / Model 파일 분리
- [ ] 비즈니스 로직 → `services/` 분리
- [ ] `main.py`에 `include_router` 등록
- [ ] 환경변수는 `core/config.py` `BaseSettings`로 관리
