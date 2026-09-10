import { ArenaNode, NodeId } from "../types/tab-tree";

export class SearchEngine {
  /**
   * Fast flat in-memory fuzzy search across active open tab nodes
   */
  public static filterNodes(
    nodes: Record<NodeId, ArenaNode>,
    query: string
  ): NodeId[] {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return Object.keys(nodes);
    }

    const matchedIds: NodeId[] = [];

    Object.values(nodes).forEach((node) => {
      if (node.isGroup) return;

      const titleMatch = node.title.toLowerCase().includes(cleanQuery);
      const pathMatch = node.filePath?.toLowerCase().includes(cleanQuery) || false;

      if (titleMatch || pathMatch) {
        matchedIds.push(node.id);
        // Include parent group if child tab matches
        if (node.parentId && !matchedIds.includes(node.parentId)) {
          matchedIds.push(node.parentId);
        }
      }
    });

    return matchedIds;
  }
}
