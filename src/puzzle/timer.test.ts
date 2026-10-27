import { describe, expect, it } from 'vitest';
import { createRoundTimer, pauseWhileHidden } from './timer';

function clock(start = 1000) {
  let t = start;
  return { now: () => t, advance: (ms: number) => void (t += ms) };
}

describe('createRoundTimer (ANS-4)', () => {
  it('measures start → stop in seconds', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(27_500);
    expect(t.stop()).toBe(27.5);
  });

  it('start is idempotent: re-rendering a screen does not restart the clock', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(5000);
    t.start();
    c.advance(5000);
    expect(t.stop()).toBe(10);
  });

  it('pause excludes hidden time; resume continues', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(4000);
    t.pause();
    c.advance(60_000); // phone locked
    t.resume();
    c.advance(3000);
    expect(t.stop()).toBe(7);
  });

  it('pause/resume are idempotent and safe before start', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.pause();
    t.resume();
    expect(t.running).toBe(false);
    t.start();
    c.advance(1000);
    t.pause();
    t.pause();
    c.advance(5000);
    t.resume();
    t.resume();
    c.advance(1000);
    expect(t.stop()).toBe(2);
  });

  it('stop freezes the value; later calls cannot change it', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(9000);
    expect(t.stop()).toBe(9);
    c.advance(9000);
    t.resume();
    t.start();
    expect(t.stop()).toBe(9);
    expect(t.running).toBe(false);
  });

  it('stopping while paused (page hidden at lock-in) keeps the accumulated time', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(6000);
    t.pause();
    c.advance(10_000);
    expect(t.stop()).toBe(6);
  });

  it('stop before start returns null (no round time recorded)', () => {
    expect(createRoundTimer(true, clock().now).stop()).toBeNull();
  });

  it('untimed (Sunday): never runs and never records a time', () => {
    const c = clock();
    const t = createRoundTimer(false, c.now);
    t.start();
    c.advance(30_000);
    expect(t.running).toBe(false);
    expect(t.stop()).toBeNull();
  });

  it('a backwards clock step never yields negative time', () => {
    const c = clock(5000);
    const t = createRoundTimer(true, c.now);
    t.start();
    c.advance(-2000);
    expect(t.stop()).toBe(0);
  });
});

describe('pauseWhileHidden', () => {
  function fakeDoc() {
    const listeners = new Set<() => void>();
    return {
      hidden: false,
      addEventListener: (_: 'visibilitychange', l: () => void) => void listeners.add(l),
      removeEventListener: (_: 'visibilitychange', l: () => void) => void listeners.delete(l),
      fire() { listeners.forEach((l) => l()); },
      count: () => listeners.size,
    };
  }

  it('pauses on hidden, resumes on visible, and detaches cleanly', () => {
    const c = clock();
    const t = createRoundTimer(true, c.now);
    const doc = fakeDoc();
    t.start();
    const detach = pauseWhileHidden(t, doc);
    c.advance(2000);
    doc.hidden = true; doc.fire();
    c.advance(50_000);
    doc.hidden = false; doc.fire();
    c.advance(3000);
    expect(t.stop()).toBe(5);
    detach();
    expect(doc.count()).toBe(0);
  });
});
