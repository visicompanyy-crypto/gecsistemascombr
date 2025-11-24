interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ProblemCard = ({ icon, title, description }: ProblemCardProps) => {
  return (
    <div className="bg-white border border-[#e6e6e6] rounded-2xl p-10 shadow-[0_5px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-[#252F1D] mb-3">
        {title}
      </h3>
      
      <p className="text-base text-[#4a4a4a] leading-relaxed">
        {description}
      </p>
    </div>
  );
};
