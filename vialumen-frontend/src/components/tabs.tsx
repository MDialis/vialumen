"use client";

import React, { useState, useRef, ReactElement, ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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
    <div className="h-full w-full bg-background rounded-2xl p-3">
      {children}
    </div>
  );
};

export const Tabs = ({ children, defaultIndex = 0 }: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultIndex);
  const tabs = React.Children.toArray(children) as ReactElement<TabProps>[];

  const activeTheme = tabs[activeTabIndex].props.theme || "";

  // --- Drag to Scroll Logic for Desktop ---
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
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="flex flex-col px-2 md:px-0 md:max-w-11/12 lg:max-w-10/12 mx-auto h-[90vh]">
      <div
        role="tablist"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          tabs tabs-lifted gap-2 md:gap-3
          flex flex-row flex-nowrap
          w-full md:justify-center relative
          pb-3 z-10
          overflow-x-auto 
          scroll-smooth
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
              variant={isActive ? "default" : "outline"}
              onClick={() => {
                if (!isDragging && !tab.props.disabled) {
                  setActiveTabIndex(index);
                }
              }}
              className={`
                relative tab shrink-0 whitespace-nowrap overflow-hidden text-ellipsis
                md:flex-1 md:min-w-[150px]
                after:absolute after:inset-x-0 after:-bottom-4 after:top-0
                ${tab.props.disabled
                  ? "tab-disabled cursor-not-allowed"
                  : `${isActive
                    ? `${activeTheme} font-bold md:-translate-y-1 hover:-translate-y-2`
                    : `hover:-translate-y-1`}`
                }
              `}
            >
              {tab.props.title}
            </Button>
          );
        })}
      </div>

      <Card
        className={`
            relative mx-auto w-full h-full flex-1
            py-0 rounded-4xl overflow-hidden
            border-4 border-b-12 border-primary/50
            bg-card ${activeTheme}
        `}
      >
        {tabs[activeTabIndex]}
      </Card>
    </div>
  );
};