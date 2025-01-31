import { useQueryState } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Available tab values
type TabValue = "information" | "links" | "template";

interface Props {
  children: React.ReactNode;
}

/**
 * TabsComp - A tabbed navigation component that syncs with URL query parameters
 */
export const TabsComp = ({ children }: Props) => {
  const [tab, setTab] = useQueryState("tab");
  const defaultTab = tab || "information";

  // Update URL query param when tab changes
  const handleTabClick = (value: TabValue) => setTab(value);

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
