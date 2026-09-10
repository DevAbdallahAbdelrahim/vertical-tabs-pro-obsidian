import { Plugin } from "obsidian";
import { PluginDataStorage, SavedGroupState } from "../types/tab-tree";
import { DEFAULT_SETTINGS } from "../types/plugin-settings";

export class PersistentStorageManager {
  private plugin: Plugin;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  /**
   * Loads plugin data from disk (data.json)
   */
  public async loadStorage(): Promise<PluginDataStorage> {
    const data = await this.plugin.loadData();
    if (!data) {
      return {
        version: "1.0.0",
        persistentGroups: {},
        settings: DEFAULT_SETTINGS,
      };
    }
    return {
      version: data.version || "1.0.0",
      persistentGroups: data.persistentGroups || {},
      settings: Object.assign({}, DEFAULT_SETTINGS, data.settings),
    };
  }

  /**
   * Persists persistent custom group titles and statuses directly into plugin data.json
   */
  public async saveGroups(
    groups: Record<string, SavedGroupState>
  ): Promise<void> {
    const currentData = await this.loadStorage();
    currentData.persistentGroups = groups;
    await this.plugin.saveData(currentData);
  }
}
