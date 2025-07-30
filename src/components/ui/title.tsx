export default function Title({ text, className }: { text: string, className?: string; }) {
  return (
    <h2 className={`text-lg md:text-xl lg:text-2xl font-bold ${className}`}>{text}</h2>
  );
}