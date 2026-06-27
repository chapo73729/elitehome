/* Tiny global toast emitter — no provider needed. */
export type Toast = { id: number; msg: string; icon?: string };

const subs = new Set<(t: Toast) => void>();
let counter = 0;

export function toast(msg: string, icon?: string) {
  counter += 1;
  const t: Toast = { id: counter, msg, icon };
  subs.forEach((s) => s(t));
}

export function onToast(fn: (t: Toast) => void) {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** Copy text to clipboard with graceful fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}
