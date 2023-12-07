import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';
import { promisify } from 'util';

import {
  SPEAKER,
  SPEAKER_TYPE,
  VideoConfig,
} from '../src/yukkuri/yukkuriVideoConfig';
import AquesTalk10, { gVoice_F1 } from 'node-aquestalk10';
import AqKanji2Koe from 'node-aqkanji2koe';

const config = {
  Aquestalk10DevKey: "2B69-C613-9194-A132",
  AqKanji2KoeSetDevKey: "E49E-4038-1EBB-AF87",
  aquestalkPath: '/Users/daisaku/Desktop/aqtk10_mac/AquesTalk.framework/Versions/A/AquesTalk',
  aqkanji2koePath: '/Users/daisaku/Desktop/aqk2k_mac/AqKanji2Koe.framework/Versions/A/AqKanji2Koe',
  aqUsrDicPath: '/Users/daisaku/Desktop/aqk2k_mac/AqUsrDic.framework/Versions/A/AqUsrDic',
  aqDicLargePath: '/Users/daisaku/Desktop/aqk2k_mac/aq_dic_large',
  espeakCommand: 'espeak',
  ffmpegCommand: 'ffmpeg',
  audioOutputPath: './public/audio/yukkuri/',
  speed: 115,
};

const aquestalk = new AquesTalk10(config.aquestalkPath);
aquestalk.AquesTalkSetDevKey(config.Aquestalk10DevKey);

const aqkanji2koe = new AqKanji2Koe(config.aqkanji2koePath, config.aqUsrDicPath, config.aqDicLargePath);
aqkanji2koe.AqKanji2KoeSetDevKey(config.AqKanji2KoeSetDevKey);

const ReimuVoice = {
  base: 0,
  volume: 100,
  pitch: 95,
  accent: 80,
  lmd: 110,
  fsc: 103,
  speed: config.speed,
};

const MarisaVoice = { ...gVoice_F1, base: 0, speed: config.speed, lmd: 130, pitch: 75 };

const execSyncAsync = promisify(execSync);

function executeCommand(command: string): Buffer {
  try {
    return execSync(command);
  } catch (error) {
    console.error(`Error executing command: ${command}\n${error}`);
    throw error;
  }
}

export async function generateYukkuriAudio(text: string, speaker: SPEAKER_TYPE): Promise<string | null> {
  try {
    const id = uuidv4().replaceAll('-', '');
    await execSyncAsync('python3 script.py');
    const scriptText = process.env.SCRIPT_TEXT || "Fallback text";
    const result = aquestalk.AquesTalkSyntheUtf16(
        speaker === SPEAKER.reimu ? ReimuVoice : MarisaVoice,
        text = scriptText
    );
    const filename = `${id}.wav`;
    const espeakCommand = `${config.espeakCommand} -b 1 "${result}" --stdout | ${config.ffmpegCommand} -i - -ar 44100 -ac 2 -ab 192k -f wav - > ${config.audioOutputPath}${filename}`;
    executeCommand(espeakCommand);
    return id;
  } catch (error) {
    console.error(`Error generating Yukkuri audio: ${error}`);
    return null;
  }
}

export async function generateYukkuriAudios(videoConfig: VideoConfig, forceGenerate: boolean) {
  const allPromises = [];
  for (const section of videoConfig.sections) {
    for (const talk of section.talks) {
      if ((forceGenerate || !talk.id) && talk.text.length > 0) {
        const text = aqkanji2koe.AqKanji2KoeConvertUtf8(talk.text);
        try {
          const id = await generateYukkuriAudio(text, talk.speaker);
          if (id) talk.id = id;
        } catch (error) {
          console.error(`Error in generateYukkuriAudios: ${error}`);
        }
        allPromises.push(generateYukkuriAudio(text, talk.speaker));
      }
    }
  }

  try {
    await Promise.all(allPromises);
    // Resultsには各Promiseの結果が格納されている
  } catch (error) {
    console.error(`Error in generateYukkuriAudios: ${error}`);
  }
}
