type StandardFetcher = <T>(url: string, params?: RequestInit) => Promise<T>;

const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
};

class FetcherError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error instanceof Object && 'message' in error)
    return error['message'] as string;
  return 'Something went wrong';
};

const extractError = async (response: Response) => {
  try {
    const error: unknown = await response.json();
    return extractErrorMessage(error);
  } catch {
    return 'An error occurred while fetching the data';
  }
};

export const standardFetcher: StandardFetcher = async <T>(
  url: string,
  params?: RequestInit,
) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
  });

  if (!response.ok) {
    throw new FetcherError(await extractError(response), response.status);
  }

  return (await response.json()) as T;
};
