import { useState } from "react";
import { SubthemeSimple } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormContentData({ initialSubthemes, formState }: any) {
  const [open, setOpen] = useState(false);

  const selectedTheme = initialSubthemes.find(
    (t: SubthemeSimple) => t.id.toString() === formState.subthemeId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtheme & Content Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col justify-end">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Subtheme
            </label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="h-0">
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="h-11 w-full border border-input bg-muted justify-between"
                >
                  {selectedTheme ? selectedTheme.title : "Select subtheme to update..."}
                  <ChevronsUpDown />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent 
                side="bottom" 
                avoidCollisions={false} 
                className="w-[var(--radix-popover-trigger-width)] p-1"
              >
                <Command>
                  <CommandInput placeholder="Search subthemes..." />
                  <CommandList>
                    <CommandEmpty>No subtheme found.</CommandEmpty>
                    <CommandGroup>
                      {initialSubthemes.map((t: SubthemeSimple) => (
                        <CommandItem
                          key={t.id}
                          value={t.title}
                          onSelect={() => {
                            // Toggle selection off if clicking the same item again
                            formState.setSubthemeId(
                              t.id.toString() === formState.subthemeId
                                ? ""
                                : t.id.toString()
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "",
                              formState.subthemeId === t.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {t.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">
              Content Type
            </label>
            <Input
              value={formState.contentType}
              onChange={(e) => formState.setContentType(e.target.value)}
              placeholder="e.g. Overview, Article, FAQ, etc..."
              className="py-5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">
            Payload Data
          </label>
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
          <label htmlFor="active" className="text-sm font-medium">
            Set active when posted
          </label>
        </div>
      </CardContent>
    </Card>
  );
}