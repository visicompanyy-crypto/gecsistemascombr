interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-[#0f1410]/60 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_25px_rgba(0,255,136,0.1)] hover:shadow-[0_15px_40px_rgba(0,255,136,0.2)] hover:-translate-y-2 transition-all duration-300 group border border-[#00ff88]/20">
      <div className="mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00cc6f] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-sm text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
