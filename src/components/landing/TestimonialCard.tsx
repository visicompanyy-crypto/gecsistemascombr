interface TestimonialCardProps {
  name: string;
  location: string;
  company: string;
  testimonial: string;
  initials: string;
}

export const TestimonialCard = ({ name, location, company, testimonial, initials }: TestimonialCardProps) => {
  return (
    <div className="bg-[#0f1410]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#00ff88]/20 shadow-[0_8px_25px_rgba(0,255,136,0.1)] hover:shadow-[0_12px_35px_rgba(0,255,136,0.2)] transition-all duration-300 relative">
      {/* Decorative Quote */}
      <div className="absolute -top-3 -left-1 text-6xl text-[#00ff88]/30 font-serif leading-none select-none pointer-events-none">
        "
      </div>
      
      <div className="flex items-center gap-4 mb-5 relative z-10">
        <div className="w-14 h-14 rounded-full bg-[#00ff88] border-2 border-[#00ff88] flex items-center justify-center text-[#0a0f0b] font-bold text-base shadow-lg">
          {initials}
        </div>
        
        <div>
          <h3 className="text-base font-semibold text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-300">
            {location}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {company}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed italic relative z-10">
        {testimonial}
      </p>
    </div>
  );
};
