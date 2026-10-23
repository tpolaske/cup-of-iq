// shared/share.ts — Web Share → clipboard plumbing only (SHR-3/4). The text each
// mode builds, and the toast UI, stay mode-specific. No DOM access here: the
// navigator is injected so this is testable under Node.

export type ShareOutcome = 'shared' | 'copied' | 'failed';

interface NavLike {
  share?: (data: { text: string }) => Promise<void>;
  clipboard?: { writeText(text: string): Promise<void> };
}

export async function copyToClipboard(text: string, nav: NavLike = navigator): Promise<boolean> {
  try {
    if (!nav.clipboard) return false;
    await nav.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Native share sheet when available; clipboard fallback otherwise (also when
// the sheet is dismissed or rejects the payload — matches the shipped behavior).
export async function shareOrCopy(text: string, nav: NavLike = navigator): Promise<ShareOutcome> {
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ text });
      return 'shared';
    } catch {
      // fall through to copy
    }
  }
  return (await copyToClipboard(text, nav)) ? 'copied' : 'failed';
}
