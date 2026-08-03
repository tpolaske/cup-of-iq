// ui.ts — tiny shared DOM helpers: toast, share/copy (SHR-3/4).

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
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied!'); // SHR-4
  } catch {
    showToast('Could not copy');
  }
}

// SHR-3/4 — native share sheet when available; clipboard fallback otherwise.
export async function shareResult(text: string): Promise<void> {
  const nav = navigator as Navigator & { share?: (data: { text: string }) => Promise<void> };
  if (typeof nav.share === 'function') {
    try {
      await nav.share({ text });
      return;
    } catch {
      // Sheet dismissed or unsupported payload — fall through to copy.
    }
  }
  await copyText(text);
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
