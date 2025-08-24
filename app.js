const form = document.getElementById('form-user');
const userList = document.getElementById('user-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('user-id').value;
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  let result;
  if (id) {
    result = await supabaseClient
      .from('usuario')
      .update({ nome, telefone, email, senha })
      .eq('id', id);
  } else {
    result = await supabaseClient
      .from('usuario')
      .insert([{ nome, telefone, email, senha }]);
  }

  if (result.error) {
    alert('Erro: ' + result.error.message);
    console.error(result.error);
    return;
  }

  form.reset();
  document.getElementById('user-id').value = '';
  loadUsers();
});

async function loadUsers() {
  const { data, error } = await supabaseClient
    .from('usuario')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  userList.innerHTML = '';
  data.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${user.nome}</strong> — ${user.telefone} — ${user.email}
      <button onclick="editUser(${user.id}, '${user.nome}', '${user.telefone}', '${user.email}', '${user.senha}')">Editar</button>
      <button onclick="deleteUser(${user.id})">Apagar</button>
    `;
    userList.appendChild(li);
  });
}

window.editUser = (id, nome, telefone, email, senha) => {
  document.getElementById('user-id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('telefone').value = telefone;
  document.getElementById('email').value = email;
  document.getElementById('senha').value = senha;
};

window.deleteUser = async (id) => {
  const { error } = await supabaseClient
    .from('usuario')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Erro ao apagar: ' + error.message);
    console.error(error);
  } else {
    loadUsers();
  }
};

loadUsers();
