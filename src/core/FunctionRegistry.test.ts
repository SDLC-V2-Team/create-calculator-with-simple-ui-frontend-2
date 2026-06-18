import { FunctionRegistry } from './FunctionRegistry';
import type { OperationDefinition } from './types';

const makeOp = (name: string, category = 'basic'): OperationDefinition => ({
  name,
  category,
  execute: (...args: number[]) => args[0] ?? 0,
});

describe('FunctionRegistry', () => {
  let registry: FunctionRegistry;

  beforeEach(() => {
    registry = new FunctionRegistry();
  });

  it('registers an operation and retrieves it by name (happy path)', () => {
    const op = makeOp('add');
    registry.register(op);

    expect(registry.has('add')).toBe(true);
    expect(registry.get('add')).toBe(op);
  });

  it('registers many operations at once via registerAll (happy path)', () => {
    const ops = [makeOp('add'), makeOp('subtract'), makeOp('multiply')];
    registry.registerAll(ops);

    expect(registry.has('add')).toBe(true);
    expect(registry.has('subtract')).toBe(true);
    expect(registry.has('multiply')).toBe(true);
    expect(registry.list()).toHaveLength(3);
  });

  it('lists operations filtered by category (happy path)', () => {
    registry.registerAll([
      makeOp('sin', 'scientific'),
      makeOp('cos', 'scientific'),
      makeOp('add', 'basic'),
    ]);

    const scientific = registry.list('scientific');
    expect(scientific).toHaveLength(2);
    expect(scientific.map((op) => op.name)).toEqual(
      expect.arrayContaining(['sin', 'cos'])
    );

    const basic = registry.list('basic');
    expect(basic).toHaveLength(1);
    expect(basic[0].name).toBe('add');
  });

  it('unregisters an existing operation and returns true (happy path)', () => {
    registry.register(makeOp('add'));
    const removed = registry.unregister('add');

    expect(removed).toBe(true);
    expect(registry.has('add')).toBe(false);
    expect(registry.get('add')).toBeUndefined();
  });

  it('throws when registering a duplicate operation name (error path)', () => {
    registry.register(makeOp('add'));

    expect(() => registry.register(makeOp('add'))).toThrow(
      'Operation "add" is already registered.'
    );
  });

  it('returns false for has() and undefined for get() on unknown operations (edge case)', () => {
    expect(registry.has('nonexistent')).toBe(false);
    expect(registry.get('nonexistent')).toBeUndefined();
    expect(registry.unregister('nonexistent')).toBe(false);
    expect(registry.list()).toHaveLength(0);
  });
});