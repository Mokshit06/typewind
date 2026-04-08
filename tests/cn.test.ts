import { cn } from '../packages/typewind/src/cn';
import { typewind_id } from '../packages/typewind/src/runtime';

describe('cn', () => {
  test('merges simple class strings', () => {
    expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });

  test('handles tailwind merge conflicts', () => {
    // twMerge should resolve conflicting classes
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  test('handles falsy values', () => {
    expect(cn('px-2', undefined, null, false, 'py-1')).toBe('px-2 py-1');
  });

  test('handles empty call', () => {
    expect(cn()).toBe('');
  });

  test('handles arrays of classes', () => {
    expect(cn(['px-2', 'py-1'], 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });

  test('handles conditional classes via clsx pattern', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active'
    );
  });

  test('handles object syntax from clsx', () => {
    expect(cn({ 'px-2': true, 'py-1': false, 'bg-red-500': true })).toBe(
      'px-2 bg-red-500'
    );
  });

  test('converts typewind proxy to string via typewind_id check', () => {
    // Create a mock typewind-like object with typewind_id and toString
    const mockTw = Object.assign(() => {}, {
      [typewind_id]: true,
      toString() {
        return 'border rounded';
      },
    });

    expect(cn(mockTw as any)).toBe('border rounded');
  });

  test('does not call toString on non-typewind functions', () => {
    // A regular function without typewind_id should be treated normally by clsx
    const regularFn = () => {};
    // clsx ignores functions, so this should result in empty string
    expect(cn(regularFn as any)).toBe('');
  });

  test('merges typewind proxy classes with regular classes', () => {
    const mockTw = Object.assign(() => {}, {
      [typewind_id]: true,
      toString() {
        return 'px-2 py-1';
      },
    });

    expect(cn(mockTw as any, 'px-4 bg-red-500')).toBe(
      'py-1 px-4 bg-red-500'
    );
  });

  test('handles mixed typewind and regular inputs', () => {
    const mockTw = Object.assign(() => {}, {
      [typewind_id]: true,
      toString() {
        return 'text-blue-500';
      },
    });

    expect(cn('bg-white', mockTw as any, { 'font-bold': true })).toBe(
      'bg-white text-blue-500 font-bold'
    );
  });
});
