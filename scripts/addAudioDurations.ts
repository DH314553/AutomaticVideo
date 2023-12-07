import { VideoConfig } from '../src/yukkuri/yukkuriVideoConfig';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const AUDIO_SETTINGS = {
  ar: 44100,
  ac: 2,
  ab: '192k',
  format: 'wav',
};

export async function addAudioDurations(videoConfig: VideoConfig) {
  try {
    for (const section of videoConfig.sections) {
      const { talks } = section;

      for (let i = 0; i < section.talks.length; i++) {
        const currentTalk = talks[i];
        if (currentTalk.id || currentTalk.ids) {
          const id = currentTalk.ids ? currentTalk.ids[0] : currentTalk.id;
          await execAsync(
              `espeak -b 1 "${currentTalk}" --stdout | ffmpeg -i - -ar ${
                  AUDIO_SETTINGS.ar
              } -ac ${AUDIO_SETTINGS.ac} -ab ${
                  AUDIO_SETTINGS.ab
              } -f ${AUDIO_SETTINGS.format} - > ./public/audio/yukkuri/${id}.wav`
          );
        }
      }
    }
    console.log('Audio generation completed successfully.');
  } catch (error) {
    console.error(`Error generating audio: ${error}`);
  }
}
