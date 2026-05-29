"use client";

import React, { useState, useRef, ReactElement, ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TabProps {
  title: string;
  children: ReactNode;
  theme?: string;
  disabled?: boolean;
}

interface TabsProps {
  children: ReactElement<TabProps> | ReactElement<TabProps>[];
  defaultIndex?: number;
}

export const TabItem = ({ children }: TabProps) => {
  return (
    <div className="h-full w-full p-2">
      {children}
    </div>
  );
};

export const Tabs = ({ children, defaultIndex = 0 }: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);
  const tabs = React.Children.toArray(children) as ReactElement<TabProps>[];

  const activeTheme = tabs[activeTabIndex].props.theme || "";

  // --- Drag to Scroll ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full h-[80vh] min-h-[600px]">
      <div
        role="tablist"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          flex flex-row md:flex-col flex-nowrap
          w-full md:w-56 shrink-0 gap-2
          overflow-x-auto md:overflow-y-auto
          scroll-smooth pb-2 md:pb-0 md:pr-2
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${isDragging ? "cursor-grabbing" : ""}
        `}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;

          return (
            <Button
              key={index}
              role="tab"
              variant={isActive ? "default" : "ghost"}
              onClick={() => {
                if (!isDragging && !tab.props.disabled) {
                  setActiveTabIndex(index);
                }
              }}
              className={cn(
                "relative shrink-0 whitespace-nowrap overflow-hidden text-ellipsis h-11",
                "justify-center md:justify-start transition-all duration-300",
                tab.props.disabled && "tab-disabled cursor-not-allowed",
                isActive 
                  ? `${activeTheme} font-bold md:translate-x-2` 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.props.title}
            </Button>
          );
        })}
      </div>

      {/* ================================== */}
      {/* RIGHT AREA: TAB CONTENT            */}
      {/* ================================== */}
      <Card
        className={cn(
          "relative min-w-0 w-full h-full flex-1",
          "py-0 rounded-4xl overflow-hidden",
          "border-4 border-b-12 border-primary/50",
          "bg-card",
          activeTheme
        )}
      >
        {tabs[activeTabIndex]}
      </Card>

    </div>
  );
};