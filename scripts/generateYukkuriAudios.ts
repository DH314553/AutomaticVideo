import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

import {
  SPEAKER,
  SPEAKER_TYPE,
  VideoConfig,
} from '../src/yukkuri/yukkuriVideoConfig';
import AquesTalk10, {gVoice_F1} from 'node-aquestalk10';
import AqKanji2Koe from 'node-aqkanji2koe';
const { Aquestalk10DevKey, AqKanji2KoeSetDevKey } = require('.aquest-keys');
const aquestalk = new AquesTalk10(
  './vendor/AquesTalk.framework/Versions/A/AquesTalk'
);
aquestalk.AquesTalkSetDevKey(Aquestalk10DevKey);
const aqkanji2koe = new AqKanji2Koe(
  './vendor/AqKanji2Koe.framework/Versions/A/AqKanji2Koe',
  './vendor/AqUsrDic.framework/Versions/A/AqUsrDic',
  './vendor/aq_dic_large'
);
aqkanji2koe.AqKanji2KoeSetDevKey(AqKanji2KoeSetDevKey);

const SPEED = 115;

const ReimuVoice = {
  base: 0, // 声種
  volume: 100, // 音量
  pitch: 95, // 高さ
  accent: 80, // アクセント
  lmd: 110, // 声質
  fsc: 103, // 音程
  speed: SPEED,
};
const MarisaVoice = {...gVoice_F1, base: 0, speed: SPEED, lmd: 130, pitch: 75};

// ... (省略: 各種ライブラリと設定のインポート)

const execAsync = promisify(exec);

export async function generateYukkuriAudio(text: string, speaker: SPEAKER_TYPE): Promise<string | null> {
  try {
    const id = uuidv4().replaceAll('-', '');
    await execAsync('python script.py');
    const scriptText = process.env.SCRIPT_TEXT || "Fallback text";
    const result = aquestalk.AquesTalkSyntheUtf16(
      speaker === SPEAKER.reimu ? ReimuVoice : MarisaVoice,
      text = scriptText
    );
    const filename = `${id}.wav`;
    fs.writeFileSync(`./public/audio/yukkuri/${filename}`, result);
    return id;
  } catch (error) {
    console.error(`Error executing script: ${error}`);
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
    // resultsには各Promiseの結果が格納されている
  } catch (error) {
    console.error(`Error in generateYukkuriAudios: ${error}`);
  }
}

