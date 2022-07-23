const API_URL = "http://localhost:3333";
//const API_URL = "https://picar-ponto.herokuapp.com"


function login(data) {
  fetch(`${API_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      if (data.pin) {
        window.location.href = "/dashboard-funcionario.html";
      } else {
        window.location.href = "/dashboard.html";
      }
    } else {
      alert("Erro ao fazer login");
    }
  });
}

function registerUser() {
  const name = document.getElementById("addform-name").value;
  const surname = document.getElementById("addform-surname").value;
  const email = document.getElementById("addform-email").value;
  const password = document.getElementById("addform-password").value;
  const pin = document.getElementById("addform-pin").value;

  const data = {
    name,
    surname,
    email,
    password,
    pin,
    role: "Funcionario",
  };

  fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      alert("Usuário cadastrado com sucesso");
      name.value = "";
      surname.value = "";
      email.value = "";
      password.value = "";
      pin.value = "";
      getUsers();
    } else {
      alert("Erro ao cadastrar usuário");
    }
  });
}

function logout() {
  fetch(`${API_URL}/auth`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      window.location.href = "/";
    } else {
      alert("Erro ao fazer logout");
    }
  });
}

function getUserClocks(id) {
  return fetch(`${API_URL}/user/clocks/${id}`, {
    method: "GET",
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      return response.json().then((data) => {
        if (data.length === 0) return { entrada: null, saida: null };
        return {
          entrada: data.reverse().find((e) => e.type === "Entrada")?.time,
          saida: data.find((e) => e.type === "Saida")?.time,
        };
      });
    } else {
      alert("Erro ao fazer buscar usuários");
    }
  });
}

function getUsers() {
  fetch(`${API_URL}/users`, {
    method: "GET",
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        let users = data;
        let usersList = document.getElementById("tabelaTodosFuncionarios");
        usersList.innerHTML = "";

        const estadosFuncionarios = document.getElementById("estadosFuncionarios")

        estadosFuncionarios.innerHTML = ""

        users.forEach(async (user) => {
          const userClock = await getUserClocks(user.id);
          const userProfile = user.images?.find((e) => e.type === "Perfil");
          const userDocument = user.images?.find((e) => e.type === "Documento");

          if (user.logged) {
            estadosFuncionarios.innerHTML += `
            <ul>
              <li style="list-style-type: none;" ><i class="fa-solid fa-circle m-2" style="color: green;"></i>${user.name} ${user.surname}</li>
            </ul>
          `
          }

          usersList.innerHTML += `
          <tr>
            <th scope="row">${user.id}</th>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.email}</td>
            <td>
                  <a href="${
                    userDocument && userDocument?.path
                      ? API_URL + "/public/uploads/" + userDocument.path
                      : "#"
                  }" target="_blank">Link</a>  
            </td>
            <td>${
              userClock.entrada
                ? `${new Date(userClock.entrada).getHours()}:${new Date(
                    userClock.entrada
                  ).getMinutes()}`
                : ""
            }</td>
            <td>${
              userClock.saida
                ? `${new Date(userClock.saida).getHours()}:${new Date(
                    userClock.saida
                  ).getMinutes()}`
                : ""
            }</td>
            <td>
                    <div style="width: 50px; height: 50px; border-radius: 50%;">
                        <img src="${
                          userProfile && userProfile.path
                            ? API_URL + "/public/uploads/" + userProfile.path
                            : "null"
                        }" style="width: 100%; height: 100%; border-radius: 50%;">
                    </div>
            </td>
            <td><input type="button" value="Editar" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formularioAtualizarDados" onclick="edit(${
              user.id
            })" /></td>
            <td><input type="button" value="Eliminar" class="btn btn-danger" onclick="deleteUser(${
              user.id
            })" /></td>
          </tr>
          `;

          


        });
      });
    } else {
      alert("Erro ao buscar usuários");
    }
  });
}

function getUserInfo() {
  fetch(`${API_URL}/user`, {
    method: "GET",
    credentials: "include",
  }).then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        let user = data;
        let infoUser = document.getElementById("info-user");
        const userProfileImage = user.images?.find((e) => e.type === "Perfil");
        const imgEl = document.getElementById("profile-img");
        imgEl.src = `${API_URL}/public/uploads/${userProfileImage?.path}`;
        infoUser.innerHTML = "";
        infoUser.innerHTML += `
            <label data-error="wrong" data-success="right" for="orangeForm-pass">Nome: ${user.name}</label><br>
            <label data-error="wrong" data-success="right" for="orangeForm-pass">Sobrenome: ${user.surname}</label><br>
            <label data-error="wrong" data-success="right" for="orangeForm-pass">Email: ${user.email}</label>
          `;
      });
    } else {
      alert("Erro ao buscar usuários");
    }
  });
}

function updateProfile(file, id) {
  const formData = new FormData();

  formData.append("image", file);

  fetch(`${API_URL}/user/${id}/profile`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  }).then((response) => {
    if (response.status === 200) {
      getUsers();
      alert("Perfil atualizado com sucesso");
    } else {
      alert("Erro ao atualizar imagem de perfil");
    }
  });
}

function update(id, data) {
  fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 200) {
      getUsers();
      alert("Perfil atualizado com sucesso");
    } else {
      alert("Erro ao atualizar perfil");
    }
  });
}

function deleteUser(id) {
  fetch(`${API_URL}/user/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deleted: "true" }),
  }).then((response) => {
    if (response.status === 200) {
      getUsers();
      alert("Perfil deletado com sucesso");
    } else {
      alert("Erro ao deletar perfil");
    }
  });
}

function updateDocument(file, id) {
  const formData = new FormData();

  formData.append("image", file);

  fetch(`${API_URL}/user/${id}/document`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  }).then((response) => {
    if (response.status === 200) {
      getUsers();
      alert("Perfil atualizado com sucesso");
    } else {
      alert("Erro ao atualizar document");
    }
  });
}

let tempo = function(){
  let tempoAtual = new Date();
  let hora = tempoAtual.toLocaleTimeString();
  document.getElementById("hora").innerHTML = hora;
  return hora;
}

let tempoReal = setInterval(tempo, 1000);