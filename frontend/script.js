const form = document.getElementById('productForm');
const tabla = document.getElementById('tablaProductos').querySelector('tbody');
const submitBtn = document.getElementById('submitBtn');

let editandoId = null;

async function cargarProductos() {
  try {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    mostrarProductos(productos);
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }
}

function mostrarProductos(lista) {
  tabla.innerHTML = "";
  lista.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.codigo}</td>
      <td>${p.id_categoria}</td>
      <td>${p.id_proveedor}</td>
      <td>$${p.precio}</td>
      <td>${p.cantidad}</td>
      <td>
        <button onclick="editarProducto(${p.id_producto})">Editar</button>
        <button onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById('nombre').value,
    codigo: document.getElementById('codigo').value,
    id_categoria: parseInt(document.getElementById('id_categoria').value),
    id_proveedor: parseInt(document.getElementById('id_proveedor').value),
    precio: parseFloat(document.getElementById('precio').value),
    cantidad: parseInt(document.getElementById('cantidad').value)
  };

  try {
    if (editandoId) {
      await fetch(`/api/productos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      submitBtn.textContent = 'Registrar';
      editandoId = null;
    } else {
      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    form.reset();
    cargarProductos();
  } catch (err) {
  console.error('Error al guardar producto:', err);
  }
});

window.editarProducto = async (id) => {
  try {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    const p = productos.find(prod => prod.id_producto === id);
    if (!p) return;

    // Rellena el formulario con los datos del producto
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('codigo').value = p.codigo;
    document.getElementById('id_categoria').value = p.id_categoria;
    document.getElementById('id_proveedor').value = p.id_proveedor;
    document.getElementById('precio').value = p.precio;
    document.getElementById('cantidad').value = p.cantidad;

    // Cambia el texto del botón y guarda el ID a editar
    document.getElementById('submitBtn').textContent = 'Actualizar';
    editandoId = id;
  } catch (err) {
    console.error('Error al obtener producto para edición:', err);
  }
};

window.eliminarProducto = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
  await fetch(`/api/productos/${id}`, { method: 'DELETE' });
  cargarProductos();
};

document.addEventListener('DOMContentLoaded', cargarProductos);
