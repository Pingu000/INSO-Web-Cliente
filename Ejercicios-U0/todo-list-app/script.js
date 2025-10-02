var inputTarea = document.querySelector('#taskInput');
var botonAgregar = document.querySelector('#addButton');
var listaTareas = document.querySelector('#taskList');

function crearBoton(texto, clase) {

    var boton = document.createElement('button');
    boton.textContent = texto;
    boton.className = clase;
    return boton;

}

function agregarTarea() {

    var textoTarea = inputTarea.value;
    
    var elementoLista = document.createElement('li');
    var textoSpan = document.createElement('span');
    var contenedorBotones = document.createElement('div');

    elementoLista.className = 'task-item';
    contenedorBotones.className = 'task-buttons';
    textoSpan.textContent = textoTarea;

    var botonEliminar = crearBoton('Eliminar', 'delete-btn');

    botonEliminar.onclick = function() {
        elementoLista.remove();

    };

    var botonCompletar = crearBoton('Completar', 'complete-btn');
    botonCompletar.onclick = function() {

        textoSpan.classList.toggle('completed');
    };

    contenedorBotones.appendChild(botonEliminar);
    contenedorBotones.appendChild(botonCompletar);
    elementoLista.appendChild(textoSpan);

    elementoLista.appendChild(contenedorBotones);
    listaTareas.appendChild(elementoLista);
    
    inputTarea.value = '';

}

botonAgregar.onclick = agregarTarea;
inputTarea.onkeypress = function (evento) {


    if (evento.key === 'Enter') {

        agregarTarea();
    }




    
};