import { IconArrowsMaximize } from "@tabler/icons-react";

import CardTemplate from "@/components/features/templates/card-template";
import DefaultTemplate from "@/components/features/templates/default-template";
import ModernTemplate from "@/components/features/templates/modern-template";
import PhoneMockup from "@/components/phone-mockup";
import { ResponsiveModal } from "@/components/responsive-modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Company, Person } from "@/types";

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  cardData: Person;
  company: Company[];
}

export const Preview = ({
  isOpen,
  closeModal,
  cardData,
  company: data,
}: Props) => {
  return (
    <Card className="sticky top-24 col-span-4 hidden h-fit rounded-lg bg-background @container md:block">
      <CardHeader className="flex-row items-center justify-between border-b py-4">
        <h5>Preview</h5>
        <ResponsiveModal
          isOpen={isOpen}
          closeModal={closeModal}
          trigger={<IconArrowsMaximize className="size-4 text-gray-600" />}
          title="Preview"
          className="max-w-sm gap-0"
        >
          <CardContent className="light relative p-0">
            <ScrollArea className="h-[640px]">
              {(() => {
                switch (cardData.template) {
                  case "default":
                    return <DefaultTemplate card={cardData} company={data} />;
                  case "modern":
                    return <ModernTemplate card={cardData} company={data} />;
                  case "card":
                    return <CardTemplate card={cardData} company={data} />;
                  default:
                    return <DefaultTemplate card={cardData} company={data} />;
                }
              })()}
            </ScrollArea>
          </CardContent>
        </ResponsiveModal>

        {/* <IconDots /> */}
      </CardHeader>
      <CardContent className="relative py-5">
        <PhoneMockup>
          <ScrollArea className="h-full">
            {(() => {
              switch (cardData.template) {
                case "default":
                  return <DefaultTemplate card={cardData} company={data} />;
                case "modern":
                  return <ModernTemplate card={cardData} company={data} />;
                case "card":
                  return <CardTemplate card={cardData} company={data} />;
                default:
                  return <DefaultTemplate card={cardData} company={data} />;
              }
            })()}
          </ScrollArea>
        </PhoneMockup>
      </CardContent>
    </Card>
  );
};
