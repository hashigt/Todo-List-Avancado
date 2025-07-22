// Seleção de Elementos
const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancela-edit-btn")

let oldInputValue;

// Funções
const saveTodo = (Text) => {
    //precisa criar com JS igual o todo-list

    const todo = document.createElement("div") /* cria a div*/
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = Text //adiciona o text com um texto no h3
    todo.appendChild(todoTitle) //Adiciona o h3 na div

    // até aqui temos uma div e dentro um h3

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    //adicona cada um dos butoes
    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    todoList.appendChild(todo)

    todoInput.value = ""
    todoInput.focus(); //mantem o caixa selecionada
}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText == oldInputValue){
            todoTitle.innerText = text
        }
    })
}

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault(); /*como é so front adiciona o preventDeFault para não recarregar a pag quando clicado*/

    const inputValue = todoInput.value //guardando valor do input

    if(inputValue) {
        saveTodo(inputValue)
    }
})


document.addEventListener("click", (e) => {
    const targetEl = e.target
    const paretEl = targetEl.closest("div")
    let todoTitle;

    if(paretEl && paretEl.querySelector("h3")) {
        todoTitle = paretEl.querySelector("h3").innerText
    }

    if(targetEl.classList.contains("finish-todo")){
        paretEl.classList.toggle("done")
    }

    if(targetEl.classList.contains("remove-todo")){
        paretEl.remove()
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms()

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value

    if(editInputValue) {
        //atualizar
        updateTodo(editInputValue)
    }

    toggleForms()
})