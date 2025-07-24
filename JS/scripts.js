// ===== Seleção de Elementos do DOM =====
// Captura os elementos do HTML com base nos IDs para manipulação posterior
const todoForm = document.querySelector("#todo-form"); // Formulário de adicionar tarefas
const todoInput = document.querySelector("#todo-input"); // Campo de input de texto
const todoList = document.querySelector("#todo-list"); // Lista onde as tarefas serão adicionadas
const editForm = document.querySelector("#edit-form"); // Formulário de edição de tarefas
const editInput = document.querySelector("#edit-input"); // Campo de input de edição
const cancelEditBtn = document.querySelector("#cancela-edit-btn"); // Botão para cancelar edição
const searchInput = document.querySelector("#search-input"); // Campo de busca de tarefas
const eraseBtn = document.querySelector("#erase-button"); // Botão para limpar a busca
const filterBtn = document.querySelector("#filter-select"); // Seletor de filtro (todos, feitos, a fazer)

let oldInputValue; // Guarda o texto original da tarefa antes da edição

// ===== Função para Salvar uma Nova Tarefa =====
const saveTodo = (text, done = 0, save = 1) => {
    // Cria o elemento da tarefa
    const todo = document.createElement("div");
    todo.classList.add("todo");

    // Adiciona o título (texto) da tarefa
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Botão de concluir tarefa
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    // Botão de editar tarefa
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    // Botão de remover tarefa
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    // Marca visualmente como feita, se necessário
    if (done) {
        todo.classList.add("done");
    }

    // Salva no LocalStorage se o parâmetro "save" for verdadeiro
    if (save) {
        saveTodoLocalStorage({ text, done });
    }

    // Adiciona a tarefa à lista na tela
    todoList.appendChild(todo);

    // Limpa o campo de texto e volta o foco para ele
    todoInput.value = "";
    todoInput.focus();
};

// ===== Alternar entre os formulários de adicionar e editar =====
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// ===== Atualiza o texto de uma tarefa existente =====
const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            updateTodoLocalStorage(oldInputValue, text);
        }
    });
};

// ===== Função de busca dinâmica =====
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        const normalizedSearch = search.toLowerCase();

        // Mostra todos os elementos inicialmente
        todo.style.display = "flex";

        // Esconde os que não contêm o texto digitado
        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    });
};

// ===== Filtro das tarefas (todos, feitos, a fazer) =====
const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                    ? (todo.style.display = "flex")
                    : (todo.style.display = "none")
            );
            break;

        default:
            break;
    }
};

// ===== Evento de envio do formulário de nova tarefa =====
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue);
    }
});

// ===== Evento global de clique para delegar ações =====
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Marcar como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
        updateTodosStatusLocalStorage(todoTitle);
    }

    // Remover tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

// ===== Evento de cancelar edição =====
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

// ===== Evento de envio do formulário de edição =====
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// ===== Evento de digitação no campo de busca =====
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
    getSearchTodos(search);
});

// ===== Evento para limpar a busca =====
eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup")); // Reaplica a busca
});

// ===== Evento de alteração no filtro (todos, feitos, a fazer) =====
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
    filterTodos(filterValue);
});

// ===== Pega as tarefas do LocalStorage e trata erros =====
const getTodosLocalStorage = () => {
    const todosStr = localStorage.getItem("todos");

    try {
        const todos = JSON.parse(todosStr);
        return Array.isArray(todos) ? todos : [];
    } catch (e) {
        return []; // Em caso de erro, retorna lista vazia
    }
};

// ===== Carrega as tarefas salvas na inicialização =====
const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0); // O terceiro parâmetro impede novo salvamento
    });
};

// ===== Salva uma nova tarefa no LocalStorage =====
const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// ===== Remove uma tarefa do LocalStorage =====
const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const updatedTodos = todos.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(updatedTodos));
};

// ===== Atualiza o status (feito/não feito) de uma tarefa =====
const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        if (todo.text === todoText) {
            todo.done = !todo.done;
        }
    });

    localStorage.setItem("todos", JSON.stringify(todos));
};

// ===== Atualiza o texto de uma tarefa no LocalStorage =====
const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

// ===== Executa ao carregar a página =====
loadTodos();