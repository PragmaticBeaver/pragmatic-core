export type PluginEnabled = Record<string, boolean>;

export type PluginConfig = {
  plugins: Record<string, PluginEnabled>;
};
