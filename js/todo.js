(function () {
    var now = new Date();

    var today = now.getFullYear() + '-' +
        ('0' + (now.getMonth() + 1)).slice(-2) + '-' +
        ('0' + now.getDate()).slice(-2);
    let thisday = document.querySelector('#today').value = today;

    var disablePastDays = today;
    document.getElementsByName('best-before')[0].setAttribute('min', disablePastDays);

    function getTodos() {
        let storage = localStorage.getItem('todolist');
        let todos = storage === null ? [] : JSON.parse(storage);
        return todos;
    }

    document.querySelector('#submit').addEventListener('click', function (e) {
        e.preventDefault();
        let headerror = document.querySelector('#head-error');
        let todoerror = document.querySelector('#todo-error');
        let todos = getTodos();
        var obj = {
            headline: document.querySelector('#headline').value,
            todoItem: [document.querySelector('#todoItem').value],
            bestBefore: document.querySelector('#bestBefore').value,
            today: document.querySelector('#today').value,
        };

        if (obj.headline === '' || obj.todoItem[0] === '') {
            headerror.innerHTML = "Rubrik krävs!";
            todoerror.innerHTML = "Du behöver fylla i vad du vill göra!";
            return;
        } else {
            todos.push(obj);
            localStorage.setItem('todolist', JSON.stringify(todos));
            [...document.querySelectorAll('#headline, #todoItem, #bestBefore')].map(inp => inp.value = '');
            [...document.querySelectorAll('#head-error, #todo-error')].map(inp => inp.innerHTML = '');
            show();
        }
    });
    function removeTodo() {
        let id = this.getAttribute('id');
        var todos = getTodos();
        todos.splice(id, 1);
        localStorage.setItem('todolist', JSON.stringify(todos));
        show();
    }

    function removeItem() {
        let id = this.getAttribute('id');
        var todos = getTodos();
        let todoID = this.parentNode.parentNode.parentNode.parentNode.getAttribute('id');

        todos.map((obj, i) => {
            if (todoID === `div${i}`) {
                obj.todoItem.splice(id, 1);
                localStorage.setItem('todolist', JSON.stringify(todos));
                show();
            }
            return obj.todoItem;
        });
    }

    function addTask() {
        let todos = getTodos();
        let id = this.parentNode.querySelector('input[type=hidden]').value;

        let ul = this.parentNode.parentNode.parentNode.querySelector('.list-group');
        const li = document.createRange().createContextualFragment(`<li class='list-group-item'>
                    <div class='input-group'>
                    <input class='this-item form-control'/>
                    <span class='input-group-btn'>
                    <input type='button' value='spara' class='save-item btn btn-success'/>
                    </span>
                    </div>
                    </li>`);
        ul.appendChild(li);

        [...document.querySelectorAll('.save-item')].map((btn) => btn.addEventListener('click', function () {
            var input = this.parentNode.parentNode.querySelector('.this-item').value;
            var test = todos.map((obj, i) => {
                if (id === `nr${i}`) {
                    obj.todoItem.push(input);
                }
                return obj.todoItem;
            });
            localStorage.setItem('todolist', JSON.stringify(todos));
            show();
        }));
    }

    function show() {
        let todos = getTodos();
        let todoArray = todos.map((item, i) => {
            let itemBf = new Date(item.bestBefore);
            let bfDate = new Date(item.bestBefore);
            let bf3Days = new Date(bfDate.setDate(bfDate.getDate() - 3));
            let panelclass;

            if (now < bf3Days) {
                panelclass = 'panel panel-info';
            }
            else if (now > itemBf) {
                panelclass = 'panel panel-danger';
            }
            else if (now <= itemBf && now >= bf3Days) {
                panelclass = 'panel panel-warning';
            }
            else {
                panelclass = 'panel panel-info';
            }
            let todoitem = item.todoItem.map((li, i) => {
                let item = `<li class='list-group-item clearfix'>
                    ${li}
                    <div class='btn-group pull-right'>
                    <button id='${i}' class='btn btn-default rmv'>
                    <span class='glyphicon glyphicon-minus text-danger'></span>
                    </button>
                    </div>
                    </li>`;
                return item;
            });
            let todo = `<li class='todo'><div id='div${i}' class='${panelclass}'>
                            <div class='panel-heading clearfix'><strong>${item.headline}</strong> ${item.today} <strong>gör innan: </strong>${item.bestBefore}
                            <div class='btn-group pull-right'>
                            <input type='hidden' value='nr${i}'>
                            <button class='btn btn-info addTask'>Lägg till task</button>
                            <button id='${i}' class='btn btn-danger remove'>
                            <span class='glyphicon glyphicon-remove'></span>
                            </button>
                            </div>
                            </div>
                            <ul class='list-group'>${todoitem.join("")}</ul>
                            </li>`;

            return todo;
        });
        document.querySelector('#addedItems').innerHTML = todoArray.join("");

        [...document.querySelectorAll('.remove')].map((btn) => btn.addEventListener('click', removeTodo));
        [...document.querySelectorAll('.addTask')].map((btn) => btn.addEventListener('click', addTask));
        [...document.querySelectorAll('.rmv')].map((btn) => btn.addEventListener('click', removeItem));
    }

    document.querySelector('#clear').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        show();
    });

    show();
})();