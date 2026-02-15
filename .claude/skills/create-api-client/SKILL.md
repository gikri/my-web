# create-api-client

Next.js에서 FastAPI를 호출하는 API 클라이언트 함수를 생성한다.

## Trigger

사용자가 다음을 요청할 때 자동 사용:
- "API 클라이언트 만들어"
- "서버에서 데이터 가져와"
- `lib/api/` 에 새 엔드포인트 함수 추가 시
- Server/Client Component에서 fetch 패턴이 필요할 때

## Rules

1. **Server Component** → `apiFetch` 직접 호출 (서버 간 통신)
2. **Client Component** → `useQuery` 또는 `/api` Route Handler 경유 (BFF)
3. `FASTAPI_URL` 환경변수는 서버 전용 — 클라이언트에 절대 노출 금지
4. 타입은 `types/api.ts`에서 import
5. 에러는 throw — 빈 catch 금지

## Base Client

```ts
// lib/api/client.ts
const API_BASE_URL = process.env.FASTAPI_URL

if (!API_BASE_URL) throw new Error('FASTAPI_URL is not defined')

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${await res.text()}`)
  }

  return res.json() as Promise<T>
}
```

## 엔드포인트 함수 패턴

```ts
// lib/api/endpoints/users.ts
import { apiFetch } from '@/lib/api/client'
import type { User, UserCreate } from '@/types/api'

export async function getUser(id: string): Promise<User> {
  return apiFetch<User>(`/v1/users/${id}`)
}

export async function createUser(payload: UserCreate): Promise<User> {
  return apiFetch<User>('/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function listUsers(): Promise<User[]> {
  return apiFetch<User[]>('/v1/users')
}
```

## 캐싱 전략

```ts
// ISR - 60초 재검증
fetch(url, { next: { revalidate: 60 } })

// 동적 데이터 - 캐시 없음
fetch(url, { cache: 'no-store' })

// 특정 tag로 온디맨드 revalidate
fetch(url, { next: { tags: ['users'] } })
// → revalidateTag('users') 로 무효화
```

## Server Component에서 사용

```tsx
// app/(dashboard)/users/page.tsx (Server Component)
import { listUsers } from '@/lib/api/endpoints/users'

export default async function UsersPage() {
  const users = await listUsers()
  return <UserList users={users} />
}
```

## BFF Route Handler (Client용)

```ts
// app/api/users/[id]/route.ts
import { getUser } from '@/lib/api/endpoints/users'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const user = await getUser(params.id)
  return NextResponse.json(user)
}
```

## 타입 정의 위치

```ts
// types/api.ts
export interface User {
  id:         string
  email:      string
  name:       string
  created_at: string
}

export interface UserCreate {
  email: string
  name:  string
}
```

## Checklist

- [ ] `FASTAPI_URL` 서버 전용 — `NEXT_PUBLIC_` 사용 안 함
- [ ] 에러 명시적 throw
- [ ] 타입 `types/api.ts` 에 정의
- [ ] Server Component는 직접 호출, Client는 BFF 경유
- [ ] 캐싱 전략 명시 (`revalidate` or `no-store`)
