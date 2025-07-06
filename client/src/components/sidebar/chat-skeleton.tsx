import { Skeleton } from "../ui/skeleton";

type ChatSkeletonProps = {
  isRecent?: boolean;
};

export const ChatSkeleton = ({ isRecent }: ChatSkeletonProps) => {
  if (isRecent) {
    return (
      <div className="py-[17px] px-[20px] flex items-center gap-4 bg-[#E6EBF5]">
        <Skeleton className="size-[35px] rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-[15px] px-[20px] flex items-center gap-4 bg-[#E6EBF5]">
      <Skeleton className="size-[35px] rounded-full" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
};
