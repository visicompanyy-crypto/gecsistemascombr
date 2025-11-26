export const Footer = () => {
  return (
    <footer className="bg-landing-text text-white py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/src/assets/logo.png" alt="Saldar" className="h-10 w-10 brightness-0 invert" />
              <span className="text-2xl font-bold">Saldar</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Sistema financeiro criado para empresas brasileiras
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-landing-green-accent transition-colors text-sm">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-landing-green-accent transition-colors text-sm">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-landing-green-accent transition-colors text-sm">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-landing-green-accent transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes sociais</h3>
            <p className="text-sm text-white/70">
              Em breve
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            © 2025 Saldar. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
