export default function Title({ children, className }: { children: string, className?: string; }) {
  return (
    <h2 className={`text-lg md:text-xl lg:text-2xl font-bold ${className}`}>{children}</h2>
  );
}