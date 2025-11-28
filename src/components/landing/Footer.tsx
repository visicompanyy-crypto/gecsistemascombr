import { Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#0a0f0b] border-t border-[#00ff88]/20 text-white py-12 relative">
      <div className="max-w-[1320px] mx-auto px-6">
        {/* Layout em 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Contato - Email */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <a 
              href="mailto:comercial@gecsistemas.com.br" 
              className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
            >
              <Mail size={16} />
              comercial@gecsistemas.com.br
            </a>
          </div>

          {/* Telefones */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <div className="space-y-3">
              <a 
                href="https://wa.me/5551842445505" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
              >
                <Phone size={16} />
                <span>Sistema: (51) 8424-4505</span>
              </a>
              <a 
                href="https://wa.me/5551989772978" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center md:justify-start gap-2 text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
              >
                <Phone size={16} />
                <span>Assinaturas: (51) 98977-2978</span>
              </a>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="md:text-right">
            <h3 className="text-lg font-semibold mb-4">Redes sociais</h3>
            <a 
              href="https://www.instagram.com/saldar.o" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center md:justify-end gap-2 text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
            >
              <Instagram size={16} />
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
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
          <p className="text-xs text-gray-400">
            Criado por <span className="text-white font-medium">GEC SISTEMAS</span>
          </p>
          <a 
            href="https://www.instagram.com/saldar.o" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#00ff88] transition-colors"
            aria-label="Instagram @saldar.o"
          >
            <Instagram size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};
