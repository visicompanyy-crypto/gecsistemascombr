interface MacBookMockupProps {
  imageSrc: string;
  className?: string;
}

export const MacBookMockup = ({ imageSrc, className = "" }: MacBookMockupProps) => {
  return (
    <div className={`macbook-container ${className}`}>
      <div className="macbook-frame">
        <div className="macbook-screen">
          <img 
            src={imageSrc} 
            alt="Dashboard Preview" 
            className="w-full h-full object-cover"
          />
          <div className="screen-glare" />
        </div>
      </div>
      
      <style>{`
        .macbook-container {
          perspective: 1200px;
          display: inline-block;
        }
        
        .macbook-frame {
          position: relative;
          padding: 8px;
          background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 50%, #a8a8a8 100%);
          border-radius: 14px;
          transform: rotateY(-18deg) rotateX(8deg);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.35),
            0 15px 30px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }
        
        .macbook-frame:hover {
          transform: rotateY(-12deg) rotateX(5deg) scale(1.02);
        }
        
        .macbook-screen {
          position: relative;
          aspect-ratio: 16/10;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 
            inset 0 0 0 1px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .macbook-screen img {
          border-radius: 8px;
        }
        
        .screen-glare {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.05) 100%
          );
          pointer-events: none;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};
