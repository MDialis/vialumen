"use client";

import { useSearchParams } from "next/navigation";
import { TabItem, Tabs } from "@/components/tabs";
import { Suspense, useEffect, useState } from "react";
import { HierarchyLevel } from "@/types";
import { getHierarchyLevels } from "@/lib/api";
import { GraphDataView } from "@/components/graph/graphDataView";

function CoreContent() {
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");

  const [levels, setLevels] = useState<HierarchyLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLevels() {
      const data = await getHierarchyLevels();
      if (data) setLevels(data);
      setIsLoading(false);
    }
    loadLevels();
  }, []);

  if (isLoading) return <div className="p-10 text-center">Loading core frameworks...</div>;
  if (levels.length === 0) return <div className="p-10 text-center">No hierarchy levels found.</div>;

  const foundIndex = levels.findIndex((level) => level.id === activeTabParam);
  const defaultIndex = foundIndex !== -1 ? foundIndex : 2;

  return (
    <div className="h-full">
      <Tabs key={defaultIndex} defaultIndex={defaultIndex}>
        {levels.map((level, index) => (
          <TabItem
            key={`${level.id}-${index}`}
            title={level.title}
            theme={level.theme}
          >
            <GraphDataView hierarchyId={level.id} />
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}

export default function Core() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading page framework...</div>}>
      <CoreContent />
    </Suspense>
  );
}