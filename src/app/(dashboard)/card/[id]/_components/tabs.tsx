import { useQueryState } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabsComp = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useQueryState("tab");

  const handleTabClick = (tab: string) => {
    setTab(tab);
  };

  const defaultTab = tab || "information";
  return (
    <Tabs defaultValue={defaultTab} className="col-span-8 w-full items-start">
      <TabsList className="w-full">
        <TabsTrigger
          value="information"
          onClick={() => handleTabClick("information")}
        >
          Information
        </TabsTrigger>
        <TabsTrigger value="links" onClick={() => handleTabClick("links")}>
          Links
        </TabsTrigger>
        <TabsTrigger
          value="template"
          onClick={() => handleTabClick("template")}
        >
          Template
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
