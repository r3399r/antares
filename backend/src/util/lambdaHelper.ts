import { HttpError } from 'src/model/error/HttpError';
import { LambdaOutput } from 'src/model/Lambda';
import { Pagination } from 'src/model/Pagination';

export const successOutput = <T>(res?: T): LambdaOutput => {
  if (
    res &&
    'paginate' in (res as unknown as Pagination<T>) &&
    'data' in (res as unknown as Pagination<T>)
  ) {
    const pagination = res as unknown as Pagination<T>;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work,
        'x-pagination-count': pagination.paginate.count.toString(),
        'x-pagination-limit': pagination.paginate.limit.toString(),
        'x-pagination-offset': pagination.paginate.offset.toString(),
      },
      body: JSON.stringify(pagination.data),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work,
    },
    body: JSON.stringify(res),
  };
};

export const errorOutput = (e: unknown): LambdaOutput => {
  const error: HttpError = e as HttpError;

  return {
    statusCode: error.status ?? 500,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      status: error.status,
      name: error.name,
      message: error.message,
    }),
  };
};
