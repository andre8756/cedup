import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Zap, BarChart3, Lock, Menu, X, Database } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Adiciona scroll suave
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className={`dashboard-nav ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <div className="nav-logo-container">
                <img src="/logotipo-white-semfundo.png" alt="Logo do Solvian" className="nav-logo-icon" />
              </div>
              <span className="nav-brand-text">Solvian</span>
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu">
              <a href="#features" className="desktop-menu-link">Recursos</a>
              <a href="#benefits" className="desktop-menu-link">Benefícios</a>
            </div>

            <div className="nav-buttons">
              <button
                onClick={() => navigate('/login')}
                className="nav-button-login"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate('/cadastro')}
                className="nav-button-signup"
              >
                Cadastrar
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="mobile-menu-icon" /> : <Menu className="mobile-menu-icon" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu">
              <a href="#features" className="mobile-menu-link">Recursos</a>
              <a href="#benefits" className="mobile-menu-link">Benefícios</a>
              <div className="mobile-menu-buttons">
                <button
                  onClick={() => navigate('/login')}
                  className="mobile-button-login"
                >
                  Entrar
                </button>
                <button
                  onClick={() => navigate('/cadastro')}
                  className="mobile-button-signup"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div>
                <h1 className="hero-title">
                  Controle financeiro inteligente para você
                </h1>
                <p className="hero-description">
                  Organize suas finanças, acompanhe seus gastos e tome decisões mais inteligentes com a plataforma Solvian.
                </p>
              </div>

              <div className="hero-buttons">
                <button
                  onClick={() => navigate('/cadastro')}
                  className="hero-button-primary"
                >
                  Começar Gratuitamente
                  <ArrowRight className="hero-button-icon" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="hero-button-secondary"
                >
                  Já tenho conta
                  <ArrowRight className="hero-button-icon" />
                </button>
              </div>

              <p className="hero-features">
                ✓ Sem cartão de crédito necessário • ✓ Acesso imediato • ✓ Suporte 24/7
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-container">
                <div className="hero-visual-blur"></div>
                <div className="hero-visual-card">
                  <div className="hero-visual-content">
                    <div className="hero-visual-item">
                      <div className="hero-visual-icon-container">
                        <BarChart3 className="hero-visual-icon" />
                      </div>
                      <div className="hero-visual-text">
                        <p className="hero-visual-label">Dashboard em Tempo Real</p>
                        <p className="hero-visual-value">Acompanhe tudo</p>
                      </div>
                    </div>

                    <div className="hero-visual-item">
                      <div className="hero-visual-icon-container">
                        <Zap className="hero-visual-icon" />
                      </div>
                      <div className="hero-visual-text">
                        <p className="hero-visual-label">Processamento Ultra-Rápido</p>
                        <p className="hero-visual-value">Resultados instantâneos</p>
                      </div>
                    </div>

                    <div className="hero-visual-item">
                      <div className="hero-visual-icon-container">
                        <Lock className="hero-visual-icon" />
                      </div>
                      <div className="hero-visual-text">
                        <p className="hero-visual-label">Segurança Máxima</p>
                        <p className="hero-visual-value">Seus dados protegidos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Recursos Poderosos</h2>
            <p className="features-subtitle">Tudo que você precisa para ter controle total das suas finanças</p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: BarChart3,
                title: 'Análise Avançada',
                description: 'Visualize seus gastos e receitas com relatórios intuitivos em tempo real.'
              },
              {
                icon: Lock,
                title: 'Segurança Máxima',
                description: 'Proteção de dados com criptografia de nível militar e conformidade LGPD.'
              },
              {
                icon: Zap,
                title: 'Automatização',
                description: 'Automatize o registro de suas transações e ganhe tempo para focar no importante.'
              },
              {
                icon: Database,
                title: 'Backup Automático',
                description: 'Seus dados são salvos automaticamente com redundância completa.'
              },
              {
                icon: ArrowRight,
                title: 'Integrações',
                description: 'Conecte-se com as ferramentas que você já usa no seu dia a dia.'
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <feature.icon className="feature-icon" />
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-grid">
            <div>
              <h2 className="benefits-title">Por que escolher Solvian?</h2>

              <div className="benefits-list">
                {[
                  'Interface limpa e intuitiva para todos os níveis',
                  'Suporte técnico especializado em português',
                  'Atualizações constantes com novas funcionalidades'
                ].map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <Check />
                    </div>
                    <p className="benefit-text">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2 className="cta-title">Transforme sua vida financeira hoje</h2>
            <p className="cta-description">
              Comece a ter controle total das suas finanças com Solvian
            </p>

            <button
              onClick={() => navigate('/cadastro')}
              className="cta-button"
            >
              Criar conta grátis
              <ArrowRight className="cta-button-icon" />
            </button>

            <p className="cta-note">Comece agora, sem cartão de crédito necessário</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img src="/logotipo-white-semfundo.png" alt="Logo do Solvian" className="footer-logo-icon" />
            </div>
            <span className="footer-brand-text">Solvian</span>
          </div>
          <p className="footer-description">Solução completa para controle financeiro pessoal.</p>
          <div className="footer-bottom">
            <p>&copy; 2025 Solvian. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;


