import Image from "next/image";
import Link from "next/link";

import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export function EmptyCompanyCard({ companyId }: { companyId: number }) {
  return (
    <div className="col-span-full flex w-full flex-col items-center justify-center gap-3 rounded-md border bg-background py-9">
      <Image
        src="/not-available.svg"
        height={200}
        width={200}
        alt="No Cards Available"
      />
      <p className="pt-2 font-semibold text-muted-foreground">
        No Cards Available
      </p>
      <Button className="gap-2" asChild>
        <Link href={`/card/new?company=${companyId}`}>
          <IconPlus className="size-4" /> Add Card
        </Link>
      </Button>
    </div>
  );
}
