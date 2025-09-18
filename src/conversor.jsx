import { useState } from 'react'
import './App.css'

function Conversor() {

  const [textoAVoz, setTextoAVoz] = useState('')
  const [vozATexto, setVozATexto] = useState('')


  function CambiarTexto(evento) {
    setTextoAVoz(evento.target.value)
  }

  function convertirTextoAVoz() {
    const synth = window.speechSynthesis
    const utterThis = new SpeechSynthesisUtterance(textoAVoz)
    synth.speak(utterThis)
  }

  function resultado(event) {
    setVozATexto(event.results[0][0].transcript)
  }

  function grabarVozATexto() {
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.start()
    recognition.onresult = resultado
  }


  return (
    <>
      <h1>CONVERSOR TTS Y STT</h1>
      <br />
      <h3>Texto a Voz</h3>
      <input type="text" id="textoAVoz" value={textoAVoz} onChange={CambiarTexto} />
      <button onClick={convertirTextoAVoz}>Convertir</button>
      <br />
      <h3>Voz a Texto</h3>
      <button onClick={grabarVozATexto}>Grabar</button>
      <p>{vozATexto}</p>
    </>
  );
}

export default Conversor;