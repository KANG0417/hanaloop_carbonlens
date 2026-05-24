interface SectionTitleProps {
  title: string;
  description?: string;
}

export const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
};
