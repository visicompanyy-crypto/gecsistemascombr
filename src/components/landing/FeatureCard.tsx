interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-300 group">
      <div className="mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
