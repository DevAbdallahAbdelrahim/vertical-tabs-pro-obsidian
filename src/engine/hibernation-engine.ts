import { WorkspaceLeaf } from "obsidian";
import { ArenaNode, NodeId } from "../types/tab-tree";

export class HibernationEngine {
  /**
   * Identifies idle leaves exceeding inactivity threshold and releases view memory
   */
  public static processHibernation(
    nodes: Record<NodeId, ArenaNode>,
    leaves: WorkspaceLeaf[],
    activeNodeId: NodeId | null,
    timeoutMs: number
  ): Record<NodeId, ArenaNode> {
    const now = Date.now();
    const updatedNodes = { ...nodes };

    Object.values(updatedNodes).forEach((node) => {
      if (node.isGroup || !node.leafId || node.id === activeNodeId) {
        return;
      }

      const idleTime = now - node.lastAccessedTime;

      if (idleTime >= timeoutMs && !node.isHibernated) {
        const leaf = leaves.find(
          (l) => (l as any).id === node.leafId || node.leafId?.includes((l as any).id)
        );

        if (leaf) {
          // Page Fault Eviction: Unload view DOM while preserving tab entry
          this.evictLeafMemory(leaf);
          node.isHibernated = true;
        }
      }
    });

    return updatedNodes;
  }

  private static evictLeafMemory(leaf: WorkspaceLeaf): void {
    try {
      if (leaf.view && typeof (leaf.view as any).unload === "function") {
        // Clear heavy editor components from RAM
        (leaf.view as any).unload();
      }
    } catch (err) {
      console.warn("[Vertical Tabs Pro] Page Fault Eviction fallback handled safely.", err);
    }
  }
}
