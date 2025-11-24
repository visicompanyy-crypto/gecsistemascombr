interface TestimonialCardProps {
  name: string;
  location: string;
  company: string;
  testimonial: string;
  initials: string;
}

export const TestimonialCard = ({ name, location, company, testimonial, initials }: TestimonialCardProps) => {
  return (
    <div className="stagger-item bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_50px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--neon-green))]/20 to-[hsl(var(--primary))]/20 flex items-center justify-center text-[hsl(var(--primary))] font-bold text-xl">
          {initials}
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {name}
          </h3>
          <p className="text-sm text-gray-500">
            {location}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {company}
          </p>
        </div>
      </div>

      <p className="text-base text-gray-700 leading-relaxed">
        "{testimonial}"
      </p>
      
      <div className="mt-6 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[hsl(var(--neon-green-dim))] text-xl">★</span>
        ))}
      </div>
    </div>
  );
};
