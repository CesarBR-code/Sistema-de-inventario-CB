// URL base para las peticiones a la API.
const API_BASE = 'http://localhost:3001/api';

// Componente de barra de navegación
function NavBar({ currentPage, onNavigate }) {
  const links = [
    { key: 'productos', label: 'Productos' },
    { key: 'categorias', label: 'Categorías' },
    { key: 'proveedores', label: 'Proveedores' },
    { key: 'usuarios', label: 'Usuarios' },
    { key: 'movimientos', label: 'Movimientos' },
    { key: 'reportes', label: 'Reportes' },
    { key: 'auditoria', label: 'Auditoría' },
  ];
  return (
    <nav className="navbar">
      {links.map((link) => (
        <a
          href="#"
          key={link.key}
          className={currentPage === link.key ? 'active' : ''}
          onClick={() => onNavigate(link.key)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

// Componente de pie de página
function Footer() {
  return <footer className="footer">&copy; 2025 Sistema de Inventario CB<br />By Cesar Barragan</footer>;
}

// Página de productos
function Productos() {
  const [productos, setProductos] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);
  const [proveedores, setProveedores] = React.useState([]);
  const [form, setForm] = React.useState({ nombre: '', codigo: '', id_categoria: '', id_proveedor: '', precio: '', cantidad: '', stock_minimo: '' });
  const [editingId, setEditingId] = React.useState(null);
  const [alerta, setAlerta] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_BASE}/productos`)
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => console.error(err));
    fetch(`${API_BASE}/categorias`)
      .then((res) => res.json())
      .then(setCategorias);
    fetch(`${API_BASE}/proveedores`)
      .then((res) => res.json())
      .then(setProveedores);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const limpiarFormulario = () => {
    setForm({ nombre: '', codigo: '', id_categoria: '', id_proveedor: '', precio: '', cantidad: '', stock_minimo: '' });
    setEditingId(null);
  };
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const metodo = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/productos/${editingId}` : `${API_BASE}/productos`;
    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error en la solicitud');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje || 'Operación exitosa');
        return fetch(`${API_BASE}/productos`)
          .then((res) => res.json())
          .then(setProductos);
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
    limpiarFormulario();
  };
  const handleEdit = (producto) => {
    setEditingId(producto.id_producto);
    setForm({
      nombre: producto.nombre,
      codigo: producto.codigo,
      id_categoria: producto.id_categoria,
      id_proveedor: producto.id_proveedor,
      precio: producto.precio,
      cantidad: producto.cantidad,
      stock_minimo: producto.stock_minimo,
    });
  };
  const handleDelete = (id) => {
    if (!window.confirm('¿Deseas eliminar este producto?')) return;
    fetch(`${API_BASE}/productos/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Error al eliminar');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje);
        setProductos(productos.filter((p) => p.id_producto !== id));
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
  };
  return (
    <div className="container">
      <h2>Gestión de productos</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Código</label>
          <input type="text" name="codigo" value={form.codigo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select name="id_categoria" value={form.id_categoria} onChange={handleChange} required>
            <option value="">Seleccione</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Proveedor</label>
          <select name="id_proveedor" value={form.id_proveedor} onChange={handleChange} required>
            <option value="">Seleccione</option>
            {proveedores.map((prov) => (
              <option key={prov.id_proveedor} value={prov.id_proveedor}>{prov.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Precio</label>
          <input type="number" step="0.01" name="precio" value={form.precio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Stock mínimo</label>
          <input type="number" name="stock_minimo" value={form.stock_minimo} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn">{editingId ? 'Actualizar' : 'Registrar'}</button>
        {editingId && (
          <button type="button" className="btn" onClick={limpiarFormulario}>Cancelar</button>
        )}
      </form>
      <h3>Lista de productos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Stock mínimo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.id_producto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.codigo}</td>
              <td>{producto.nombre_categoria}</td>
              <td>{producto.nombre_proveedor}</td>
              <td>{producto.precio}</td>
              <td>{producto.cantidad}</td>
              <td>{producto.stock_minimo}</td>
              <td>
                <button className="btn" onClick={() => handleEdit(producto)}>Editar</button>
                <button className="btn" onClick={() => handleDelete(producto.id_producto)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan="9">No hay productos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página de categorías
function Categorias() {
  const [categorias, setCategorias] = React.useState([]);
  const [nombreCategoria, setNombreCategoria] = React.useState('');
  const [alerta, setAlerta] = React.useState(null);
  React.useEffect(() => {
    fetch(`${API_BASE}/categorias`)
      .then((res) => res.json())
      .then(setCategorias);
  }, []);
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_categoria: nombreCategoria }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear categoría');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje);
        return fetch(`${API_BASE}/categorias`)
          .then((res) => res.json())
          .then(setCategorias);
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
    setNombreCategoria('');
  };
  return (
    <div className="container">
      <h2>Gestión de categorías</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la categoría</label>
          <input type="text" value={nombreCategoria} onChange={(e) => setNombreCategoria(e.target.value)} required />
        </div>
        <button type="submit" className="btn">Registrar</button>
      </form>
      <h3>Lista de categorías</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => (
            <tr key={cat.id_categoria}>
              <td>{cat.id_categoria}</td>
              <td>{cat.nombre_categoria}</td>
            </tr>
          ))}
          {categorias.length === 0 && (
            <tr>
              <td colSpan="2">No hay categorías registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página de proveedores
function Proveedores() {
  const [proveedores, setProveedores] = React.useState([]);
  const [form, setForm] = React.useState({ nombre: '', telefono: '', correo: '', direccion: '' });
  const [alerta, setAlerta] = React.useState(null);
  React.useEffect(() => {
    fetch(`${API_BASE}/proveedores`)
      .then((res) => res.json())
      .then(setProveedores);
  }, []);
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear proveedor');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje);
        return fetch(`${API_BASE}/proveedores`)
          .then((res) => res.json())
          .then(setProveedores);
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
    setForm({ nombre: '', telefono: '', correo: '', direccion: '' });
  };
  return (
    <div className="container">
      <h2>Gestión de proveedores</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Correo</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Dirección</label>
          <textarea name="direccion" value={form.direccion} onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="btn">Registrar</button>
      </form>
      <h3>Lista de proveedores</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((prov) => (
            <tr key={prov.id_proveedor}>
              <td>{prov.id_proveedor}</td>
              <td>{prov.nombre}</td>
              <td>{prov.telefono}</td>
              <td>{prov.correo}</td>
              <td>{prov.direccion}</td>
            </tr>
          ))}
          {proveedores.length === 0 && (
            <tr>
              <td colSpan="5">No hay proveedores registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página de usuarios
function Usuarios() {
  const [usuarios, setUsuarios] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [form, setForm] = React.useState({ nombre: '', correo: '', contraseña: '', id_rol: '', estado: 1 });
  const [alerta, setAlerta] = React.useState(null);
  React.useEffect(() => {
    fetch(`${API_BASE}/usuarios`)
      .then((res) => res.json())
      .then(setUsuarios);
    fetch(`${API_BASE}/roles`)
      .then((res) => res.json())
      .then(setRoles);
  }, []);
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al crear usuario');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje);
        return fetch(`${API_BASE}/usuarios`)
          .then((res) => res.json())
          .then(setUsuarios);
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
    setForm({ nombre: '', correo: '', contraseña: '', id_rol: '', estado: 1 });
  };
  return (
    <div className="container">
      <h2>Gestión de usuarios</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Correo</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select name="id_rol" value={form.id_rol} onChange={handleChange} required>
            <option value="">Seleccione</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre_rol}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">Registrar</button>
      </form>
      <h3>Lista de usuarios</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.nombre_rol}</td>
              <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="5">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página de movimientos
function Movimientos() {
  const [movimientos, setMovimientos] = React.useState([]);
  const [productos, setProductos] = React.useState([]);
  const [form, setForm] = React.useState({ id_producto: '', tipo_movimiento: 'entrada', cantidad: '', motivo: '' });
  const [alerta, setAlerta] = React.useState(null);
  React.useEffect(() => {
    fetch(`${API_BASE}/movimientos`)
      .then((res) => res.json())
      .then(setMovimientos);
    fetch(`${API_BASE}/productos`)
      .then((res) => res.json())
      .then(setProductos);
  }, []);
  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 3000);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/movimientos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al registrar movimiento');
        return res.json();
      })
      .then((data) => {
        mostrarAlerta(data.mensaje);
        return fetch(`${API_BASE}/movimientos`)
          .then((res) => res.json())
          .then(setMovimientos);
      })
      .catch((err) => mostrarAlerta(err.message, 'error'));
    setForm({ id_producto: '', tipo_movimiento: 'entrada', cantidad: '', motivo: '' });
  };
  return (
    <div className="container">
      <h2>Movimientos de inventario</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Producto</label>
          <select name="id_producto" value={form.id_producto} onChange={handleChange} required>
            <option value="">Seleccione</option>
            {productos.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Tipo de movimiento</label>
          <select name="tipo_movimiento" value={form.tipo_movimiento} onChange={handleChange} required>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>
        <div className="form-group">
          <label>Cantidad</label>
          <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Motivo</label>
          <input type="text" name="motivo" value={form.motivo} onChange={handleChange} />
        </div>
        <button type="submit" className="btn">Registrar</button>
      </form>
      <h3>Historial de movimientos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Motivo</th>
            <th>Usuario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.id_movimiento}>
              <td>{m.id_movimiento}</td>
              <td>{m.nombre_producto}</td>
              <td>{m.tipo_movimiento}</td>
              <td>{m.cantidad}</td>
              <td>{m.motivo}</td>
              <td>{m.nombre_usuario}</td>
              <td>{new Date(m.fecha_movimiento).toLocaleString()}</td>
            </tr>
          ))}
          {movimientos.length === 0 && (
            <tr>
              <td colSpan="7">No hay movimientos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Página de reportes
function Reportes() {
  const [masVendidos, setMasVendidos] = React.useState([]);
  const [bajoStock, setBajoStock] = React.useState([]);
  const [alerta, setAlerta] = React.useState(null);
  const cargarReportes = () => {
    fetch(`${API_BASE}/reportes/mas-vendidos?limit=5`)
      .then((res) => res.json())
      .then(setMasVendidos)
      .catch((err) => setAlerta({ mensaje: err.message, tipo: 'error' }));
    fetch(`${API_BASE}/reportes/bajo-stock?limit=10`)
      .then((res) => res.json())
      .then(setBajoStock)
      .catch((err) => setAlerta({ mensaje: err.message, tipo: 'error' }));
  };
  React.useEffect(() => {
    cargarReportes();
  }, []);
  return (
    <div className="container">
      <h2>Reportes</h2>
      {alerta && (
        <div className={`alert ${alerta.tipo === 'error' ? 'alert-error' : 'alert-success'}`}>{alerta.mensaje}</div>
      )}
      <h3>Productos más vendidos</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Total vendido</th>
          </tr>
        </thead>
        <tbody>
          {masVendidos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>{p.total_vendido}</td>
            </tr>
          ))}
          {masVendidos.length === 0 && (
            <tr>
              <td colSpan="2">No hay datos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3>Productos con bajo stock</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Stock mínimo</th>
          </tr>
        </thead>
        <tbody>
          {bajoStock.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>{p.stock_minimo}</td>
            </tr>
          ))}
          {bajoStock.length === 0 && (
            <tr>
              <td colSpan="3">No hay datos disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="btn" onClick={cargarReportes}>Actualizar</button>
    </div>
  );
}

// Página de auditoría
function Auditoria() {
  const [entradas, setEntradas] = React.useState([]);
  React.useEffect(() => {
    fetch(`${API_BASE}/auditoria`)
      .then((res) => res.json())
      .then(setEntradas)
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="container">
      <h2>Auditoría</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Acción</th>
            <th>Tabla afectada</th>
            <th>ID registro</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((a) => (
            <tr key={a.id_auditoria}>
              <td>{a.id_auditoria}</td>
              <td>{a.nombre_usuario}</td>
              <td>{a.accion}</td>
              <td>{a.tabla_afectada}</td>
              <td>{a.id_registro_afectado}</td>
              <td>{new Date(a.fecha).toLocaleString()}</td>
            </tr>
          ))}
          {entradas.length === 0 && (
            <tr>
              <td colSpan="6">No hay registros de auditoría.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Componente principal
function App() {
  const [paginaActual, setPaginaActual] = React.useState('productos');
  let contenido;
  switch (paginaActual) {
    case 'productos':
      contenido = <Productos />;
      break;
    case 'categorias':
      contenido = <Categorias />;
      break;
    case 'proveedores':
      contenido = <Proveedores />;
      break;
    case 'usuarios':
      contenido = <Usuarios />;
      break;
    case 'movimientos':
      contenido = <Movimientos />;
      break;
    case 'reportes':
      contenido = <Reportes />;
      break;
    case 'auditoria':
      contenido = <Auditoria />;
      break;
    default:
      contenido = <Productos />;
  }
  return (
    <div>
      <NavBar currentPage={paginaActual} onNavigate={setPaginaActual} />
      {contenido}
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);