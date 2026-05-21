"use client";

import { SubthemeSimple } from "@/types";
import { useCommunityPostForm } from "@/hooks/use-community-post-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Settings2 } from "lucide-react";

import { FormCommunityPostData } from "@/components/form/form-community-post-data";
import { FormContributorsData } from "@/components/form/form-contributors-data";
import { FormSourcesData } from "@/components/form/form-sources-data";

interface CommunityPostFormProps {
  initialSubthemes: SubthemeSimple[];
  token: string;
}

export default function CommunityPostForm({
  initialSubthemes,
  token,
}: CommunityPostFormProps) {
  const formState = useCommunityPostForm(token);

  return (
    <form onSubmit={formState.handleSubmit} className="space-y-6 pb-12">
      {formState.status.error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm font-medium">
          {formState.status.error}
        </div>
      )}

      {/* Basic Post Area */}
      <FormCommunityPostData 
        initialSubthemes={initialSubthemes} 
        formState={formState} 
      />

      {/* Advanced Options (Attribution & Citations) */}
      <Accordion type="single" collapsible className="w-full bg-card border-2 border-border border-b-6 rounded-xl px-4">
        <AccordionItem value="advanced" className="border-none">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              Advanced Options (Attribution & Citations)
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-2 pb-6">
            <p className="text-sm text-muted-foreground px-1">
              Specify authors, researchers, and reference credentials. If you are not the one and only author of this information, add the creators below.
            </p>

            <FormContributorsData 
              contributors={formState.contributors}
              addContributor={formState.addContributor}
              removeContributor={formState.removeContributor}
              updateContributor={formState.updateContributor}
            />

            <FormSourcesData 
              sources={formState.sources}
              addSource={formState.addSource}
              removeSource={formState.removeSource}
              updateSource={formState.updateSource}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={formState.isPending} 
          size="lg"
          className="px-8 font-bold rounded-full w-full sm:w-auto"
        >
          {formState.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</>
          ) : (
            "Publish Post"
          )}
        </Button>
      </div>
    </form>
  );
}