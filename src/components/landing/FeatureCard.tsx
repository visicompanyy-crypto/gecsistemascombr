interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white border border-[#e6e6e6] rounded-2xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
      <div className="mb-5">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-[#252F1D] mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-[#6b7280] leading-relaxed">
        {description}
      </p>
    </div>
  );
};
