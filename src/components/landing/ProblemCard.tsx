interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ProblemCard = ({ icon, title, description }: ProblemCardProps) => {
  return (
    <div className="bg-[#0f1410]/60 backdrop-blur-sm border-2 border-[#ff2d55] rounded-2xl p-8 shadow-[0_0_20px_rgba(255,45,85,0.5),0_0_40px_rgba(255,45,85,0.3),0_8px_25px_rgba(255,45,85,0.2)] hover:shadow-[0_0_30px_rgba(255,45,85,0.7),0_0_60px_rgba(255,45,85,0.4),0_15px_40px_rgba(255,45,85,0.3)] hover:-translate-y-2 transition-all duration-300">
      <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg">
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
