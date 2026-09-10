import { App, Plugin, WorkspaceLeaf } from "obsidian";
import { DOMGuard } from "./dom-guard";

export interface WorkspaceEventCallbacks {
  onLeafCreated: (leaf: WorkspaceLeaf) => void;
  onLeafClosed: (leaf: WorkspaceLeaf) => void;
  onActiveLeafChanged: (leaf: WorkspaceLeaf | null) => void;
  onLayoutChanged: () => void;
}

export class ObsidianEventObserver {
  private app: App;
  private plugin: Plugin;

  constructor(app: App, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
  }

  public registerEvents(callbacks: WorkspaceEventCallbacks): void {
    // 1. Listen for active leaf changes
    this.plugin.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf) {
          callbacks.onActiveLeafChanged(leaf);
        } else {
          callbacks.onActiveLeafChanged(null);
        }
      })
    );

    // 2. Listen for overall workspace layout changes
    this.plugin.registerEvent(
      this.app.workspace.on("layout-change", () => {
        callbacks.onLayoutChanged();
      })
    );

    // 3. Safe DOM event listener for drag/drop and context clicks
    this.plugin.registerDomEvent(
      window,
      "click",
      (event: MouseEvent) => {
        if (!DOMGuard.isElement(event.target)) return;
        
        // Prevent event cascading crashes from non-standard nodes
        if (DOMGuard.isInteractiveTabElement(event.target)) {
          // Handled safely by UI handlers
        }
      },
      true
    );
  }
}
