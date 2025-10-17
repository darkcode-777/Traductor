import { Routes, Route } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import Conversor from './conversor';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logueado, setLogueado] = useState(false);

  function cambiarEmail(evento) {
    setEmail(evento.target.value);
  }

  function cambiarPassword(evento) {
    setPassword(evento.target.value);
  }

  async function ingresar(e) {
    if (e && e.preventDefault) e.preventDefault();
  const url = `http://localhost:3000/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&usuario=${encodeURIComponent(email)}&clave=${encodeURIComponent(password)}`;
  console.log('Enviando login a:', url);
  const peticion = await fetch(url, { credentials: 'include' });
    if (peticion.ok) {
      setLogueado(true);
    } else {
      alert('Usuario o clave incorrectos');
    }
  }

  useEffect(() => {
    async function validar() {
      const peticion = await fetch('http://localhost:3000/validar', { credentials: 'include' });
      if (peticion.ok) {
        setLogueado(true);
      }
    }
    validar();
  }, []);

  function cerrarSesion() {
    setLogueado(false);
  }

  if (logueado) {
    return <Conversor onInicio={cerrarSesion} />;
  }

  return (
    <>
      <div className="container">
        <div className="login-box">
          <h1>SENA ACCESS</h1>
          <form id="loginForm" onSubmit={ingresar}>
            <input type="text" name="email" placeholder="correo" required value={email} onChange={cambiarEmail} />
            <input type="password" name="password" placeholder="contraseña" required value={password} onChange={cambiarPassword} />
            <button type="submit" className="ingresar">Ingresar</button>
          </form>
          <br />
          <a href="../RECUPERAR/recuperar contraseña.html" className="olvide">Olvidé mi contraseña</a>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;