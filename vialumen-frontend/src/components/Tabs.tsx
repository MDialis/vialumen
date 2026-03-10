"use client";

import React, { useState, ReactElement, ReactNode } from "react";
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

  return (
    <div className="flex flex-col px-2 md:px-0 md:max-w-11/12 lg:max-w-10/12 mx-auto h-[90vh]">
      <div
        role="tablist"
        className="
          tabs tabs-lifted gap-1 md:gap-3
          flex flex-col md:flex-row
          w-full justify-center relative
          pb-3 z-10"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;

          return (
            <Button
              key={index}
              role="tab"
              variant="outline"
              onClick={() => !tab.props.disabled && setActiveTabIndex(index)}
              className={`
                tab border-2 border-b-4
                md:max-w-64 w-full
                  ${
                    tab.props.disabled
                      ? "tab-disabled cursor-not-allowed"
                      : `${
                        isActive  
                          ? `
                            ${activeTheme} border-primary 
                            bg-accent font-bold
                            md:-translate-y-1 
                            hover:-translate-y-2` 
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
