import React, { useState, useEffect } from 'react';
import { Sequence } from 'remotion'; 
import { SPEAKER } from '../src/yukkuri/yukkuriVideoConfig';
import { generateYukkuriAudios } from '../scripts/generateYukkuriAudios';
import { FirstVideoConfig } from './firstvideo';
import { VideoConfig } from '../src/yukkuri/yukkuriVideoConfig';
import { YukkuriVideo } from '../src/YukkuriVideo';
// 型の定義とデフォルト値の関数

// type VideoConfigType = {
//   title: string;
//   bgmSrc: string;
//   backgroundVideo: string;
//   afterMovie: string;
//   afteMovieDelay: number;
//   fromFramesMap: Record<string, number>;
//   talks: Array<{ text: string; speaker: string; audioDurationFrames: number; id: number; }>;
//   totalFrames: string;
//   kuchipakuMap: { frames: Array<number>; amplitude: Array<number> };
//   beforeMovieFrames: number;
//   afterMovieFrames: number;
//   reimuKuchipakuMap: { frames: Array<number>; amplitude: Array<number> };
//   marisaKuchipakuMap: { frames: Array<number>; amplitude: Array<number> };
// };

type YukkuriVideoProps = {
  videoConfig: VideoConfig
  sequences? : React.ReactNode;
};

// もしくは動的に生成
type Condition = (index: number) => boolean;

const generateFromFramesMap = (condition: Condition, values: number[]): Record<number, number> => {
  const map: Record<number, number> = {};
  values.forEach((value, index) => {
    if (condition(index)) {
      map[index] = value;
    }
  });
  return map;
};

const condition: Condition = (index) => index % 2 === 0;
const values = [30, 80, 127, 204, 280];
const generatedMap = generateFromFramesMap(condition, values);

const generateDefaultVideoConfig = async (scriptText: string, time: string) => {
  scriptText = process.env.SCRIPT_TEXT || "Fallback text";
  time = process.env.TIME || "Fallback number";

  return {
    title: 'イントロダクション',
    bgmSrc: '/audio/bgm/honobono-wartz.wav',
    backgroundVideo: '/video/cyber-bg.mp4',
    afterMovie: '/video/yukkuri-opening.mp4',
    afteMovieDelay: 0,
    fromFramesMap: generatedMap, // generatedMap は事前に定義されているものと仮定
    talks: [
      { text: scriptText.split('\n')[0], speaker: SPEAKER.reimu, audioDurationFrames: 25, id: 1 },
      { text: scriptText.split('\n')[1], speaker: SPEAKER.marisa, audioDurationFrames: 25, id: 2 },
      { text: scriptText.split('\n').slice(2).join('\n'), speaker: 'reimuAndMarisa', audioDurationFrames: 25, id: 3 }
    ],
    totalFrames: time,
    kuchipakuMap: { frames: [], amplitude: [] },
    beforeMovieFrames: 0,
    afterMovieFrames: 190,
    reimuKuchipakuMap: { frames: [0], amplitude: [6] },
    marisaKuchipakuMap: { frames: [0], amplitude: [5] },
  };
};


export const MyVideo: React.FC<YukkuriVideoProps> = ({ videoConfig }) => {

  const [localVideoConfig, setLocalVideoConfig] = useState<VideoConfig | null>(null);
  // コンポーネントの中身
  const [reimuTalk, setReimuTalk] = useState<string | null>(null);
  const [marisaTalk, setMarisaTalk] = useState<string | null>(null);
  const [reimuAndMarisaTalk, setReimuAndMarisaTalk] = useState<string | null>(null);

  useEffect(() => {
    const scriptText: string = process.env.SCRIPT_TEXT || "Fallback text";
    const time: string = process.env.TIME || "Fallback number";

    // const videoConfig = FirstVideoConfig
    const fetchData = async () => {
      const fetchedConfig = FirstVideoConfig; // この部分は実際のデータ取得に合わせてください。
      await generateYukkuriAudios(fetchedConfig, true);
      generateDefaultVideoConfig(scriptText, time);
      setReimuTalk(videoConfig.sections[0].talks[0].id ?? null);
      setMarisaTalk(videoConfig.sections[0].talks[1].id ?? null);
      setReimuAndMarisaTalk(videoConfig.sections[0].talks[2].id ?? null);

      // ステート更新
      setLocalVideoConfig(fetchedConfig);
    };
    fetchData();
  }, []);

  return (
    <>
       {localVideoConfig ? <YukkuriVideo videoConfig={localVideoConfig} /> : 'Loading...'}
       <div> 
        <Sequence from={0} durationInFrames={100}>
             <div>
               <h2>Reimu:</h2>
               <audio src={`/public/audio/yukkuri/${reimuTalk}.wav`} controls />
             </div>
           </Sequence>
           <Sequence from={100} durationInFrames={100}>
             <div>
               <h2>Marisa:</h2>
               <audio src={`/public/audio/yukkuri/${marisaTalk}.wav`} controls />
             </div>
           </Sequence>
     
           <Sequence from={200} durationInFrames={100}>
             <div>
               <h2>Reimu and Marisa:</h2>
               <audio src={`/public/audio/yukkuri/${reimuAndMarisaTalk}.wav`} controls />
             </div>
           </Sequence>
       </div>
    </>
  );
};
