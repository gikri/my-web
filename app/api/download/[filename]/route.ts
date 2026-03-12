import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;
  const filename = resolvedParams.filename;

  if (!filename) {
    return new NextResponse('Filename is required', { status: 400 });
  }

  const filePath = join(process.cwd(), 'uploads', filename);

  try {
    // Check if file exists
    await stat(filePath);
    
    // Read the file buffer
    const fileBuffer = await readFile(filePath);

    // Extract original filename (removing uuid part)
    // uuidv4 is 36 chars + 1 hyphen = 37 chars.
    let originalName = filename;
    if (filename.length > 37 && filename.charAt(36) === '-') {
      originalName = filename.substring(37);
    } else {
      // safe fallback
      const parts = filename.split('-');
      if (parts.length > 5) {
        originalName = parts.slice(5).join('-');
      }
    }

    // Set appropriate headers for download
    const response = new NextResponse(fileBuffer as unknown as BodyInit);
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(originalName)}"`
    );
    response.headers.set('Content-Type', 'application/octet-stream');
    
    return response;
    
  } catch (error) {
    console.error('File download error:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
