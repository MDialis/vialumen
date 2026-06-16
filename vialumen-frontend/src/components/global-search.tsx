"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { globalSearch, GlobalSearchResult } from "@/lib/api";

export default function GlobalSearch({
  autoFocus = false,
  onResultClick,
}: {
  autoFocus?: boolean;
  onResultClick?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const debounceTimer = setTimeout(() => {
      globalSearch(searchQuery).then((results) => {
        setSearchResults(results);
        setIsSearching(false);
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setIsSearchFocused(false);
    setSearchQuery("");
    onResultClick?.();
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <InputGroup className="bg-muted text-muted-foreground">
        <InputGroupInput
          placeholder="Type to search..."
          autoFocus={autoFocus}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
        />
        <InputGroupAddon align="inline-end">
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin mx-2" />
          ) : (
            <InputGroupButton variant="ghost" className="bg-background">
              Search
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>

      {isSearchFocused && searchQuery.trim().length > 2 && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <ul>
              {searchResults.map((result) => (
                <li key={`${result.type}-${result.url}`}>
                  <Link href={result.url} className="block p-3 hover:bg-muted transition-colors" onClick={handleResultClick}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${result.type === "official" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                        {result.type}
                      </span>
                      <p className="font-semibold text-foreground truncate">{result.title}</p>
                    </div>
                    {result.subtheme_name && <p className="text-xs text-muted-foreground mt-1">in {result.subtheme_name}</p>}
                    {result.snippet && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Sorry! No results for now.
            </div>
          )}
        </div>
      )}
    </div>
  );
}