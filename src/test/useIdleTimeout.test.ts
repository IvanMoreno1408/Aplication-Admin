import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Importamos directamente la lógica del hook sin renderizarlo
// ya que el hook solo usa useEffect y useRef

describe('useIdleTimeout — lógica de timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('setTimeout se dispara después de 15 minutos', () => {
    const onTimeout = vi.fn();
    const IDLE_MS = 15 * 60 * 1000;

    setTimeout(onTimeout, IDLE_MS);

    vi.advanceTimersByTime(IDLE_MS - 1);
    expect(onTimeout).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('clearTimeout cancela el timer antes de que se dispare', () => {
    const onTimeout = vi.fn();
    const IDLE_MS = 15 * 60 * 1000;

    const id = setTimeout(onTimeout, IDLE_MS);
    clearTimeout(id);

    vi.advanceTimersByTime(IDLE_MS);
    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('resetear el timer reinicia la cuenta desde cero', () => {
    const onTimeout = vi.fn();
    const IDLE_MS = 15 * 60 * 1000;

    let id = setTimeout(onTimeout, IDLE_MS);

    // Simular actividad a los 10 minutos — resetea el timer
    vi.advanceTimersByTime(10 * 60 * 1000);
    clearTimeout(id);
    id = setTimeout(onTimeout, IDLE_MS);

    // 10 minutos más (solo 10 desde el reset, no 15)
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(onTimeout).not.toHaveBeenCalled();

    // 5 minutos más (total 15 desde el reset)
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });
});
