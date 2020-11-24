/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import { PluginConfig } from "./plugin-config";
import { IEventChain } from "./event-chain";

export type PluginManagerConfig = {
  pluginConfigPath: string;
  pluginIndexPath: string;
};

export type PluginManagerHook = () => {
  config: PluginConfig;
  modules: any;
};

export type PluginManagerEvents = "plugin-manager-plugins-loaded";

/**
 * Dynamically loads and initializes plugins from configuration during runtime.
 */
export class PluginManager {
  private eventChain: IEventChain;
  private config: PluginConfig = { plugins: {} };
  private modules: any;
  private plugins: any = {};

  constructor(chain: IEventChain) {
    this.eventChain = chain;
  }

  public async init(
    configuration: PluginManagerConfig | PluginManagerHook
  ): Promise<void> {
    let config;
    let modules;

    /* istanbul ignore else */
    if (typeof configuration === "function") {
      const val = configuration();
      config = val.config;
      modules = val.modules;
    } else {
      config = this.readPluginConfig(configuration.pluginConfigPath);
      modules = this.loadModules(configuration.pluginIndexPath);
    }

    this.config = config;
    this.modules = modules;

    await this.start(this.config, this.modules, this.eventChain);

    await this.eventChain.publish(
      "plugin-manager-plugins-loaded",
      this.plugins
    );
  }

  /* istanbul ignore next */
  private readPluginConfig(configPath: string): PluginConfig {
    const buffer = fs.readFileSync(configPath);
    const val = buffer.toString();
    const configuredPlugins = JSON.parse(val) as PluginConfig;
    return configuredPlugins;
  }

  private async start(
    config: PluginConfig,
    modules: any,
    eventChain: IEventChain
  ): Promise<void> {
    const plugins = config.plugins;

    for (const key of Object.keys(plugins)) {
      const category = plugins[key];
      await this.startPlugins(category, modules, eventChain);
    }
  }

  private async startPlugins(
    category: Record<string, boolean>,
    modules: any,
    eventChain: IEventChain
  ): Promise<void> {
    for (const pluginKey of Object.keys(category)) {
      const active = category[pluginKey];
      if (!active) {
        continue;
      }

      const module = modules[pluginKey];
      const plugin = new module(eventChain);

      await plugin.initialize();
      this.plugins[pluginKey] = plugin;
    }
  }

  /**
   * Dynamically loads plugin-index file as module during runtime.
   * @param path absolut path to plugin-index
   */
  /* istanbul ignore next */
  private loadModules(path: string): any {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(path);
  }
}
