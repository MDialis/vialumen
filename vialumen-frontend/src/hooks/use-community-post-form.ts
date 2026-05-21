import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  UserSearchResult, 
  CreateCommunityPostPayload, 
  SourceRequest,
  FormContributor
} from "@/types";
import { searchUsers, postCommunityContent } from "@/lib/api";


export function useCommunityPostForm(token: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ error?: string; success?: boolean }>({});

  const [subthemeId, setSubthemeId] = useState("");
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  
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
        isSearching: false 
      },
    ]);
  };
  
  const removeContributor = (index: number) => setContributors((prev) => prev.filter((_, i) => i !== index));
  const updateContributor = (index: number, fields: Partial<FormContributor>) => {
    setContributors((prev) => prev.map((item, i) => (i === index ? { ...item, ...fields } : item)));
  };

  const addSource = () => setSources((prev) => [...prev, { title: "", source_type: "", url: "" }]);
  const removeSource = (index: number) => setSources((prev) => prev.filter((_, i) => i !== index));
  const updateSource = (index: number, fields: Partial<SourceRequest>) => {
    setSources((prev) => prev.map((item, i) => (i === index ? { ...item, ...fields } : item)));
  };

  // Debounced user search
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

    if (!subthemeId) return setStatus({ error: "Please select a topic/subtheme." });
    if (!title.trim()) return setStatus({ error: "Your post needs a title." });
    if (!contentText.trim()) return setStatus({ error: "Your post needs some content." });

    const payload: CreateCommunityPostPayload = {
      subtheme_id: Number(subthemeId),
      title: title.trim(),
      content_text: contentText,
      contributors: contributors.map((c) => ({
        user_id: c.type === "platform" ? c.user_id : null,
        external_name: c.type === "external" ? c.external_name : null,
        role: c.role.trim() || "Author",
      })),
      sources: sources
        .map((s) => ({
          title: s.title.trim(),
          source_type: s.source_type.trim(),
          url: s.url ? s.url.trim() : null
        }))
        .filter((s) => s.title && s.source_type),
    };

    startTransition(async () => {
      const success = await postCommunityContent(payload, token);
      if (success) {
        setStatus({ success: true });
        setTitle("");
        setContentText("");
        setContributors([]);
        setSources([]);
        router.push("/community"); 
      } else {
        setStatus({ error: "Failed to publish your post. Please try again." });
      }
    });
  };

  return {
    isPending, status, subthemeId, title, contentText, contributors, sources,
    setSubthemeId, setTitle, setContentText,
    addContributor, removeContributor, updateContributor,
    addSource, removeSource, updateSource,
    handleSubmit,
  };
}