/**
 * Gerenciador de Autenticação
 * Controla login, logout e proteção de páginas
 */

class AuthManager {
  constructor() {
    this.usuarioLogado = null;
    this.init();
  }

  init() {
    this.carregarUsuarioLogado();
  }

  // Carregar dados do usuário do localStorage
  carregarUsuarioLogado() {
    const userData = localStorage.getItem('usuarioLogado');
    if (userData) {
      try {
        this.usuarioLogado = JSON.parse(userData);
        return this.usuarioLogado;
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        this.logout();
      }
    }
    return null;
  }

  // Verificar se o usuário está logado
  estaLogado() {
    return this.usuarioLogado !== null;
  }

  // Obter dados do usuário logado
  getUsuario() {
    return this.usuarioLogado;
  }

  // Fazer logout
  logout() {
    localStorage.removeItem('usuarioLogado');
    this.usuarioLogado = null;
    
    // Redirecionar para a página de login
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('index.html')) {
      window.location.href = 'index.html';
    }
  }

  // Proteger página (redirecionar para login se não estiver logado)
  protegerPagina() {
    if (!this.estaLogado()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }

  // Verificar se o usuário tem permissão para acessar uma funcionalidade
  temPermissao(tipoRequerido) {
    if (!this.estaLogado()) {
      return false;
    }

    const usuario = this.getUsuario();
    const perfil = usuario.perfil || usuario.tipo_usuario;
    
    // Admin tem acesso a tudo
    if (perfil === 'admin') {
      return true;
    }

    // Professor tem acesso limitado
    if (perfil === 'professor') {
      // Professor só pode acessar horários
      return tipoRequerido === 'horarios';
    }

    // Verificar permissões específicas para compatibilidade
    switch (tipoRequerido) {
      case 'admin':
        return perfil === 'admin';
      case 'professor':
        return ['admin', 'professor'].includes(perfil);
      case 'horarios':
        return ['admin', 'professor'].includes(perfil);
      case 'alunos':
      case 'encarregados':
      case 'professores':
      case 'disciplinas':
      case 'turmas':
      case 'propinas':
        return perfil === 'admin';
      default:
        return false;
    }
  }

  // Verificar se é admin
  isAdmin() {
    const usuario = this.getUsuario();
    const perfil = usuario?.perfil || usuario?.tipo_usuario;
    return perfil === 'admin';
  }

  // Verificar se é professor
  isProfessor() {
    const usuario = this.getUsuario();
    const perfil = usuario?.perfil || usuario?.tipo_usuario;
    return perfil === 'professor';
  }

  // Aplicar controle de acesso aos links da sidebar
  aplicarControleAcesso() {
    if (!this.estaLogado()) return;

    const usuario = this.getUsuario();
    const perfil = usuario.perfil || usuario.tipo_usuario;

    // Se for professor, desabilitar todos os links exceto horários
    if (perfil === 'professor') {
      const sidebarLinks = document.querySelectorAll('.sidebar-link');
      sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Manter apenas o link de horários ativo
        if (!href.includes('horarios.html') && href !== '#') {
          link.style.opacity = '0.5';
          link.style.pointerEvents = 'none';
          link.style.cursor = 'not-allowed';
          link.title = 'Acesso restrito para professores';
        }
      });

      // Desabilitar botões de ação rápida no painel
      const actionButtons = document.querySelectorAll('.action-button');
      actionButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href && !href.includes('horarios')) {
          button.style.opacity = '0.5';
          button.style.pointerEvents = 'none';
          button.style.cursor = 'not-allowed';
          button.title = 'Acesso restrito para professores';
        }
      });

      // Desabilitar cards do dashboard
      const dashboardCards = document.querySelectorAll('.dashboard-card');
      dashboardCards.forEach(card => {
        const onclick = card.getAttribute('onclick');
        if (onclick && !onclick.includes('horarios')) {
          card.style.opacity = '0.5';
          card.style.pointerEvents = 'none';
          card.style.cursor = 'not-allowed';
          card.title = 'Acesso restrito para professores';
        }
      });
    }
  }

  // Atualizar informações do usuário no localStorage
  atualizarUsuario(novosDados) {
    if (this.usuarioLogado) {
      this.usuarioLogado = { ...this.usuarioLogado, ...novosDados };
      localStorage.setItem('usuarioLogado', JSON.stringify(this.usuarioLogado));
    }
  }

  // Verificar se a sessão ainda é válida (opcional - para implementar expiração)
  verificarSessao() {
    const usuario = this.getUsuario();
    if (usuario && usuario.ultimo_login) {
      const ultimoLogin = new Date(usuario.ultimo_login);
      const agora = new Date();
      const diferencaHoras = (agora - ultimoLogin) / (1000 * 60 * 60);
      
      // Sessão expira após 24 horas (configurável)
      if (diferencaHoras > 24) {
        this.logout();
        return false;
      }
    }
    return true;
  }

  // Mostrar informações do usuário na interface
  mostrarInfoUsuario(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento && this.estaLogado()) {
      const usuario = this.getUsuario();
      elemento.textContent = `Olá, ${usuario.nome}`;
    }
  }

  // Criar menu de usuário
  criarMenuUsuario(containerId) {
    const container = document.getElementById(containerId);
    if (!container || !this.estaLogado()) {
      return;
    }

    const usuario = this.getUsuario();
    
    container.innerHTML = `
      <div class="user-menu">
        <div class="user-info">
          <span class="user-name">${usuario.nome}</span>
          <span class="user-type">${this.getTipoUsuarioTexto(usuario.tipo_usuario)}</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="authManager.logout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sair
        </button>
      </div>
    `;
  }

  // Obter texto do tipo de usuário
  getTipoUsuarioTexto(tipo) {
    switch (tipo) {
      case 'admin':
        return 'Administrador';
      case 'professor':
        return 'Professor';
      case 'usuario':
        return 'Usuário';
      default:
        return 'Usuário';
    }
  }
}

