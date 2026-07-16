// ui.ts — tiny shared DOM helpers: toast, long-press gate (GRN-1), share/copy (SHR-3/4).

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

// GRN-1 — 2 s continuous press opens; a plain tap does nothing.
export function attachLongPress(el: HTMLElement, ms: number, onLongPress: () => void): void {
  let timer: number | undefined;
  const cancel = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    cancel();
    timer = window.setTimeout(() => {
      timer = undefined;
      onLongPress();
    }, ms);
  });
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) {
    el.addEventListener(ev, cancel);
  }
  el.addEventListener('contextmenu', (e) => e.preventDefault());
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
