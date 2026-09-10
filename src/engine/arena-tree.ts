import { WorkspaceLeaf } from "obsidian";
import { ArenaNode, NodeId } from "../types/tab-tree";
import { LeafAdapter } from "../adapter/leaf-adapter";

export class ArenaTreeEngine {
  /**
   * Rebuilds a flat Arena tree representation from native Obsidian workspace leaves
   */
  public static buildFlatTree(
    leaves: WorkspaceLeaf[],
    activeLeaf: WorkspaceLeaf | null,
    enableFolderGrouping: boolean = true
  ): { nodes: Record<NodeId, ArenaNode>; rootIds: NodeId[] } {
    const nodes: Record<NodeId, ArenaNode> = {};
    const rootIds: NodeId[] = [];
    const folderGroups: Record<string, NodeId> = {};

    const activeLeafId = activeLeaf ? LeafAdapter.getLeafId(activeLeaf) : null;

    leaves.forEach((leaf) => {
      const node = LeafAdapter.toArenaNode(leaf);

      if (enableFolderGrouping && node.filePath) {
        const folderPath = this.extractFolder(node.filePath);

        if (folderPath && folderPath !== "/") {
          let groupId = folderGroups[folderPath];

          if (!groupId) {
            groupId = `group-folder-${folderPath}`;
            folderGroups[folderPath] = groupId;

            const groupNode: ArenaNode = {
              id: groupId,
              leafId: null,
              title: folderPath,
              filePath: null,
              parentId: null,
              childrenIds: [],
              isGroup: true,
              isCollapsed: false,
              isHibernated: false,
              depth: 0,
              lastAccessedTime: Date.now(),
            };

            nodes[groupId] = groupNode;
            rootIds.push(groupId);
          }

          node.parentId = groupId;
          node.depth = 1;
          nodes[groupId].childrenIds.push(node.id);
        } else {
          rootIds.push(node.id);
        }
      } else {
        rootIds.push(node.id);
      }

      if (leafIdMatches(node.leafId, activeLeafId)) {
        node.lastAccessedTime = Date.now();
      }

      nodes[node.id] = node;
    });

    return { nodes, rootIds };
  }

  private static extractFolder(filePath: string): string | null {
    const parts = filePath.split("/");
    if (parts.length > 1) {
      return parts[parts.length - 2];
    }
    return null;
  }
}

function leafIdMatches(id1: string | null, id2: string | null): boolean {
  return id1 !== null && id2 !== null && id1 === id2;
}
