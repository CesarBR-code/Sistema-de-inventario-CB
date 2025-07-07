document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');
  const providerForm = document.getElementById('providerForm');
  const userForm = document.getElementById('userForm');

  if (productForm) {
    productForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Producto registrado');
    });
  }

  if (providerForm) {
    providerForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Proveedor registrado');
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Usuario creado');
    });
  }
});

function registerStockEntry() {
  alert('Entrada de stock registrada');
}

function registerStockExit() {
  alert('Salida de stock registrada');
}

function generateInventoryReport() {
  alert('Generando reporte de inventario...');
}

function generateSalesReport() {
  alert('Generando reporte de productos más vendidos...');
}

function generateLowStockReport() {
  alert('Generando reporte de stock bajo...');
}
let productos = JSON.parse(localStorage.getItem('productos')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productForm');
  const tabla = document.getElementById('tablaProductos').querySelector('tbody');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nuevoProducto = {
        nombre: document.getElementById('nombre').value,
        codigo: document.getElementById('codigo').value,
        categoria: document.getElementById('categoria').value,
        proveedor: document.getElementById('proveedor').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
      };

      productos.push(nuevoProducto);
      localStorage.setItem('productos', JSON.stringify(productos));
      form.reset();
      mostrarProductos();
    });
  }

  function mostrarProductos()  {
  const tabla = document.getElementById('tablaProductos').querySelector('tbody');
  tabla.innerHTML = "";
  lista.forEach((producto, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.codigo}</td>
      <td>${producto.categoria}</td>
      <td>${producto.proveedor}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.cantidad}</td>
      <td>
        <button onclick="editarProducto(${index})">Editar</button>
        <button onclick="eliminarProducto(${index})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

  mostrarProductos();
  document.getElementById('filtro')?.addEventListener('input', e => {
  const filtro = e.target.value.toLowerCase();
  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro) ||
    p.categoria.toLowerCase().includes(filtro) ||
    p.proveedor.toLowerCase().includes(filtro)
  );
  mostrarProductos(resultados);
});
});

function eliminarProducto(index) {
  productos.splice(index, 1);
  localStorage.setItem('productos', JSON.stringify(productos));
  location.reload();
}
function editarProducto(index) {
  const producto = productos[index];

  // Rellenar formulario
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('codigo').value = producto.codigo;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('proveedor').value = producto.proveedor;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('cantidad').value = producto.cantidad;

  // Cambiar botón a modo edición
  const form = document.getElementById('productForm');
  const btn = form.querySelector('button');
  btn.textContent = "Actualizar Producto";

  form.onsubmit = function (e) {
    e.preventDefault();

    productos[index] = {
      nombre: document.getElementById('nombre').value,
      codigo: document.getElementById('codigo').value,
      categoria: document.getElementById('categoria').value,
      proveedor: document.getElementById('proveedor').value,
      precio: parseFloat(document.getElementById('precio').value),
      cantidad: parseInt(document.getElementById('cantidad').value)
    };

    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos();
    form.reset();
    btn.textContent = "Registrar Producto";
    form.onsubmit = defaultSubmitHandler;
  };
}

// Guardar la función por defecto
function defaultSubmitHandler(e) {
  e.preventDefault();
  const nuevoProducto = {
    nombre: document.getElementById('nombre').value,
    codigo: document.getElementById('codigo').value,
    categoria: document.getElementById('categoria').value,
    proveedor: document.getElementById('proveedor').value,
    precio: parseFloat(document.getElementById('precio').value),
    cantidad: parseInt(document.getElementById('cantidad').value)
  };
  productos.push(nuevoProducto);
  localStorage.setItem('productos', JSON.stringify(productos));
  mostrarProductos();
  e.target.reset();
}

// Reasignar al cargar la página
document.getElementById('productForm')?.addEventListener('submit', defaultSubmitHandler);
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarProveedores();
  cargarUsuarios();
});

// =================== PRODUCTOS ===================
function cargarProductos() {
  const form = document.getElementById('productForm');
  const tabla = document.querySelector('#tablaProductos tbody');
  let productos = JSON.parse(localStorage.getItem('productos')) || [];

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nuevo = {
        nombre: document.getElementById('nombre').value,
        codigo: document.getElementById('codigo').value,
        categoria: document.getElementById('categoria').value,
        proveedor: document.getElementById('proveedor').value,
        precio: parseFloat(document.getElementById('precio').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
      };
      productos.push(nuevo);
      localStorage.setItem('productos', JSON.stringify(productos));
      form.reset();
      mostrarProductos(productos);
    });

    mostrarProductos(productos);
  }

  function mostrarProductos(lista) {
    if (!tabla) return;
    tabla.innerHTML = "";
    lista.forEach((p, i) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${p.nombre}</td>
        <td>${p.codigo}</td>
        <td>${p.categoria}</td>
        <td>${p.proveedor}</td>
        <td>$${p.precio.toFixed(2)}</td>
        <td>${p.cantidad}</td>
        <td>
          <button onclick="eliminarProducto(${i})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
    });
  }

  window.eliminarProducto = function (index) {
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductos(productos);
  };
}

// =================== PROVEEDORES ===================
function cargarProveedores() {
  const form = document.getElementById('providerForm');
  const contenedor = document.getElementById('providerList');
  let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nuevo = {
        nombre: form.providerName.value,
        contacto: form.contact.value
      };
      proveedores.push(nuevo);
      localStorage.setItem('proveedores', JSON.stringify(proveedores));
      form.reset();
      mostrarProveedores();
    });
    mostrarProveedores();
  }

  function mostrarProveedores() {
    if (!contenedor) return;
    contenedor.innerHTML = "<ul>" + proveedores.map(p => `<li>${p.nombre} - ${p.contacto}</li>`).join('') + "</ul>";
  }
}

// =================== USUARIOS ===================
function cargarUsuarios() {
  const form = document.getElementById('userForm');
  const contenedor = document.getElementById('userList');
  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nuevo = {
        username: form.username.value,
        role: form.role.value
      };
      usuarios.push(nuevo);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      form.reset();
      mostrarUsuarios();
    });
    mostrarUsuarios();
  }

  function mostrarUsuarios() {
    if (!contenedor) return;
    contenedor.innerHTML = "<ul>" + usuarios.map(u => `<li>${u.username} - ${u.role}</li>`).join('') + "</ul>";
  }
}
