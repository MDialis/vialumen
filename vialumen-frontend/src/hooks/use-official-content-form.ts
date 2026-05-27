import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  UserSearchResult, 
  CreateOfficialVersionRequest, 
  SourceRequest,
  FormContributor
} from "@/types"; 
import { searchUsers, postOfficialContent } from "@/lib/api";


export function useOfficialContentForm(token: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: boolean }>({});

  const [subthemeId, setSubthemeId] = useState("");
  const [contentType, setContentType] = useState("");
  const [contentText, setContentText] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [contributors, setContributors] = useState<FormContributor[]>([]);
  const [sources, setSources] = useState<SourceRequest[]>([]);

  const addContributor = (type: "platform" | "external") => {
    setContributors((prev) => [
      ...prev,
      {
        type,
        user_id: null,
        external_name: null,
        displayName: "",
        role: "",
        searchQuery: "",
        searchResults: [],
        isSearching: false,
      },
    ]);
  };

  const removeContributor = (index: number) => {
    setContributors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateContributor = (index: number, fields: Partial<FormContributor>) => {
    setContributors((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...fields } : item))
    );
  };

  const addSource = () => setSources((prev) => [...prev, { title: "", source_type: "", url: "" }]);

  const removeSource = (index: number) => setSources((prev) => prev.filter((_, i) => i !== index));

  const updateSource = (index: number, fields: Partial<SourceRequest>) => {
    setSources((prev) => prev.map((item, i) => (i === index ? { ...item, ...fields } : item)));
  };

  useEffect(() => {
    const timers = contributors.map((contrib, index) => {
      if (contrib.type === "platform" && contrib.searchQuery.trim() && !contrib.user_id) {
        return setTimeout(async () => {
          updateContributor(index, { isSearching: true });
          const results = await searchUsers(contrib.searchQuery);
          updateContributor(index, { searchResults: results, isSearching: false });
        }, 400);
      }
      return null;
    });

    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [contributors.map((c) => c.searchQuery).join(",")]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({});

    if (!subthemeId) return setStatus({ error: "Please select a subtheme." });
    if (!contentType.trim() || !contentText.trim()) {
      return setStatus({ error: "Content Type and Body are required." });
    }

    const payload: CreateOfficialVersionRequest = {
      subtheme_id: Number(subthemeId),
      content_type: contentType.trim(),
      content_text: contentText,
      is_active: isActive,
      contributors: contributors.map((c) => ({
        user_id: c.type === "platform" ? c.user_id : null,
        external_name: c.type === "external" ? c.external_name : null,
        role: c.role.trim() || "Author",
      })),
      sources: sources
        .map((s) => ({
          title: s.title.trim(),
          source_type: s.source_type.trim(),
          url: s.url ? s.url.trim() : null,
        }))
        .filter((s) => s.title && s.source_type),
    };

    startTransition(async () => {
      const success = await postOfficialContent(payload, token);
      if (success) {
        setStatus({ success: true });
        setContentText("");
        setContentType("");
        setContributors([]);
        setSources([]);
        router.refresh();
      } else {
        setStatus({ error: "Failed to publish content to the backend servers." });
      }
    });
  };

  return {
    // Form State
    isPending,
    status,
    subthemeId,
    contentType,
    contentText,
    isActive,
    contributors,
    sources,
    
    // Setters
    setSubthemeId,
    setContentType,
    setContentText,
    setIsActive,

    // Actions
    addContributor,
    removeContributor,
    updateContributor,
    addSource,
    removeSource,
    updateSource,
    handleSubmit,
  };
}