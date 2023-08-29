import { bindings } from 'src/bindings';
import { InstantService } from 'src/logic/InstantService';
import { LambdaEvent } from 'src/model/Lambda';

const instant = async (event: LambdaEvent) => {
  const service = bindings.get(InstantService);

  switch (event.httpMethod) {
    case 'GET':
      return await service.getInstants();
  }

  throw new Error('unexpected httpMethod');
};

export default instant;
