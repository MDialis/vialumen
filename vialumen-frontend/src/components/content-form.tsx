"use client";

import { SubthemeSimple } from "@/types";
import { useOfficialContentForm } from "@/hooks/use-official-content-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Trash2,
  UserCheck,
  Search,
  Link as LinkIcon,
} from "lucide-react";

interface OfficialContentFormProps {
  initialSubthemes: SubthemeSimple[];
  token: string;
}

export default function OfficialContentForm({
  initialSubthemes,
  token,
}: OfficialContentFormProps) {
  // Pull all logic and state from our custom hook
  const {
    isPending,
    status,
    subthemeId,
    contentType,
    contentText,
    isActive,
    contributors,
    sources,
    setSubthemeId,
    setContentType,
    setContentText,
    setIsActive,
    addContributor,
    removeContributor,
    updateContributor,
    addSource,
    removeSource,
    updateSource,
    handleSubmit,
  } = useOfficialContentForm(token);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {status.error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm font-medium">
          {status.error}
        </div>
      )}
      {status.success && (
        <div className="p-4 bg-primary/10 border border-primary text-primary rounded-md text-sm font-medium">
          Content successfully deployed!
        </div>
      )}

      {/* Primary Configuration */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Subtheme & Content Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Subtheme
              </label>
              <Select value={subthemeId} onValueChange={setSubthemeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subtheme to update..." />
                </SelectTrigger>
                <SelectContent>
                  {initialSubthemes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Content Type
              </label>
              <Input
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                placeholder="e.g. core_spec"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Payload Data
            </label>
            <Textarea
              rows={6}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Enter Markdown payload..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={isActive}
              onCheckedChange={(c) => setIsActive(!!c)}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Set active when posted
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Contributors Block */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl">Contributors</CardTitle>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContributor("platform")}
            >
              <Plus className="w-4 h-4 mr-1" /> Platform User
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addContributor("external")}
            >
              <Plus className="w-4 h-4 mr-1" /> External Entity
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {contributors.map((c, i) => (
            <div
              key={i}
              className="p-4 border border-border/60 rounded-md bg-secondary/20 space-y-3 relative"
            >
              <div className="flex justify-between items-center">
                <Badge
                  variant={c.type === "platform" ? "default" : "secondary"}
                >
                  {c.type === "platform" ? "Internal Node" : "External Node"}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeContributor(i)}
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {c.type === "platform" ? (
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Target Account
                    </label>
                    {c.user_id ? (
                      <div className="flex items-center justify-between border border-border px-3 py-2 rounded-md bg-background">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-primary" />
                          {c.displayName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-xs underline p-1 h-auto"
                          onClick={() =>
                            updateContributor(i, {
                              user_id: null,
                              displayName: "",
                              searchQuery: "",
                            })
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          placeholder="Type username..."
                          value={c.searchQuery}
                          onChange={(e) =>
                            updateContributor(i, {
                              searchQuery: e.target.value,
                            })
                          }
                        />
                        <div className="absolute right-3 top-3 text-muted-foreground">
                          {c.isSearching ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4" />
                          )}
                        </div>
                        {c.searchResults.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-40 overflow-y-auto">
                            {c.searchResults.map((u) => (
                              <button
                                type="button"
                                key={u.id}
                                className="w-full text-left p-2 text-sm hover:bg-muted border-b border-border/40 flex flex-col"
                                onClick={() =>
                                  updateContributor(i, {
                                    user_id: u.id,
                                    displayName: `${u.name} (@${u.username})`,
                                    searchResults: [],
                                  })
                                }
                              >
                                <span className="font-semibold">{u.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  @{u.username}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Identity Label
                    </label>
                    <Input
                      placeholder="e.g. John Doe"
                      value={c.external_name || ""}
                      onChange={(e) =>
                        updateContributor(i, { external_name: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    System Role
                  </label>
                  <Input
                    value={c.role}
                    onChange={(e) =>
                      updateContributor(i, { role: e.target.value })
                    }
                    placeholder="Author"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dynamic Sources Block Layout */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl">Citations</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSource}>
            <Plus className="w-4 h-4 mr-1" />
            Add Source
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
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Type <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={s.source_type}
                    onChange={(e) =>
                      updateSource(i, { source_type: e.target.value })
                    }
                    placeholder="e.g. web_article"
                  />
                </div>
              </div>

              {/* URL Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  URL
                  <span className="lowercase font-normal opacity-70">
                    (Optional)
                  </span>
                </label>
                <Input
                  type="url"
                  value={s.url}
                  onChange={(e) => updateSource(i, { url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="px-8 font-bold">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deploying...
            </>
          ) : (
            "Execute Post"
          )}
        </Button>
      </div>
    </form>
  );
}
