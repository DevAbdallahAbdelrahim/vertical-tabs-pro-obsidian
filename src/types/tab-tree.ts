export type NodeId = string;

export interface ArenaNode {
  id: NodeId;
  leafId: string | null;      // Direct reference to Obsidian Leaf
  title: string;
  filePath: string | null;
  parentId: NodeId | null;    // Parent index identifier for flat hierarchy
  childrenIds: NodeId[];      // Array of child Node IDs
  isGroup: boolean;
  isCollapsed: boolean;
  isHibernated: boolean;
  depth: number;             // Logical depth level (0, 1, 2...)
  lastAccessedTime: number;
}

export interface SavedGroupState {
  id: NodeId;
  customTitle: string;
  color?: string;
  isCollapsed: boolean;
  parentId: NodeId | null;
  childGroupIds: NodeId[];
}

export interface PluginDataStorage {
  version: string;
  persistentGroups: Record<NodeId, SavedGroupState>;
  settings: {
    hibernationTimeoutMinutes: number;
    maxNestingDepth: number;
    enableAutoGroupingByFolder: boolean;
  };
}
