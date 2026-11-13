const urlUsuario = "http://localhost:3000/usuario";
const urlTarefa = "http://localhost:3000/tarefa";


const enums = {
    A_FAZER: 'A fazer',
    FAZENDO: 'Fazendo',
    PRONTO: 'Pronto',
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta'
};


const usuarios = [];
const tarefas = [];

let usuarioAtual = null;
let tarefaAtual = null;

carregarUsuarios();
carregarTarefas();

function carregarUsuarios() {

    fetch(urlUsuario + "/listar")
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {

            usuarios.length = 0;
            usuarios.push(...data);

            listarUsuarios();
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar usuários");
        });
}

function listarUsuarios() {

    const lista = document.querySelector("#listaUsuarios");

    lista.innerHTML = "";

    usuarios.forEach(usuario => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>Usuário ${usuario.id}</h3>
            <p>Nome: ${usuario.nome}</p>
            <p>Email: ${usuario.email}</p>
        `;

        card.onclick = () => abrirUsuario(usuario);

        lista.appendChild(card);
    });
}

function abrirUsuario(usuario) {

    usuarioAtual = usuario;

    tituloUsuario.innerText = "Usuário " + usuario.id;

    nomeUsuarioEdit.value = usuario.nome;
    emailUsuarioEdit.value = usuario.email;

    detalhesUsuario.classList.remove("oculto");
}

document.querySelector("#formUsuario")
?.addEventListener("submit", e => {

    e.preventDefault();

    const novoUsuario = {
        nome: nomeUsuario.value,
        email: emailUsuario.value,
        senha: senhaUsuario.value
    };

    fetch(urlUsuario + "/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
    })
    .then(() => {
        modalUsuario.classList.add("oculto");
        carregarUsuarios();
    })
    .catch(() => alert("Erro ao cadastrar usuário"));
});

function salvarEdicaoUsuario() {

    fetch(urlUsuario + "/atualizar/" + usuarioAtual.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: nomeUsuarioEdit.value,
            email: emailUsuarioEdit.value
        })
    })
    .then(() => {
        detalhesUsuario.classList.add("oculto");
        carregarUsuarios();
    });
}

function excluirUsuario() {

    if (!confirm("Deseja excluir este usuário?")) return;

    fetch(urlUsuario + "/excluir/" + usuarioAtual.id, {
        method: "DELETE"
    })
    .then(() => {
        detalhesUsuario.classList.add("oculto");
        carregarUsuarios();
    });
}


function carregarTarefas() {

    fetch(urlTarefa + "/listar")
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(data => {

            tarefas.length = 0;
            tarefas.push(...data);

            listarTarefas();
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao carregar tarefas");
        });
}

function listarTarefas() {

    const lista = document.querySelector("#listaTarefas");

    lista.innerHTML = "";

    tarefas.forEach(tarefa => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>Tarefa ${tarefa.id}</h3>
            <p>Usuário: ${tarefa.id_usuario}</p>
            <p>Descrição: ${tarefa.descrição}</p>
            <p>Setor: ${tarefa.nome_setor}</p>
            <p>Prioridade: ${tarefa.prioridade}</p>
            <p>Data de cadastro: ${tarefa.data_cadastro}</p>
            <p>Status: ${tarefa.status}</p>
        `;

        card.onclick = () => abrirTarefa(tarefa);

        lista.appendChild(card);
    });
}

function abrirTarefa(tarefa) {

    tarefaAtual = tarefa;

    tituloTarefa.innerText = "Tarefa " + tarefa.id;

    prioridadeEdit.value = tarefa.prioridade;
    statusEdit.value = tarefa.status;

    detalhesTarefa.classList.remove("oculto");
}

document.querySelector("#formTarefa")
?.addEventListener("submit", e => {

    e.preventDefault();

    const usuarioJaPossuiTarefa = tarefas.some(
        tarefa => tarefa.id_usuario == Number(idUsuario.value)
    );

    if (usuarioJaPossuiTarefa) {
        alert("Este usuário já possui uma tarefa.");
        return;
    }

    const novaTarefa = {
        id_usuario: Number(idUsuario.value),
        descrição: descricaoTarefa.value,
        nome_setor: nomeSetor.value,
        prioridade: prioridade.value,
        status: status.value,
        data_cadastro: data_cadastro.value
    };

    fetch(urlTarefa + "/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(() => {
        modalTarefa.classList.add("oculto");
        carregarTarefas();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao cadastrar tarefa");
    });
});

function salvarEdicaoTarefa() {

    const tarefaEditada = {
        prioridade: prioridadeEdit.value,
        status: statusEdit.value
    };

    fetch(urlTarefa + "/atualizar/" + tarefaAtual.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaEditada)
    })
    .then(() => {
        detalhesTarefa.classList.add("oculto");
        carregarTarefas();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao atualizar tarefa");
    });
}

function excluirTarefa() {

    if (!confirm("Deseja excluir esta tarefa?")) return;

    fetch(urlTarefa + "/excluir/" + tarefaAtual.id, {
        method: "DELETE"
    })
    .then(() => {
        detalhesTarefa.classList.add("oculto");
        carregarTarefas();
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao excluir tarefa");
    });
}


function mostrarTela(tela) {

    const telaUsuarios =
        document.getElementById("telaUsuarios");

    const telaTarefas =
        document.getElementById("telaTarefas");

    if (tela === "usuarios") {

        telaUsuarios.classList.remove("oculto");
        telaTarefas.classList.add("oculto");
    }

    if (tela === "tarefas") {

        telaTarefas.classList.remove("oculto");
        telaUsuarios.classList.add("oculto");

        listarTarefas();
    }
}


function abrirCadastroTarefa() {

    if (usuarioAtual) {
        idUsuario.value = usuarioAtual.id;
    }

    modalTarefa.classList.remove("oculto");
}


function listarTarefasDoUsuario(id) {

    const lista =
        document.querySelector("#listaTarefas");

    lista.innerHTML = "";

    const tarefasDoUsuario =
        tarefas.filter(t =>
            t.id_usuario == id
        );

    tarefasDoUsuario.forEach(tarefa => {

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>Tarefa ${tarefa.id}</h3>
            <p>Descrição: ${tarefa.descrição}</p>
            <p>Setor: ${tarefa.nome_setor}</p>
            <p>Prioridade: ${tarefa.prioridade}</p>
            <p>Data de cadastro: ${tarefa.data_cadastro}</p>
            <p>Status: ${tarefa.status}</p>
        `;

        card.onclick = () =>
            abrirTarefa(tarefa);

        lista.appendChild(card);
    });
}