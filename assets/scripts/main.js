const API_URL = "http://localhost:3333";

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
        return {
          entrada: data.reverse().find((e) => e.type === "Entrada").time,
          saida: data.find((e) => e.type === "Saida").time,
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
        users.forEach(async (user) => {
          const userClock = await getUserClocks(user.id);

          usersList.innerHTML += `
          <tr>
            <th scope="row">${user.id}</th>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.email}</td>
            <td>${user.pin}</td>
            <td>${`${new Date(userClock.entrada).getHours()}:${new Date(
              userClock.entrada
            ).getMinutes()}`}</td>
            <td>${`${new Date(userClock.saida).getHours()}:${new Date(
              userClock.saida
            ).getMinutes()}`}</td>
            <td><input type="button" value="Editar" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#formularioAtualizarDados" onclick="edit(${
              user.id
            })" /></td>
            <td><input type="button" value="Eliminar" class="btn btn-danger" onclick="delete(${
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
