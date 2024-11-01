import { cn } from "@/lib/utils";

export default function PhoneMockup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto h-full w-[290px] rounded-[2.5rem] border-[10px] border-gray-900 bg-gray-900 shadow-xl",
        className
      )}
    >
      <div className="absolute left-1/2 top-1.5 z-40 flex h-[1.5rem] w-[80px] -translate-x-1/2 items-center justify-end rounded-full bg-gray-900 px-2">
        <div className="size-3 rounded-full border-2 border-gray-600 bg-gray-900"></div>
      </div>
      <div className="absolute -start-[13px] top-[124px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900"></div>
      <div className="absolute -start-[13px] top-[178px] z-40 h-[46px] w-[3px] rounded-s-lg bg-gray-900"></div>
      <div className="absolute -end-[13px] top-[142px] z-40 h-[64px] w-[3px] rounded-e-lg bg-gray-900"></div>
      <div className="h-[572px] w-[272px] overflow-hidden rounded-[2rem] bg-white @container">
        {children}
      </div>
    </div>
  );
}
