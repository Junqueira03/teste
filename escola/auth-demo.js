/**
 * Sistema de Autenticação Demo
 * Simula autenticação sem depender do Supabase
 */

// Usuários de demonstração
const usuariosDemo = [
  {
    id: 1,
    nome: 'João Silva',
    telefone: '943 442 334',
    email: 'joao@escola.com',
    senha: 'password',
    tipo_usuario: 'admin',
    ativo: true
  },
  {
    id: 2,
    nome: 'Maria Santos',
    telefone: '923 456 789',
    email: 'maria@escola.com',
    senha: '123456',
    tipo_usuario: 'professor',
    ativo: true
  }
];

// Função para simular login
async function fazerLoginDemo(telefone, senha) {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Buscar usuário
  const usuario = usuariosDemo.find(u => 
    u.telefone === telefone && u.senha === senha && u.ativo
  );
  
  if (usuario) {
    // Login bem-sucedido
    const dadosUsuario = {
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      ultimo_login: new Date().toISOString()
    };
    
    // Salvar no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
    
    return { success: true, usuario: dadosUsuario };
  } else {
    return { success: false, error: 'Telefone ou senha incorretos.' };
  }
}

// Função para recuperar senha
async function recuperarSenhaDemo(telefone) {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verificar se o telefone existe
  const usuario = usuariosDemo.find(u => u.telefone === telefone && u.ativo);
  
  if (usuario) {
    return { 
      success: true, 
      message: `Instruções para recuperar a senha foram enviadas para o telefone ${telefone}.` 
    };
  } else {
    return { 
      success: false, 
      error: 'Telefone não encontrado no sistema.' 
    };
  }
}

// Função para registrar novo usuário no sistema demo
async function registrarUsuarioDemo(dadosUsuario) {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Verificar se telefone ou email já existem
  const telefoneExiste = usuariosDemo.find(u => u.telefone === dadosUsuario.telefone);
  const emailExiste = usuariosDemo.find(u => u.email === dadosUsuario.email);
  
  if (telefoneExiste) {
    return { success: false, error: 'Este telefone já está registrado.' };
  }
  
  if (emailExiste) {
    return { success: false, error: 'Este email já está registrado.' };
  }
  
  // Criar novo usuário
  const novoUsuario = {
    id: usuariosDemo.length + 1,
    nome: dadosUsuario.nome,
    telefone: dadosUsuario.telefone,
    email: dadosUsuario.email,
    senha: dadosUsuario.senha,
    tipo_usuario: 'aluno',
    ativo: true
  };
  
  // Adicionar à lista de usuários
  usuariosDemo.push(novoUsuario);
  
  console.log('Usuário registrado no sistema demo:', novoUsuario);
  
  return { success: true, usuario: novoUsuario };
}

// Exportar funções para uso global
window.authDemo = {
  fazerLogin: fazerLoginDemo,
  recuperarSenha: recuperarSenhaDemo,
  registrar: registrarUsuarioDemo,
  usuarios: usuariosDemo
};