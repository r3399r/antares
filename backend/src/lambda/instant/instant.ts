import { bindings } from 'src/bindings';
import { InstantService } from 'src/logic/InstantService';
import { PostInstantRequest } from 'src/model/api/Instant';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/LambdaOutput';

export async function instant(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: InstantService | null = null;
  try {
    service = bindings.get(InstantService);

    let res: unknown;

    switch (event.resource) {
      case '/api/instant':
        res = await apiInstant(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  } finally {
    await service?.cleanup();
  }
}

async function apiInstant(event: LambdaEvent, service: InstantService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getInstants();
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.addInstant(JSON.parse(event.body) as PostInstantRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}
