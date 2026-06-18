import { UserConfig } from 'vite';

// We import the config as a plain object via dynamic import to avoid side effects.
// Since defineConfig is an identity function in Vite, we can inspect the resolved object.
import config from './vite.config';

describe('vite.config', () => {
  const resolvedConfig = config as UserConfig;

  it('should export a valid config object', () => {
    expect(resolvedConfig).toBeDefined();
    expect(typeof resolvedConfig).toBe('object');
    expect(resolvedConfig).not.toBeNull();
  });

  it('should set build.outDir to "dist-web"', () => {
    expect(resolvedConfig.build).toBeDefined();
    expect(resolvedConfig.build!.outDir).toBe('dist-web');
  });

  it('should set build.emptyOutDir to true', () => {
    expect(resolvedConfig.build).toBeDefined();
    expect(resolvedConfig.build!.emptyOutDir).toBe(true);
  });

  it('should set server.port to 5173', () => {
    expect(resolvedConfig.server).toBeDefined();
    expect(resolvedConfig.server!.port).toBe(5173);
  });

  it('should set server.open to true', () => {
    expect(resolvedConfig.server).toBeDefined();
    expect(resolvedConfig.server!.open).toBe(true);
  });
});