// Importación de módulos y configuración inicial
import { login } from "backend/users"; // Importar la función 'login' desde el archivo 'backend/users'
import wixAnimations from 'wix-animations'; // Importar el módulo 'wix-animations'
import { authentication } from "wix-members"; // Importar el objeto 'authentication' desde el módulo 'wix-members'
import wixLocation from 'wix-location'; // Importar el módulo 'wix-location'

// Función que se ejecuta cuando la página está lista
$w.onReady(function () {
    // Crear una animación rotativa continua en el elemento con el ID 'image1'
    const animation = wixAnimations.timeline({ repeat: -1 }).add($w('#image1'), { rotate: 360, duration: 1000, easing: "easeLinear" })

    // Manejar clic en el botón con el ID 'button1'
    $w('#button1').onClick(async () => {
        // Reiniciar la animación al hacer clic en el botón
        animation.replay();
        $w('#text5').hide();
        $w('#button1').disable()

        // Intentar iniciar sesión con las credenciales proporcionadas
        const loginResponse = await login($w('#input1').value, $w('#input2').value)
        
        if (loginResponse.status) {
            // Si el inicio de sesión es exitoso, aplicar el token de sesión y redirigir a la página de inicio
            await authentication.applySessionToken(loginResponse.token)
            $w('#text5').text = "Ingresando a tu cuenta..."
            $w('#text5').show()
            wixLocation.to("/inicio")
        } else {
            // En caso de falla en el inicio de sesión, detener la animación y mostrar un mensaje de error
            animation.pause();
            $w('#text5').show();
            $w('#button1').enable();
        }
    });
});
