interface TestimonialCardProps {
  name: string;
  location: string;
  company: string;
  testimonial: string;
  initials: string;
}

export const TestimonialCard = ({ name, location, company, testimonial, initials }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-10 border-2 border-fintech-light/40 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
      {/* Decorative Quote */}
      <div className="absolute -top-4 -left-2 text-8xl text-fintech-light/30 font-serif leading-none select-none pointer-events-none">
        "
      </div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-20 h-20 rounded-full bg-primary border-3 border-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {initials}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[#252F1D]">
            {name}
          </h3>
          <p className="text-sm text-[#6b7280]">
            {location}
          </p>
          <p className="text-xs text-[#6b7280] font-medium">
            {company}
          </p>
        </div>
      </div>

      <p className="text-base text-[#4a4a4a] leading-relaxed italic relative z-10">
        {testimonial}
      </p>
    </div>
  );
};
