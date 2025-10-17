document.getElementById('recoveryForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('emailInput').value.trim();

  // Validación básica de formato
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('mensaje').innerText = "Por favor, introduce un correo válido.";
    return;
  }

  // Solo permitir el correo exacto solicitado
  const CORREO_PERMITIDO = 'ingresosena555@gmail.com';
  if (email.toLowerCase() !== CORREO_PERMITIDO) {
    document.getElementById('mensaje').innerText = "El correo no es correcto.";
    return;
  }

  // Si es el correo permitido, generar contraseña y enviar
  const generatedPassword = Math.random().toString(36).slice(-8);

  const templateParams = {
    user_email: email,
    user_password: generatedPassword
  };

  emailjs.send('service_512330c', 'template_7ybibpm', templateParams)
    .then(function(response) {
      window.location.href = "ENVIO/recuperacion.html";
    }, function(error) {
      console.error('❌ Error al enviar:', error);
      alert("❌ Error al enviar el correo:\n" + (error.text || JSON.stringify(error)));
      document.getElementById('mensaje').innerText = "Error al enviar el correo.";
    });
});