// Instância global do gerenciador de autenticação
window.authManager = new AuthManager();

// Função para proteger páginas automaticamente
function protegerPagina() {
  return window.authManager.protegerPagina();
}

// Função para logout
function logout() {
  window.authManager.logout();
}

// Verificar autenticação quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Lista de páginas que requerem autenticação
  const paginasProtegidas = [
    'painel.html',
    'alunos.html',
    'cadastrar-aluno.html',
    'professores.html',
    'turmas.html',
    'disciplinas.html',
    'encarregados.html',
    'horarios.html',
    'cadastrar-turma.html',
    'cadastrar-professor.html',
    'cadastrar-encarregado.html',
    'cadastrar-disciplina.html',
    'cadastrar-horario.html'
  ];

  const paginaAtual = window.location.pathname.split('/').pop();
  
  // Se estiver em uma página protegida, verificar autenticação
  if (paginasProtegidas.includes(paginaAtual)) {
    if (!window.authManager.protegerPagina()) {
      return; // Página redirecionada para login
    }
    
    // Verificar se a sessão ainda é válida
    window.authManager.verificarSessao();

    // Verificar permissões específicas da página
    const usuario = window.authManager.getUsuario();
    const perfil = usuario?.perfil || usuario?.tipo_usuario;

    if (perfil === 'professor') {
      // Professor só pode acessar painel e horários
      const paginasPermitidas = ['painel.html', 'horarios.html'];
      
      if (!paginasPermitidas.includes(paginaAtual)) {
        alert('Acesso negado. Professores só podem acessar a página de Horários.');
        window.location.href = 'painel.html';
        return;
      }
    }

    // Aplicar controle de acesso visual após um pequeno delay
    setTimeout(() => {
      window.authManager.aplicarControleAcesso();
    }, 100);
  }
  
  // Se estiver na página de login e já estiver logado, redirecionar para o painel
  if (paginaAtual === 'index.html' && window.authManager.estaLogado()) {
    window.location.href = 'painel.html';
  }
});

// Exportar para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
}