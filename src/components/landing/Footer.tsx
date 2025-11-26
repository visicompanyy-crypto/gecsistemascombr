export const Footer = () => {
  return (
    <footer className="bg-[#0a0f0b] border-t border-[#00ff88]/20 text-white py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/src/assets/logo.png" alt="Saldar" className="h-10 w-10 brightness-0 invert" />
              <span className="text-2xl font-bold">Saldar</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sistema financeiro criado para empresas brasileiras
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes sociais</h3>
            <p className="text-sm text-gray-400">
              Em breve
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#00ff88]/20 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Saldar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
