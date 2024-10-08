import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileDashboard from "./_components/profile-dashboard";

export default function CardPage() {
  return (
    <main className="relative">
      <ProfileDashboard />
      <div className="container grid max-w-6xl grid-cols-10 gap-8 pt-9">
        <Tabs
          defaultValue="information"
          className="col-span-6 w-full items-start"
        >
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
        <div className="col-span-4 rounded-lg bg-background">Preview</div>
      </div>
      {/* <QRCodeSVG value={"https://www.google.com/"} size={256} /> */}
    </main>
  );
}
