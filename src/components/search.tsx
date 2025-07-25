"use client";
import { MediaItem } from "@/data/HandleRequests";
import Item from "./item";
type Props = {
  data: MediaItem[];
};

export default function SearchBody({ data }: Props) {
  return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {data
          .filter((item) => item.poster_path)
          .map((item) => (
            <Item key={item.id} item={item} />
          ))}
      </div>
  );
}
