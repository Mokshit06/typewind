import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { typewind_id } from './runtime';

export function cn(...inputs: ClassValue[]) {
  return twMerge(
    clsx(
      inputs.map((input) => {
        if (!input) return input;
        if (typeof input === 'function' && (input as any)[typewind_id]) {
          return input.toString();
        }

        return input;
      })
    )
  );
}
