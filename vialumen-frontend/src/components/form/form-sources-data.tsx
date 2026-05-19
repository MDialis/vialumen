import { FormSource } from "@/hooks/use-official-content-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";

interface FormSourcesDataProps {
  sources: FormSource[];
  addSource: () => void;
  removeSource: (index: number) => void;
  updateSource: (index: number, fields: Partial<FormSource>) => void;
}

export function FormSourcesData({ sources, addSource, removeSource, updateSource }: FormSourcesDataProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Citations</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={addSource}>
          <Plus className="w-4 h-4 mr-1" /> Add Source
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.map((s, i) => (
          <div key={i} className="p-4 border border-border/60 rounded-md bg-secondary/20 relative space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeSource(i)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  value={s.title}
                  onChange={(e) => updateSource(i, { title: e.target.value })}
                  placeholder="Reference designation"
                  className="py-5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Type <span className="text-destructive">*</span>
                </label>
                <Input
                  value={s.source_type}
                  onChange={(e) => updateSource(i, { source_type: e.target.value })}
                  placeholder="e.g. web_article"
                  className="py-5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> URL
                <span className="lowercase font-normal opacity-70">(Optional)</span>
              </label>
              <Input
                type="url"
                className="py-5"
                value={s.url}
                onChange={(e) => updateSource(i, { url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}