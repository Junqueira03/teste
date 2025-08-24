/**
 * Versão corrigida do sistema de registro para Supabase
 * Remove campos que não existem na tabela atual
 */

// Função de registro simplificada para a estrutura atual da tabela
async function registrarUsuarioSupabase(dadosUsuario) {
  try {
    // Dados básicos que provavelmente existem na tabela
    const usuarioSimplificado = {
      nome: dadosUsuario.nome,
      telefone: dadosUsuario.telefone,
      email: dadosUsuario.email,
      senha: dadosUsuario.senha
    };

    console.log('Tentando inserir usuário:', usuarioSimplificado);

    // Usar o nome da tabela detectado automaticamente
    const tableName = window.supabaseTableName || 'usuario';
    console.log('Usando tabela:', tableName);

    const { data, error } = await window.supabaseClient
      .from(tableName)
      .insert([usuarioSimplificado])
      .select();

    if (error) {
      console.error('Erro Supabase:', error);
      throw error;
    }

    console.log('Usuário inserido com sucesso:', data);
    return { success: true, user: data[0] };

  } catch (error) {
    console.error('Erro na inserção:', error);
    return { success: false, error: error.message };
  }
}

// Função para verificar duplicatas simplificada
async function verificarDuplicatasSupabase(telefone, email) {
  try {
    // Usar o nome da tabela detectado automaticamente
    const tableName = window.supabaseTableName || 'usuario';
    
    // Verificar telefone
    const { data: telefoneExiste } = await window.supabaseClient
      .from(tableName)
      .select('telefone')
      .eq('telefone', telefone)
      .single();

    if (telefoneExiste) {
      return { exists: true, field: 'telefone' };
    }

    // Verificar email
    const { data: emailExiste } = await window.supabaseClient
      .from(tableName)
      .select('email')
      .eq('email', email)
      .single();

    if (emailExiste) {
      return { exists: true, field: 'email' };
    }

    return { exists: false };

  } catch (error) {
    // Se der erro, assumir que não existe (pode ser erro de "não encontrado")
    return { exists: false };
  }
}

// Exportar para uso global
window.supabaseRegistration = {
  registrar: registrarUsuarioSupabase,
  verificarDuplicatas: verificarDuplicatasSupabase
};