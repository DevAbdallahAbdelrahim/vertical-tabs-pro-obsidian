import { ItemView, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import React from "react";
import { VirtualTabList } from "../components/VirtualTabList";

// --- أضف هذا الجزء هنا ---
export interface PluginSettings {
  customTitles: Record<string, string>;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  customTitles: {},
};
// -------------------------

export const VIEW_TYPE_VERTICAL_TABS_PRO = "vertical-tabs-pro-view";

export class VerticalTabsProView extends ItemView {
  // ... باقي الكود كما هو
  private root: Root | null = null;
  private saveCallback: any;

  constructor(leaf: WorkspaceLeaf, saveCallback: any) {
    super(leaf);
    this.saveCallback = saveCallback;
  }

  getViewType(): string {
    return VIEW_TYPE_VERTICAL_TABS_PRO;
  }

  getDisplayText(): string {
    return "Vertical Tabs Pro";
  }

  getIcon(): string {
    return "layout-list";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();

    const reactContainer = container.createDiv({ cls: "vtp-react-root" });
    reactContainer.style.height = "100%";

    this.root = createRoot(reactContainer);
    this.root.render(
      <VirtualTabList
        onSelectTab={(leafId) => this.activateLeaf(leafId)}
        saveCallback={this.saveCallback}
      />,
    );
  }

  private activateLeaf(leafId: string): void {
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    const target = leaves.find(
      (l) => (l as any).id === leafId || leafId.includes((l as any).id),
    );

    if (target) {
      this.app.workspace.setActiveLeaf(target, { focus: true });
    }
  }

  async onClose(): Promise<void> {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}
