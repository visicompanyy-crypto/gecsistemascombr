interface TestimonialCardProps {
  name: string;
  location: string;
  company: string;
  testimonial: string;
  initials: string;
}

export const TestimonialCard = ({ name, location, company, testimonial, initials }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] transition-all duration-300 relative">
      {/* Decorative Quote */}
      <div className="absolute -top-4 -left-2 text-8xl text-landing-green/30 font-serif leading-none select-none pointer-events-none">
        "
      </div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-20 h-20 rounded-full bg-landing-green border-3 border-landing-green flex items-center justify-center text-white font-bold text-xl shadow-lg">
          {initials}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-landing-text">
            {name}
          </h3>
          <p className="text-sm text-gray-600">
            {location}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {company}
          </p>
        </div>
      </div>

      <p className="text-base text-gray-700 leading-relaxed italic relative z-10">
        {testimonial}
      </p>
    </div>
  );
};
