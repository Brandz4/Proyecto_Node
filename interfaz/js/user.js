window.onload = init;
var headers = {};
var url = "http://localhost:3000/user";
var empleados = [];

function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token JWT
        return {
            user_name: payload.user_name,
            user_last_name: payload.user_last_name
        };
    }
    return null;
}

function init() {
    if(localStorage.getItem("token")){
        headers = {
            headers: {
                'Authorization': "bearer " + localStorage.getItem("token")
            }
        }
        const user = getUserFromToken();
        displayWelcomeMessage(user);
        loadEmpleados();
    }else{
        window.location.href = "index.html"; 
    }
}

function loadEmpleados() {
    axios.get(url + "/empleados", headers)
    .then(function(res){
        console.log(res);
        empleados = res.data.message; // Guarda la lista completa de empleados 
    }).catch(function(err){
        console.log(err);
    })
}

function autoComplete() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const autocompleteList = document.getElementById('autocompleteList');
    
    autocompleteList.innerHTML = ''; // Limpia la lista de autocompletado
    
    if (searchTerm.length === 0) {
        return;
    }

    const filteredEmpleados = empleados.filter(empleado =>
        (empleado.user_name + ' ' + empleado.user_last_name).toLowerCase().includes(searchTerm)
    );

    filteredEmpleados.forEach(empleado => {
        const li = document.createElement('li');
        li.textContent = `${empleado.user_name} ${empleado.user_last_name}`;
        li.addEventListener('click', () => {
            document.getElementById('searchInput').value = li.textContent;
            autocompleteList.innerHTML = ''; // Limpia la lista de autocompletado
        });
        autocompleteList.appendChild(li);
    });
}

function searchEmpleados() {
    const searchTerm = document.getElementById('searchInput').value;
    const empleado = empleados.find(e =>
        `${e.user_name} ${e.user_last_name}` === searchTerm
    );

    if (empleado) {
        displayEmpleadoForm(empleado);
    } else {
        document.getElementById('empleadoFormContainer').innerHTML = '<p>Empleado no encontrado.</p>';
    }
}

function displayEmpleadoForm(empleado) {
    var container = document.getElementById("empleadoFormContainer");
    container.innerHTML = `
        <form>
            <label for="id_empleado">ID del empleado:</label>
            <input type="text" id="id_empleado" value="${empleado.user_id}" readonly><br>
            <label for="userName">Nombre:</label>
            <input type="text" id="userName" value="${empleado.user_name}"><br>
            <label for="userLastName">Apellido:</label>
            <input type="text" id="userLastName" value="${empleado.user_last_name}"><br>
            <label for="userPhone">Teléfono:</label>
            <input type="text" id="userPhone" value="${empleado.user_phone}"><br>
            <label for="userAddress">Dirección:</label>
            <input type="text" id="userAddress" value="${empleado.user_address}"><br>
            <label for="userMail">Correo:</label>
            <input type="text" id="userMail" value="${empleado.user_mail}"><br>
            <div class="buttons">
                <button type="button" class="modify-btn" onclick="updateEmpleado()">Modificar datos</button>
                <button type="button" class="delete-btn" onclick="deleteEmpleado()">Eliminar empleado</button>
                <button type="button" class="cancel-btn" onclick="window.location.href='index.html'">Cancelar</button>
            </div>
        </form>
    `;
}

function updateEmpleado() {
    // Obtiene el ID del empleado del input de sólo lectura
    const user_id = document.getElementById("id_empleado").value;
    const user_name = document.getElementById("userName").value;
    const user_last_name = document.getElementById("userLastName").value;
    const user_phone = document.getElementById("userPhone").value;
    const user_mail = document.getElementById("userMail").value;
    const user_address = document.getElementById("userAddress").value;

    const token = localStorage.getItem("token");

    // Realiza la solicitud PUT al servidor usando axios
    axios.put(`${url}/update`, {
        user_id,
        user_name,
        user_last_name,
        user_phone,
        user_mail,
        user_address
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    })
    .then(function(response) {
        console.log(response.data.message);
        alert(response.data.message);
        window.location.href = 'index.html';
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Hubo un error al actualizar los datos.');
    });
}

//Función para eliminar el empleado:
function deleteEmpleado() {
    // Obtiene el ID del empleado del input de sólo lectura
    const user_id = document.getElementById("id_empleado").value;

    if (!user_id) {
        alert('ID del empleado es necesario para eliminar.');
        return;
    }

    const token = localStorage.getItem("token");

    // Realiza la solicitud DELETE al servidor usando axios
    axios.delete(`${url}/delete`, {
        data: { user_id }, // Los datos se envían en el cuerpo de la solicitud
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function(response) {
        console.log(response.data.message);
        alert(response.data.message); 
        window.location.href = 'index.html'; 
    })
    .catch(function(error) {
        console.error('Error:', error.message);
    });
}

function displayWelcomeMessage(user) {
    var container = document.querySelector(".welcome-container");
    container.innerHTML = `
        <h1 id="welcomeMessage">Bienvenido, ${user.user_name} ${user.user_last_name}</h1>
        <a href="signin.html" class="register-link">Registrar usuario</a>
    `;
}
