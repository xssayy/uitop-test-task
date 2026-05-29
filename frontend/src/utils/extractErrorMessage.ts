import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/api';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
  }
  return 'Something went wrong';
}
