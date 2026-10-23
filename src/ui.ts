// ui.ts — tiny shared DOM helpers: toast, share/copy (SHR-3/4).

import { copyToClipboard, shareOrCopy } from './shared/share';

let toastEl: HTMLElement | null = null;

export function showToast(message: string): void {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.style.opacity = '1';
  window.setTimeout(() => {
    if (toastEl) toastEl.style.opacity = '0';
  }, 1400);
}

export async function copyText(text: string): Promise<void> {
  showToast((await copyToClipboard(text)) ? 'Copied!' : 'Could not copy'); // SHR-4
}

// SHR-3/4 — plumbing lives in shared/share.ts; only the toast is mode-specific.
export async function shareResult(text: string): Promise<void> {
  const outcome = await shareOrCopy(text);
  if (outcome === 'copied') showToast('Copied!');
  else if (outcome === 'failed') showToast('Could not copy');
}

// GRN-1 — the grown-ups entry control. A plain tap: the gate was a 2 s
// long-press until sign-off #17 found it unusable one-handed on a phone. The
// panel is grown-up-facing text, not a secret; the only destructive action in
// it (reset) keeps its own confirm.
export function grownupsLink(onOpen: () => void): HTMLButtonElement {
  const b = document.createElement('button');
  b.className = 'grown-link';
  b.textContent = 'For grown-ups';
  b.addEventListener('click', onOpen);
  return b;
}
