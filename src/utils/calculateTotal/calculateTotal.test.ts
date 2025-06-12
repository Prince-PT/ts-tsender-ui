import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
  it('should return 0 for empty input', () => {
    expect(calculateTotal('')).toBe(0);
    expect(calculateTotal(null as unknown as string)).toBe(0);
    expect(calculateTotal(undefined as unknown as string)).toBe(0);
  });

  it('should calculate sum of comma-separated numbers', () => {
    expect(calculateTotal('1,2,3')).toBe(6);
    expect(calculateTotal('10, 20, 30')).toBe(60);
    expect(calculateTotal('0.1, 0.2, 0.3')).toBeCloseTo(0.6);
  });

  it('should calculate sum of newline-separated numbers', () => {
    expect(calculateTotal('1\n2\n3')).toBe(6);
    expect(calculateTotal('10\n20\n30')).toBe(60);
  });

  it('should handle mixed separators (commas and newlines)', () => {
    expect(calculateTotal('1,2\n3')).toBe(6);
    expect(calculateTotal('10\n20,30')).toBe(60);
  });

  it('should ignore empty entries', () => {
    expect(calculateTotal('1,,2,3')).toBe(6);
    expect(calculateTotal('1,\n,2,3')).toBe(6);
    expect(calculateTotal('\n1,2,3\n')).toBe(6);
  });

  it('should handle whitespace around numbers', () => {
    expect(calculateTotal(' 1, 2 , 3 ')).toBe(6);
    expect(calculateTotal(' 10 \n 20 \n 30 ')).toBe(60);
  });

  it('should filter out non-numeric values', () => {
    expect(calculateTotal('1,a,2,b,3')).toBe(6);
    expect(calculateTotal('10,twenty,30')).toBe(40);
  });

  it('should handle decimal numbers correctly', () => {
    expect(calculateTotal('1.5,2.5,3.5')).toBeCloseTo(7.5);
    expect(calculateTotal('0.1,0.2,0.3')).toBeCloseTo(0.6);
  });

  it('should handle negative numbers', () => {
    expect(calculateTotal('-1,-2,-3')).toBe(-6);
    expect(calculateTotal('-10,20,-30')).toBe(-20);
  });

  it('should handle mixed positive and negative numbers', () => {
    expect(calculateTotal('-1,2,-3,4')).toBe(2);
    expect(calculateTotal('-10.5,20.5,-30.5')).toBe(-20.5);
  });
});