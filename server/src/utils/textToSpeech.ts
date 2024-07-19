import { readFileSync } from 'fs';
import { auth } from 'google-auth-library';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { google } from '@google-cloud/text-to-speech/build/protos/protos';
import { PassThrough } from 'stream';
import { bucket } from '../fbAdmin';

if (!process.env.GOOGLE_CREDENTIALS) {
  process.env.GOOGLE_CREDENTIALS = readFileSync('googleCredentials.json', 'utf-8');
}
const authClient = auth.fromJSON(JSON.parse(process.env.GOOGLE_CREDENTIALS))

const voices: { [key: string]: google.cloud.texttospeech.v1.IVoiceSelectionParams } = {
  en: { languageCode: 'en-GB', name: 'en-GB-Wavenet-B' },
  da: { languageCode: 'da-DK', name: 'da-DK-Wavenet-C' },
  fi: { languageCode: 'fi-FI', name: 'fi-FI-Wavenet-A' },
  ja: { languageCode: 'ja-JP', name: 'fi-FI-Wavenet-D' },
};

const audioConfig: google.cloud.texttospeech.v1.IAudioConfig = {
  audioEncoding: 'MP3', speakingRate: 1.2
};

const ttsClient = new TextToSpeechClient({ authClient });

export const uploadAudio = async (audioContent: string | Uint8Array, path: string) => new Promise<string>((resolve, reject) => {
  const file = bucket.file(`audio/${path}.mp3`);

  const passthroughStream = new PassThrough();
  passthroughStream.write(audioContent);
  passthroughStream.end();

  passthroughStream.pipe(file.createWriteStream()).on('finish', async () => {
    await file.makePublic();
    resolve(file.publicUrl());
  }).on('error', err => {
    return reject(err);
  });
});

export const getAudioUrl = async (text: string, lang: string, path: string) => {
  const [{ audioContent }] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: voices[lang] ?? { languageCode: lang },
    audioConfig
  });
  if (!audioContent) throw new Error();
  return uploadAudio(audioContent, path);
};


