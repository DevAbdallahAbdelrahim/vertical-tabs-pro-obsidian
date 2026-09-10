import { App, PluginSettingTab, Setting } from "obsidian";
import VerticalTabsProPlugin from "../main";

export class VerticalTabsProSettingTab extends PluginSettingTab {
  plugin: VerticalTabsProPlugin;

  constructor(app: App, plugin: VerticalTabsProPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Vertical Tabs Pro Settings" });

    new Setting(containerEl)
      .setName("Hibernation Timeout (Minutes)")
      .setDesc("Inactivity duration before tab views are unloaded from RAM.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.hibernationTimeoutMinutes))
          .onChange(async (value) => {
            const num = Number(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.hibernationTimeoutMinutes = num;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Enable Auto Grouping by Folder")
      .setDesc("Automatically group open tabs based on their vault directory structure.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAutoGroupingByFolder)
          .onChange(async (value) => {
            this.plugin.settings.enableAutoGroupingByFolder = value;
            await this.plugin.saveSettings();
            this.plugin.syncWorkspaceState();
          })
      );

    new Setting(containerEl)
      .setName("Max Nesting Depth")
      .setDesc("Maximum allowable depth for nested tag and folder groups.")
      .addText((text) =>
        text
          .setValue(String(this.plugin.settings.maxNestingDepth))
          .onChange(async (value) => {
            const num = Number(value);
            if (!isNaN(num) && num >= 1) {
              this.plugin.settings.maxNestingDepth = num;
              await this.plugin.saveSettings();
            }
          })
      );
  }
}
