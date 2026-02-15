import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: '모든 필드를 입력해 주세요.' } },
      { status: 400 }
    )
  }

  // TODO: FastAPI /v1/contact 연동 또는 메일 서비스 연결
  return NextResponse.json(
    { error: { code: 'NOT_IMPLEMENTED', message: '메일 서비스가 아직 연결되지 않았습니다.' } },
    { status: 501 }
  )
}
