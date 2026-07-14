export type ApiError = {
  code: string;
  message: string;
};

export type ApiEnvelope<T, TMeta = Record<string, unknown>> =
  | {
      data: T;
      error: null;
      meta: TMeta;
    }
  | {
      data: null;
      error: ApiError;
      meta?: TMeta;
    };

export function successResponse<T, TMeta = Record<string, unknown>>(data: T, meta: TMeta): ApiEnvelope<T, TMeta> {
  return {
    data,
    error: null,
    meta,
  };
}

export function errorResponse<TMeta = Record<string, unknown>>(
  code: string,
  message: string,
  meta?: TMeta,
): ApiEnvelope<null, TMeta> {
  return {
    data: null,
    error: {
      code,
      message,
    },
    meta,
  };
}
