import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileDashboard from "./_components/profile-dashboard";

export default function CardPage() {
  return (
    <main className="relative">
      <ProfileDashboard />
      <div className="container max-w-6xl pt-9">
        <Tabs defaultValue="information" className="w-full items-start">
          <TabsList className="w-full">
            <TabsTrigger value="information">Information</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
          </TabsList>
          <TabsContent value="information">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="links">Change your password here.</TabsContent>
          <TabsContent value="template">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
