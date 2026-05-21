"use client";

import { SubthemeSimple } from "@/types";
import { useOfficialContentForm } from "@/hooks/use-official-content-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { FormOfficialContentData } from "./form-official-content-data";
import { FormContributorsData } from "./form-contributors-data";
import { FormSourcesData } from "./form-sources-data";

interface OfficialContentFormProps {
  initialSubthemes: SubthemeSimple[];
  token: string;
}

export default function OfficialContentForm({
  initialSubthemes,
  token,
}: OfficialContentFormProps) {
  const formState = useOfficialContentForm(token);

  return (
    <form onSubmit={formState.handleSubmit} className="space-y-8 pb-12">
      <FormOfficialContentData
        initialSubthemes={initialSubthemes}
        formState={formState}
      />

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

      {formState.status.error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm font-medium">
          {formState.status.error}
        </div>
      )}
      {formState.status.success && (
        <div className="p-4 bg-primary/10 border border-primary text-primary rounded-md text-sm font-medium">
          Content successfully deployed!
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={formState.isPending}
          className="px-8 font-bold"
        >
          {formState.isPending ? (
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
