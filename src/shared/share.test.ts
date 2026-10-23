import { describe, expect, it, vi } from 'vitest';
import { copyToClipboard, shareOrCopy } from './share';

describe('shared/share (SHR-3/4 plumbing)', () => {
  it('uses the native share sheet when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    expect(await shareOrCopy('hi', { share, clipboard: { writeText } })).toBe('shared');
    expect(share).toHaveBeenCalledWith({ text: 'hi' });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('falls back to the clipboard when the sheet is dismissed/rejects', async () => {
    const share = vi.fn().mockRejectedValue(new Error('AbortError'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareOrCopy('hi', { share, clipboard: { writeText } })).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('hi');
  });

  it('copies when Web Share is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await shareOrCopy('hi', { clipboard: { writeText } })).toBe('copied');
  });

  it('reports failed when neither path works', async () => {
    expect(await shareOrCopy('hi', {})).toBe('failed');
    expect(await copyToClipboard('hi', { clipboard: { writeText: () => Promise.reject(new Error('denied')) } })).toBe(false);
  });
});
