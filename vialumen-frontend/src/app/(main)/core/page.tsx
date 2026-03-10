"use client";

import { useSearchParams } from "next/navigation";
import { TabItem, Tabs } from "@/components/Tabs";
import { Suspense } from "react";

function CoreContent() {
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");

  const items = [
    {
      id: "physiology",
      title: "Physiology",
      content:
        "The essentials for survival: air, water, food, and shelter. The foundation upon which all other growth is built.",
      theme: "physiology-theme",
      isDisabled: false,
    },
    {
      id: "safety",
      title: "Safety",
      content:
        "Finding stability in a chaotic world. Securing your health, finances, and environment to build a worry-free future.",
      theme: "safety-theme",
      isDisabled: false,
    },
    {
      id: "belonging",
      title: "Belonging",
      content:
        "Connecting with the world around you. Cultivating deep relationships, community roots, and the power of shared experiences.",
      theme: "belonging-theme",
      isDisabled: false,
    },
    {
      id: "esteem",
      title: "Esteem",
      content:
        "Building confidence and gaining respect. Recognizing your inner worth and achieving the mastery you deserve.",
      theme: "esteem-theme",
      isDisabled: false,
    },
    {
      id: "actualization",
      title: "Self-Actualization",
      content:
        "The peak of the journey. Realizing your full potential, pursuing creative growth, and becoming the best version of yourself.",
      theme: "actualization-theme",
      isDisabled: false,
    },
  ];

  const foundIndex = items.findIndex((item) => item.id === activeTabParam);
  const defaultIndex = foundIndex !== -1 ? foundIndex : 2;

  return (
    <div>
      <Tabs key={defaultIndex} defaultIndex={defaultIndex}>
        {items.map((item, index) => (
          <TabItem
            key={`${item.title}-${index}`}
            title={item.title}
            theme={item.theme}
            disabled={item.isDisabled}
          >
            <div className="h-full w-full">{item.content}</div>
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}

export default function Core() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoreContent />
    </Suspense>
  );
}
