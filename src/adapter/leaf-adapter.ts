import { WorkspaceLeaf, TFile } from "obsidian";
import { ArenaNode } from "../types/tab-tree";

export class LeafAdapter {
  /**
   * Generates a unique Node ID for a given leaf or generates a synthetic ID
   */
  public static getLeafId(leaf: WorkspaceLeaf): string {
    // @ts-ignore - Accessing internal Obsidian leaf id safely
    return leaf.id || `leaf-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Converts a native Obsidian WorkspaceLeaf into a lightweight ArenaNode
   */
  public static toArenaNode(
    leaf: WorkspaceLeaf,
    depth: number = 0,
    parentId: string | null = null
  ): ArenaNode {
    const leafId = this.getLeafId(leaf);
    const view = leaf.view;
    const file = view && "file" in view ? (view.file as TFile) : null;

    const title = file ? file.basename : view?.getViewType() || "Empty Tab";
    const filePath = file ? file.path : null;

    return {
      id: `node-${leafId}`,
      leafId: leafId,
      title: title,
      filePath: filePath,
      parentId: parentId,
      childrenIds: [],
      isGroup: false,
      isCollapsed: false,
      isHibernated: false,
      depth: depth,
      lastAccessedTime: Date.now(),
    };
  }
}
