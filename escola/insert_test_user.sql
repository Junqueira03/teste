-- Inserir usuário de teste para autenticação
INSERT INTO usuarios (
  nome,
  telefone,
  email,
  senha,
  tipo_usuario,
  ativo,
  data_criacao,
  ultimo_login
) VALUES (
  'Usuário Teste',
  '943 442 334',
  'teste@escola.com',
  'password',
  'admin',
  true,
  NOW(),
  NOW()
);

-- Verificar se o usuário foi inserido
SELECT * FROM usuarios WHERE telefone = '943 442 334';