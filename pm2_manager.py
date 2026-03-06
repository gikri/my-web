import subprocess
import json
import time
import os
from datetime import datetime

# ================= 설정 섹션 =================
PROCESS_NAME = "my-portfolio"  # 모니터링할 PM2 프로세스 이름
CHECK_INTERVAL = 60          # 체크 간격 (초 단위, 스크립트를 직접 실행할 경우만 적용)
LOG_FILE = "pm2_monitor.log"  # 로그 파일 경로
# ============================================

def log_message(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}\n"
    print(log_entry.strip())
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(log_entry)

def check_pm2_status():
    try:
        # pm2 jlist 명령어로 JSON 형식의 프로세스 목록 가져오기
        result = subprocess.run(["pm2", "jlist"], capture_output=True, text=True, check=True)
        processes = json.loads(result.stdout)
        
        # 프로세스 목록에서 대상 찾기
        target_process = None
        for p in processes:
            if isinstance(p, dict) and p.get("name") == PROCESS_NAME:
                target_process = p
                break
        
        # 명시적으로 None 체크 (이후 target_process는 dict로 확정됨)
        if target_process is None:
            log_message(f"❌ 에러: '{PROCESS_NAME}' 프로세스를 찾을 수 없습니다. (pm2 start 먼저 필요)")
            return False

        # --- 안전하게 상태값 가져오기 ---
        pm2_env = target_process.get("pm2_env")
        if isinstance(pm2_env, dict):
            status = pm2_env.get("status", "unknown")
        else:
            log_message(f"⚠️ 경고: '{PROCESS_NAME}'의 환경 정보(pm2_env)가 비어있거나 형식이 잘못되었습니다.")
            status = "unknown"
        # ----------------------------
        
        if status == "online":
            # log_message(f"✅ '{PROCESS_NAME}' 상태 정상 (online)")
            return True
        else:
            log_message(f"⚠️ 경고: '{PROCESS_NAME}' 상태 이상 ({status}). 재시작 시도 중...")
            restart_result = subprocess.run(["pm2", "restart", PROCESS_NAME], capture_output=True, text=True)
            if restart_result.returncode == 0:
                log_message(f"🚀 '{PROCESS_NAME}' 재시작 성공!")
            else:
                log_message(f"🔥 '{PROCESS_NAME}' 재시작 실패: {restart_result.stderr}")
            return False

    except subprocess.CalledProcessError as e:
        log_message(f"❌ PM2 명령 실행 오류: {e}")
        return False
    except Exception as e:
        log_message(f"❌ 알 수 없는 오류 발생: {e}")
        return False

if __name__ == "__main__":
    log_message(f"🧐 PM2 모니터링 시작: {PROCESS_NAME}")
    
    # 한 번만 실행하고 싶다면 아래 루프 대신 check_pm2_status()만 호출하세요.
    # 크론탭(crontab)에 등록해서 쓸 경우 무한 루프는 필요 없습니다.
    try:
        while True:
            check_pm2_status()
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        log_message("👋 모니터링 중단")
