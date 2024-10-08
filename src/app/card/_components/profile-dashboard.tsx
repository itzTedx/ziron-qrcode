import Image from "next/image";

import { IconArrowRight } from "@tabler/icons-react";

import { Icons } from "@/components/assets/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { card } from "@/constants";

export default function ProfileDashboard() {
  return (
    <div className="-mt-20">
      <div className="h-48 bg-yellow-500"></div>
      <div className="container relative -mt-12 grid max-w-6xl grid-cols-10 divide-x rounded-lg bg-background py-6 shadow-lg shadow-muted/30">
        <div className="col-span-4 flex justify-between px-6">
          <div className="absolute -top-1/2 left-5 size-36 translate-y-1/3 overflow-hidden rounded-full border-4 border-background">
            <Image src="/sridhun.jpg" fill alt="Profile Image" />
          </div>
          <div className="ml-32">
            <Badge variant="secondary">{card.company.name}</Badge>
            <h2 className="text-2xl font-semibold">{card.name}</h2>
            <p className="text-sm">{card.designation}</p>
          </div>
          <span>Edit</span>
        </div>

        <div className="col-span-4 flex items-center justify-between gap-4 px-6">
          <div className="w-full space-y-2">
            <h3>Link</h3>
            <Input
              readOnly
              className="w-full bg-gray-50"
              defaultValue={"https://zironmedia.com/sridhun-prakash"}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-nowrap text-sm">
              Customize url <IconArrowRight className="size-4" />
            </div>
            <Button variant="secondary" className="flex items-center gap-1.5">
              <Icons.share className="size-4 stroke-[1.5]" />
              Share url
            </Button>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-3 px-6">
          <Button
            variant="outline"
            className="border-destructive text-destructive"
          >
            Delete
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
