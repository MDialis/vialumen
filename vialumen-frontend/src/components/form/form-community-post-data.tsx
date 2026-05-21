import { useState } from "react";
import { SubthemeSimple } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface FormCommunityPostDataProps {
  initialSubthemes: SubthemeSimple[];
  formState: any;
}

export function FormCommunityPostData({
  initialSubthemes,
  formState,
}: FormCommunityPostDataProps) {
  const [openPopover, setOpenPopover] = useState(false);

  const selectedTheme = initialSubthemes.find(
    (t: SubthemeSimple) => t.id.toString() === formState.subthemeId
  );

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardContent className="p-0">
        <div className="px-6 pb-6 border-b border-border/50 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Searchable Subtheme Selection Panel */}
            <div className="md:col-span-1 space-y-2 flex flex-col justify-end">
              <label className="text-xs font-bold uppercase text-muted-foreground">
                Subtheme
              </label>
              <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPopover}
                    className="h-10 w-full bg-background justify-between border border-input px-3 font-normal"
                  >
                    {selectedTheme ? selectedTheme.title : "Select subtheme..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                              formState.setSubthemeId(
                                t.id.toString() === formState.subthemeId ? "" : t.id.toString()
                              );
                              setOpenPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formState.subthemeId === t.id.toString() ? "opacity-100" : "opacity-0"
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

            {/* Title Input */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Title</label>
              <Input
                value={formState.title}
                onChange={(e) => formState.setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="bg-background font-medium h-10"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <Textarea
            rows={8}
            value={formState.contentText}
            onChange={(e) => formState.setContentText(e.target.value)}
            placeholder="Expand on your thoughts here..."
            className="resize-y border-none shadow-none focus-visible:ring-0 text-base bg-transparent py-2 px-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}