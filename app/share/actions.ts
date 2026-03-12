'use server';

import { v4 as uuidv4 } from 'uuid';
import { writeFile, readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

const MAX_FILES = 3;

async function ensureUploadDir() {
  const uploadDir = join(process.cwd(), 'uploads');
  return uploadDir;
}

export async function getFiles() {
  const uploadDir = await ensureUploadDir();
  try {
    const files = await readdir(uploadDir);
    const validFiles = files.filter(f => !f.startsWith('.'));
    
    const fileStats = await Promise.all(
      validFiles.map(async (fileName) => {
        const filePath = join(uploadDir, fileName);
        const stats = await stat(filePath);
        
        let originalName = fileName;
        if (fileName.length > 37 && fileName.charAt(36) === '-') {
            originalName = fileName.substring(37);
        } else {
            const parts = fileName.split('-');
            if (parts.length > 5) {
                originalName = parts.slice(5).join('-');
            }
        }
        
        return {
          fileName,
          originalName,
          size: stats.size,
          createdAt: stats.birthtimeMs,
          downloadUrl: `/api/download/${fileName}`
        };
      })
    );
    
    return { success: true, files: fileStats.sort((a, b) => b.createdAt - a.createdAt) };
  } catch (error) {
    console.error('Error reading files:', error);
    return { success: true, files: [] }; // Return empty if dir doesn't exist yet
  }
}

export async function verifyPassword(password: string) {
    // 환경변수에서 비밀번호를 가져오거나 기본값을 사용합니다
    const REQUIRED_PASSWORD = process.env.SHARE_PASSWORD || '1234';
    
    if (password === REQUIRED_PASSWORD) {
        return { success: true };
    }
    return { error: '비밀번호가 일치하지 않습니다.' };
}

export async function deleteFile(fileName: string) {
    if (!fileName) return { error: 'No filename provided' };
    
    const uploadDir = await ensureUploadDir();
    const filePath = join(uploadDir, fileName);
    
    try {
        await unlink(filePath);
        return { success: true };
    } catch (error) {
        console.error('Error deleting file:', error);
        return { error: 'Failed to delete file' };
    }
}

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { error: 'No file uploaded' };
  }

  const uploadDir = await ensureUploadDir();
  
  try {
      const existingFiles = await readdir(uploadDir);
      const validFiles = existingFiles.filter(f => !f.startsWith('.'));
      
      if (validFiles.length >= MAX_FILES) {
          return { error: `Maximum of ${MAX_FILES} files allowed. Please delete a file first.` };
      }
  } catch {
      // Directory might not exist or be empty, which is fine
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = file.name;
  const extension = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '';
  const pureName = originalName.includes('.') ? originalName.substring(0, originalName.lastIndexOf('.')) : originalName;
  
  const uuid = uuidv4();
  const fileName = `${uuid}-${pureName}${extension}`;
  const path = join(uploadDir, fileName);

  try {
    await writeFile(path, buffer);
    const downloadUrl = `/api/download/${fileName}`;
    return { success: true, url: downloadUrl, fileName: originalName };
  } catch (error) {
    console.error('Error saving file:', error);
    return { error: 'Failed to save file' };
  }
}

