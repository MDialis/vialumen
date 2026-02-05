import { TabItem, Tabs } from "@/components/Tabs";

export default function Core() {
  const items = [
    {
      title: "Physiology",
      content:
        "The essentials for survival: air, water, food, and shelter. The foundation upon which all other growth is built.",
    },
    {
      title: "Safety",
      content:
        "Finding stability in a chaotic world. Securing your health, finances, and environment to build a worry-free future.",
    },
    {
      title: "Belonging",
      content:
        "Connecting with the world around you. Cultivating deep relationships, community roots, and the power of shared experiences.",
    },
    {
      title: "Esteem",
      content:
        "Building confidence and gaining respect. Recognizing your inner worth and achieving the mastery you deserve.",
    },
    {
      title: "Self-Actualization",
      content:
        "The peak of the journey. Realizing your full potential, pursuing creative growth, and becoming the best version of yourself.",
      isDisabled: true,
    },
  ];

  const defaultIndex = 0;

  return (
    <div>
      <Tabs defaultIndex={defaultIndex}>
        {items.map((item, index) => (
          <TabItem key={`${item.title}-${index}`} title={item.title} disabled={item.isDisabled}>
            <div className="h-full w-full">{item.content}</div>
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}
