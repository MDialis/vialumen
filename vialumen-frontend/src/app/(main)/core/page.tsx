import { getHierarchyLevels } from "@/lib/api";
import { Tabs, TabItem } from "@/components/tabs";
import { GraphDataView } from "@/components/core/graph-data-view";
import { CoreViewToggle } from "@/components/core/core-view-toggle";
import { HierarchyListView } from "@/components/core/hierarchy-list-view";

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

  // Read URL Params for Active Tab and View Mode
  const activeTabParam = resolvedSearchParams.tab;
  const viewMode = resolvedSearchParams.view === "list" ? "list" : "map";

  const tabId = Array.isArray(activeTabParam)
    ? activeTabParam[0]
    : activeTabParam;

  const foundIndex = levels.findIndex((level) => level.id === tabId);
  const defaultIndex = foundIndex !== -1 ? foundIndex : 2;

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto space-y-8 flex flex-col">
        {/* ================================== */}
        {/* HEADER SECTION                     */}
        {/* ================================== */}
        <div className="max-w-4xl space-y-3">
          <h1 className="text-4xl font-black text-foreground">
            The Knowledge Core
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore the foundational concepts that structure the human
            experience. Navigate the visual node matrix to uncover connections,
            or switch to the encyclopedia view to browse topics by their natural
            depth.
          </p>
        </div>

        {/* ================================== */}
        {/* TABS & DATA CONTENT                */}
        {/* ================================== */}
        <Tabs
          key={defaultIndex}
          defaultIndex={defaultIndex}
          topContent={<CoreViewToggle currentView={viewMode} />}
        >
          {levels.map((level, index) => (
            <TabItem
              key={`${level.id}-${index}`}
              title={level.title}
              theme={level.theme}
            >
              {viewMode === "map" ? (
                <GraphDataView hierarchyId={level.id} />
              ) : (
                <HierarchyListView hierarchyId={level.id} />
              )}
            </TabItem>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
