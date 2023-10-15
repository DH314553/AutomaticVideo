// All configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli
// ! The configuration file does only apply if you render via the CLI !

import {Config as RederConfig} from '@remotion/cli/config';

RederConfig.setStillImageFormat("jpeg");
RederConfig.setOverwriteOutput(true);

export const Config = {
  awsLambda: true,
};
