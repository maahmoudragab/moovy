import React, { forwardRef } from "react";

function Title({ children, className }: { children: string; className?: string }, ref: React.Ref<HTMLHeadingElement>) {
  return (
    <h2 ref={ref} className={`text-lg md:text-xl lg:text-2xl font-bold ${className ?? ""}`}>
      {children}
    </h2>
  );
}

export default forwardRef(Title);
