import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI();

// Windows temporary file path
const tempFilePath = path.join('C:\\Windows\\Temp', 'audio.mp3');

export async function POST(request: Request) {
  try {
    const blob = await request.blob();
    
    // Convert Blob to a Uint8Array before writing to file
    fs.writeFileSync(tempFilePath, new Uint8Array(await blob.arrayBuffer()));
  const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    const answer = transcription.text;

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error processing audio transcription:', error);
    return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
  }
}