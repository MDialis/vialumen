"use client";

import React, { useState, ReactElement, ReactNode } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface TabProps {
  title: string;
  children: ReactNode;
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

  return (
    <div className="flex flex-col px-2 md:px-0 md:max-w-11/12 lg:max-w-10/12 mx-auto h-[90vh]">
      <div
        role="tablist"
        className="
          tabs tabs-lifted gap-1 md:gap-3
          flex flex-col md:flex-row
          w-full justify-center relative
          pb-2 z-10"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex;
          return (
            <Button
              key={index}
              role="tab"
              variant="ghost"
              onClick={() => !tab.props.disabled && setActiveTabIndex(index)}
              className={`tab w-full md:max-w-xs border-2 border-b-6 hover:brightness-105 hover:scale-105
                  ${
                    isActive
                      ? "tab-active bg-chart-1/10 text-foreground border-chart-1/25 font-semibold"
                      : "bg-chart-2/10 text-foreground border-chart-2/25"
                  }
                  ${
                    tab.props.disabled
                      ? "tab-disabled cursor-not-allowed bg-card text-card-foreground border-input/25 hover:brightness-100 hover:scale-100"
                      : ""
                  }
                  `}
            >
              {tab.props.title}
            </Button>
          );
        })}
      </div>

      <Card
        className="
            relative mx-auto w-full h-full flex-1
            py-0 rounded-4xl overflow-hidden
            border-4 border-b-12 border-chart-1/25
            bg-chart-1/10
        "
      >
        {tabs[activeTabIndex]}
      </Card>
    </div>
  );
};
