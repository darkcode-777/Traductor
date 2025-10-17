// conversor.jsx (o conversor.js)
import { useState } from 'react';
import './App.css';

function Conversor({ onInicio }) {
  const [textoAVoz, setTextoAVoz] = useState('');
  const [vozATexto, setVozATexto] = useState('');

  function CambiarTexto(evento) {
    setTextoAVoz(evento.target.value);
  }

  function convertirTextoAVoz() {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(textoAVoz);
    synth.speak(utterThis);
  }

  function resultado(event) {
    setVozATexto(event.results[0][0].transcript);
  }

  function grabarVozATexto() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.start();
    recognition.onresult = resultado;
  }

  function volverAlInicio() {
    setTextoAVoz('');
    setVozATexto('');
    // Si la prop existe, llama a la función para cerrar sesión en App
    if (typeof onInicio === 'function') {
      onInicio();
    }
  }

  return (
    <>
      <h1>CONVERSOR TTS Y STT</h1>
      <h3>Texto a Voz</h3>
      <input type="text" value={textoAVoz} onChange={CambiarTexto} />
      <button onClick={convertirTextoAVoz}>Convertir</button>
      <h3>Voz a Texto</h3>
      <button onClick={grabarVozATexto}>Grabar</button>
      <p>{vozATexto}</p>
      <button onClick={volverAlInicio}>INICIO</button>
    </>
  );
}

export default Conversor;