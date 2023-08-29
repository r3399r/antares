import { LambdaContext, LambdaEvent } from 'src/model/Lambda';
import instant from './routes/instant';
import { errorOutput, successOutput } from './util/lambdaHelper';

export const handler = async (event: LambdaEvent, _context?: LambdaContext) => {
  try {
    console.log(event);
    let res: any;

    const category = event.resource.split('/')[2];
    switch (category) {
      case 'instant':
        res = await instant(event);
        break;
    }

    return successOutput(res);
  } catch (e) {
    console.log(e);

    return errorOutput(e);
  }
};
