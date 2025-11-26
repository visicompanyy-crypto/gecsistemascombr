interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ProblemCard = ({ icon, title, description }: ProblemCardProps) => {
  return (
    <div className="bg-[#0f1410]/60 backdrop-blur-sm border-2 border-[#ff0055]/30 rounded-3xl p-10 shadow-[0_8px_25px_rgba(255,0,85,0.15)] hover:shadow-[0_15px_40px_rgba(255,0,85,0.25)] hover:-translate-y-2 transition-all duration-300">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#ff0055]/10">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-base text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
