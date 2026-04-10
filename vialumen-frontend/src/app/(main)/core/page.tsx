import { getHierarchyLevels } from "@/lib/api";
import { Tabs, TabItem } from "@/components/tabs";
import { GraphDataView } from "@/components/graph/graph-data-view";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Core({ searchParams }: Props) {
  const [levels, resolvedSearchParams] = await Promise.all([
    getHierarchyLevels(),
    searchParams,
  ]);

  if (!levels || levels.length === 0) {
    return <div className="p-10 text-center">No hierarchy levels found.</div>;
  }

  const activeTabParam = resolvedSearchParams.tab;
  
  const tabId = Array.isArray(activeTabParam) ? activeTabParam[0] : activeTabParam;

  const foundIndex = levels.findIndex((level) => level.id === tabId);
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