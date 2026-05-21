import { FormContributor } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, UserCheck, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface FormContributorsDataProps {
  contributors: FormContributor[]; 
  addContributor: (type: "platform" | "external") => void;
  removeContributor: (index: number) => void;
  updateContributor: (index: number, fields: Partial<FormContributor>) => void;
}

export function FormContributorsData({
  contributors,
  addContributor,
  removeContributor,
  updateContributor,
}: FormContributorsDataProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Contributors</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => addContributor("platform")}>
            <Plus className="w-4 h-4 mr-1" /> Platform User
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => addContributor("external")}>
            <Plus className="w-4 h-4 mr-1" /> External Entity
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contributors.map((c, i) => (
          <div key={i} className="p-4 border border-border/80 rounded-lg bg-secondary/20 space-y-2 relative">
            <div className="flex justify-between items-center">
              <Badge variant={c.type === "platform" ? "default" : "secondary"}>
                {c.type === "platform" ? "Platform User" : "External Entity"}
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
              {/* Platform User Input */}
              {c.type === "platform" ? (
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Target Account</label>
                  {c.user_id ? (
                    <div className="flex items-center justify-between border border-border px-3 py-2 rounded-md bg-background">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-primary" />{c.displayName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs underline p-1 h-auto"
                        onClick={() => updateContributor(i, { user_id: null, displayName: "", searchQuery: "" })}
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <Popover open={c.searchQuery.length > 0}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Input
                            placeholder="Type username..."
                            value={c.searchQuery}
                            onChange={(e) => updateContributor(i, { searchQuery: e.target.value })}
                            className="py-5"
                          />
                          
                          <div className="absolute right-3 top-3 text-muted-foreground pointer-events-none">
                            {c.isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          </div>
                        </div>
                      </PopoverTrigger>
                      
                      <PopoverContent 
                        className="w-[var(--radix-popover-trigger-width)] p-0" 
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <Command shouldFilter={false}>
                          <CommandList>
                            {c.isSearching && <CommandEmpty>Searching network...</CommandEmpty>}
                            {!c.isSearching && c.searchResults.length === 0 && (
                              <CommandEmpty>No users found.</CommandEmpty>
                            )}

                            <CommandGroup>
                              {c.searchResults.map((u) => (
                                <CommandItem
                                  key={u.id}
                                  value={u.id}
                                  className="justify-between p-2 px-3 cursor-pointer"
                                  onSelect={() => {
                                    updateContributor(i, {
                                      user_id: u.id,
                                      displayName: `${u.name} (@${u.username})`,
                                      searchResults: [],
                                      searchQuery: "",
                                    });
                                  }}
                                >
                                  <span className="font-semibold">{u.name}</span>
                                  <span className="text-xs text-muted-foreground">@{u.username}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              ) : (
                /* External User Input */
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
                  <Input
                    placeholder="e.g. John/Jane Doe"
                    value={c.external_name || ""}
                    onChange={(e) => updateContributor(i, { external_name: e.target.value })}
                    className="py-5"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Role in the content</label>
                <Input
                  value={c.role}
                  onChange={(e) => updateContributor(i, { role: e.target.value })}
                  placeholder="e.g. Author, Editor, Reviewer, etc..."
                  className="py-5"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}