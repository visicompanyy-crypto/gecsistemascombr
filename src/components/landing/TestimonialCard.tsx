interface TestimonialCardProps {
  name: string;
  location: string;
  company: string;
  testimonial: string;
  initials: string;
}

export const TestimonialCard = ({ name, location, company, testimonial, initials }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
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

      <p className="text-base text-[#4a4a4a] leading-relaxed italic">
        "{testimonial}"
      </p>
    </div>
  );
};
