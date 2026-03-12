'use client';

import { useState, useEffect } from 'react';
import { uploadFile, getFiles, deleteFile, verifyPassword } from './actions';

type FileItem = {
  fileName: string;
  originalName: string;
  size: number;
  createdAt: number;
  downloadUrl: string;
}

const MAX_SLOTS = 3;

export default function SharePage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check session storage for auth on mount
    const authStatus = sessionStorage.getItem('share_authorized');
    if (authStatus === 'true') {
        setIsAuthorized(true);
        fetchFiles();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      
      try {
          const result = await verifyPassword(passwordInput);
          if (result.success) {
              setIsAuthorized(true);
              sessionStorage.setItem('share_authorized', 'true');
              await fetchFiles();
          } else {
              setLoginError(result.error || '접근이 거부되었습니다.');
          }
      } catch {
          setLoginError('인증 중 오류가 발생했습니다.');
      }
  };

  const fetchFiles = async () => {
    const result = await getFiles();
    if (result.success && result.files) {
      setUploadedFiles(result.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleUpload(file, slotIndex);
    }
    // reset input value so the same file could be selected again if needed
    e.target.value = '';
  };

  const handleUpload = async (file: File, slotIndex: number) => {
    if (uploadedFiles.length >= MAX_SLOTS) {
        setError(`최대 ${MAX_SLOTS}개까지만 업로드 가능합니다.`);
        return;
    }

    setUploadingSlot(slotIndex);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        await fetchFiles(); // Refresh list to get new file into a slot
      }
    } catch {
      setError('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleDelete = async (fileName: string) => {
      setDeletingFile(fileName);
      setError(null);
      
      try {
          const result = await deleteFile(fileName);
          if (result.error) {
              setError(result.error);
          } else {
              await fetchFiles(); // Refresh list
          }
      } catch {
          setError('파일 삭제 중 오류가 발생했습니다.');
      } finally {
          setDeletingFile(null);
      }
  };

  const handleCopy = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert('링크가 클립보드에 복사되었습니다!');
  };

  // Create exactly MAX_SLOTS to render
  const slots = Array.from({ length: MAX_SLOTS }, (_, index) => {
    // Fill the slot with an uploaded file if one exists for this index, otherwise it's empty
    return uploadedFiles[index] || null;
  });

  if (!isAuthorized) {
      return (
          <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-cafe24)] flex flex-col items-center justify-center">
              <main className="w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-center">보안 페이지</h1>
                <p className="text-sm text-center text-white/60">파일 공유에 접근하려면<br/>비밀번호를 입력하세요.</p>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="비밀번호"
                        className="w-full bg-black/50 border border-white/20 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-center transition-colors"
                        autoFocus
                    />
                    
                    {loginError && (
                        <p className="text-red-500 text-xs text-center">{loginError}</p>
                    )}
                    
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                        접근 확인
                    </button>
                </form>
              </main>
          </div>
      );
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-cafe24)] flex flex-col items-center justify-center">
      <main className="w-full max-w-5xl bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-8">
        
        <section>
            <h1 className="text-3xl font-bold mb-3 text-center">파일 공유</h1>
            <p className="text-sm text-center text-white/60 mb-8">빈 슬롯을 클릭하여 파일을 업로드 하세요. (최대 {MAX_SLOTS}개)</p>
            
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slots.map((fileItem, index) => {
                    const isUploading = uploadingSlot === index;
                    
                    if (fileItem) {
                        const isDeleting = deletingFile === fileItem.fileName;
                        
                        // Slot 꽉 참 (파일 업로드 된 상태)
                        return (
                             <div key={fileItem.fileName} className="relative flex flex-col h-64 p-6 rounded-2xl border border-white/20 bg-black/20 shadow-inner group transition-all hover:border-white/40">
                                 <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 w-full">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <p className="font-semibold px-2 w-full truncate" title={fileItem.originalName}>{fileItem.originalName}</p>
                                    <p className="text-xs text-white/50">{(fileItem.size / 1024 / 1024).toFixed(2)} MB</p>
                                 </div>
                                 
                                 <div className="flex flex-col gap-2 mt-4">
                                     <div className="flex gap-2 w-full">
                                        <button 
                                            onClick={() => handleCopy(fileItem.downloadUrl)}
                                            className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg transition-colors text-xs font-semibold"
                                        >
                                            복사
                                        </button>
                                        <a 
                                            href={fileItem.downloadUrl}
                                            className="flex-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 py-2 rounded-lg transition-colors text-xs font-semibold text-center leading-loose"
                                            download
                                        >
                                            다운로드
                                        </a>
                                     </div>
                                     <button
                                         onClick={() => handleDelete(fileItem.fileName)}
                                         disabled={isDeleting}
                                         className="w-full text-xs text-red-400 hover:text-white disabled:opacity-50 py-2 bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors"
                                     >
                                         {isDeleting ? '삭제중...' : '삭제'}
                                     </button>
                                 </div>
                             </div>
                        );
                    }

                    // Slot 비어있음
                    return (
                        <div key={`empty-${index}`} className={`relative flex flex-col items-center justify-center h-64 p-6 rounded-2xl border-2 border-dashed transition-all
                            ${isUploading ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5 cursor-pointer'}`}
                        >
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, index)}
                                disabled={isUploading || uploadingSlot !== null} // Disable other inputs while one is uploading
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            />
                            
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                   <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                   <p className="text-sm font-medium text-blue-400">업로드 중...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-white/40 group-hover:text-white/70 transition-colors">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                                    <p className="text-sm font-medium">새 파일 업로드</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>

      </main>
    </div>
  );
}
