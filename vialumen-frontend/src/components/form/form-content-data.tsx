import { SubthemeSimple } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FormContentData({ initialSubthemes, formState }: any) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Subtheme & Content Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Subtheme</label>
            <Select value={formState.subthemeId} onValueChange={formState.setSubthemeId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subtheme to update..." />
              </SelectTrigger>
              <SelectContent>
                {initialSubthemes.map((t: SubthemeSimple) => (
                  <SelectItem key={t.id} value={t.id.toString()}>{t.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Content Type</label>
            <Input
              value={formState.contentType}
              onChange={(e) => formState.setContentType(e.target.value)}
              placeholder="e.g. core_spec"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Payload Data</label>
          <Textarea
            rows={6}
            value={formState.contentText}
            onChange={(e) => formState.setContentText(e.target.value)}
            placeholder="Enter Markdown payload..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={formState.isActive}
            onCheckedChange={(c) => formState.setIsActive(!!c)}
          />
          <label htmlFor="active" className="text-sm font-medium">Set active when posted</label>
        </div>
      </CardContent>
    </Card>
  );
}