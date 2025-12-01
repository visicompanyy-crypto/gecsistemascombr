export const NeonBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0b] via-[#0f1410] to-[#0a0f0b]" />
      
      {/* Top radial gradient */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.25) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Main organic blob - animated */}
      <div 
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] opacity-20 animate-float-organic"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.1) 40%, transparent 70%)',
          filter: 'blur(100px)',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%'
        }}
      />
      
      {/* Bottom right blob */}
      <div 
        className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(0,204,111,0.3) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float-organic 20s ease-in-out infinite',
          animationDelay: '5s'
        }}
      />
      
      {/* Bottom left accent */}
      <div 
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,136,0.35) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animation: 'float-organic 15s ease-in-out infinite',
          animationDelay: '2s'
        }}
      />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      
      {/* Sweeping light effect */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-10 animate-light-sweep"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.3) 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
