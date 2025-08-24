/**
 * Configuração do cliente Supabase
 * Credenciais configuradas para o projeto do usuário
 */

const SUPABASE_URL = 'https://fsmnmggjklhxfkfnjxgc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbW5tZ2dqa2xoeGZrZm5qeGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDE0NTAsImV4cCI6MjA3MTE3NzQ1MH0.dMRH2DTAE8a1Vnyw9a8OiP5nTZetQy70hQgMV_a7jwo';

try {
  // Inicializar cliente Supabase
  const { createClient } = supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Exporta para ser usado em outros arquivos JS
  window.supabaseClient = supabaseClient;
  
  console.log('✅ Cliente Supabase inicializado com sucesso');
  
  // Detectar automaticamente qual tabela usar
  async function detectarTabela() {
    try {
      // Tentar tabela 'usuario' primeiro
      const { error: errorUsuario } = await supabaseClient
        .from('usuario')
        .select('count', { count: 'exact', head: true });
      
      if (!errorUsuario) {
        window.supabaseTableName = 'usuario';
        console.log('✅ Usando tabela "usuario"');
        return;
      }
      
      // Tentar tabela 'usuarios'
      const { error: errorUsuarios } = await supabaseClient
        .from('usuarios')
        .select('count', { count: 'exact', head: true });
      
      if (!errorUsuarios) {
        window.supabaseTableName = 'usuarios';
        console.log('✅ Usando tabela "usuarios"');
        return;
      }
      
      // Se nenhuma tabela existir, usar 'usuario' como padrão
      window.supabaseTableName = 'usuario';
      console.warn('⚠️ Nenhuma tabela de usuários encontrada. Usando "usuario" como padrão.');
      
    } catch (error) {
      console.warn('⚠️ Erro ao detectar tabela:', error);
      window.supabaseTableName = 'usuario';
    }
  }
  
  // Detectar tabela quando a página carregar
  detectarTabela();
  
} catch (error) {
  console.error('❌ Erro ao inicializar Supabase:', error);
  window.supabaseClient = null;
}