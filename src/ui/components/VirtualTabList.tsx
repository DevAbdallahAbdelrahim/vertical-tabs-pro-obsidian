import React, { useState } from "react";
import { useTabStore } from "../../store/tab-store";
import { TabGroupNode } from "./TabGroupNode";
import { TabItemNode } from "./TabItemNode";
import { SearchEngine } from "../../engine/search-engine";

interface VirtualTabListProps {
  onSelectTab: (leafId: string) => void;
  saveCallback: any;
}

export const VirtualTabList: React.FC<VirtualTabListProps> = ({
  onSelectTab,
  saveCallback,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const nodes = useTabStore((state) => state.nodes);
  const rootNodeIds = useTabStore((state) => state.rootNodeIds);

  const filteredNodeIds = SearchEngine.filterNodes(nodes, searchQuery);

  const renderNode = (nodeId: string) => {
    const node = nodes[nodeId];
    if (!node || !filteredNodeIds.includes(nodeId)) return null;

    if (node.isGroup) {
      return (
        <React.Fragment key={node.id}>
          <TabGroupNode node={node} saveCallback={saveCallback} />
          {!node.isCollapsed &&
            node.childrenIds.map((childId) => renderNode(childId))}
        </React.Fragment>
      );
    }

    return (
      <TabItemNode key={node.id} node={node} onSelectTab={onSelectTab} />
    );
  };

  return (
    <div className="vtp-container">
      <div style={{ padding: "6px 8px" }}>
        <input
          type="text"
          placeholder="Filter tabs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid var(--background-modifier-border)",
            backgroundColor: "var(--background-secondary)",
            color: "var(--text-normal)",
            fontSize: "0.82rem",
          }}
        />
      </div>
      <div className="vtp-virtual-list">
        {rootNodeIds.map((id) => renderNode(id))}
      </div>
    </div>
  );
};
