/* eslint-disable @typescript-eslint/no-explicit-any */

import { PluginManager } from "./plugin-manager";
import { IEventChain, PragmaticEventChain } from "./event-chain";
import { PluginConfig } from "./plugin-config";
import { ChainPluginBase } from "./plugin";

class TestPluginOne extends ChainPluginBase {
  constructor(chain: IEventChain) {
    super(chain);
  }

  public async initialize(): Promise<void> {
    return;
  }
}

class TestPluginTwo extends ChainPluginBase {
  constructor(chain: IEventChain) {
    super(chain);
  }

  public async initialize(): Promise<void> {
    return;
  }
}

describe("PluginManager", () => {
  it("should start plugins", async () => {
    const chain = new PragmaticEventChain();
    const configHook = () => {
      const config: PluginConfig = {
        plugins: {
          test: { TestPluginOne: true, TestPluginTwo: true },
        },
      };
      const modules = { TestPluginOne, TestPluginTwo };
      return { config, modules };
    };

    let result: any;
    chain.subscribe("plugin-manager-plugins-loaded", async (plugins: any) => {
      result = plugins;
    });

    const sut = new PluginManager(chain);
    await sut.init(configHook);

    expect(result).toBeDefined();

    expect(result.TestPluginOne).toBeDefined();
    expect(result.TestPluginTwo).toBeDefined();
  });

  it("should only start activated plugins", async () => {
    const chain = new PragmaticEventChain();
    const configHook = () => {
      const config: PluginConfig = {
        plugins: {
          test: { TestPluginOne: true, TestPluginTwo: false },
        },
      };
      const modules = { TestPluginOne, TestPluginTwo };
      return { config, modules };
    };

    let result: any;
    chain.subscribe("plugin-manager-plugins-loaded", async (plugins: any) => {
      result = plugins;
    });

    const sut = new PluginManager(chain);
    await sut.init(configHook);

    expect(result).toBeDefined();

    expect(result.TestPluginOne).toBeDefined();
    expect(result.TestPluginTwo).toBeUndefined();
  });
});
