import { AddEntryRequestExampleParams, AddEntryRequestTermParams, NewEntryParams } from '../types';
import { getAudioUrl } from './textToSpeech';

export const termResolver = async (collectionId: string, entryId: string, params: AddEntryRequestTermParams): Promise<NewEntryParams['term']> => {
  const audioPath = `${collectionId}/${entryId}_term`;
  return {
    ...params,
    // audioUrl: (params.audioUrl && !params.audioUrl.includes(audioPath)) ? params.audioUrl : await getAudioUrl(params.text, params.lang, audioPath)
    audioUrl: params.audioUrl ?? await getAudioUrl(params.text, params.lang, audioPath)
  };
};

export const examplesResolver = (collectionId: string, entryId: string, examples: AddEntryRequestExampleParams[]): Promise<NewEntryParams['examples']> => (
  Promise.all(examples.map(async (example, i) => {
    const audioPath = `${collectionId}/${entryId}_example_${i}`;
    return {
      ...example,
      // audioUrl: (example.audioUrl && !example.audioUrl.includes(audioPath)) ? example.audioUrl : await getAudioUrl(example.text, example.lang, audioPath),
      audioUrl: example.audioUrl ?? await getAudioUrl(example.text, example.lang, audioPath),
      imageUrls: example.imageUrls ?? [],
      notes: example.notes ?? ''
    };
  }))
);