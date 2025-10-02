document.querySelector('#downloadButton').onclick = function() {


    fetch('https://jsonplaceholder.typicode.com/todos')

        .then(response => response.json())

        .then(todos => {
            var todoList = document.querySelector('#todoList');
            
            var firstTenTodos = todos.slice(0, 10); // para ver solo los 10 primeros
            
            firstTenTodos.forEach(todo => {
                var li = document.createElement('li');

                li.textContent = todo.title;
                todoList.appendChild(li);


            });


        })


        

};