export const Footer = () => {
  return (
    <footer className="bg-[#0a0f0b] border-t border-[#00ff88]/20 text-white py-12 relative">
      <div className="max-w-[1320px] mx-auto px-6">
        {/* Layout simplificado em 2 colunas */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Contato */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">Contato</h3>
            <a 
              href="mailto:comercial@gecsistemas.com.br" 
              className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
            >
              comercial@gecsistemas.com.br
            </a>
          </div>

          {/* Redes Sociais */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Redes sociais</h3>
            <a 
              href="https://instagram.com/saldar.o" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
            >
              @saldar.o
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-[#00ff88]/20 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Saldar. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Balão Flutuante - GEC SISTEMAS */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <p className="text-xs text-gray-300">
            Criado por <span className="text-[#00ff88] font-semibold">GEC SISTEMAS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
