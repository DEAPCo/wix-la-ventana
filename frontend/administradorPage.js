// Importación de módulos y configuración inicial
import { getAllUsers } from "backend/database"; // Importar la función 'getAllUsers' desde el archivo 'backend/database'
import { deleteUser, register } from "backend/users"; // Importar las funciones 'deleteUser' y 'register' desde el archivo 'backend/users'
import wixAnimations from 'wix-animations'; // Importar el módulo 'wix-animations'
import wixWindow from 'wix-window'; // Importar el módulo 'wix-window'

// Función que se ejecuta cuando la página está lista
$w.onReady(async function () {
    // Llamar a la función 'resetRepeater' para inicializar el repetidor
    await resetRepeater();

    // Configurar evento para cuando un elemento del repetidor está listo
    $w('#repeater1').onItemReady(($item, itemData, index) => {
        // Establecer el texto en los elementos del repetidor
        $item('#text8').text = itemData.name;
        $item('#text9').text = itemData.loginEmail;

        // Configurar evento al hacer clic en el botón de eliminación
        $item('#button3').onClick(async () => {
			$item('#button3').disable();
            await deleteUser(itemData._id); // Eliminar al usuario
            await resetRepeater(); // Actualizar el repetidor
        });
    });

    // Configurar evento para cuando se hace clic en el botón "Agregar usuario" o "Cancelar"
    $w('#button5').onClick(async () => {
        if ($w('#section3').isVisible) {
            await hideRegister(); // Ocultar la sección de registro
        } else {
            // Mostrar la sección de registro
            await $w('#section2').hide("slide", { duration: 1000, direction: "left" });
            await $w('#section2').collapse();
            await $w('#section3').expand();
            await $w('#section3').show("slide", { duration: 1000, direction: "right" });
            $w('#button5').label = "Cancelar"; // Cambiar el texto del botón a "Cancelar"
        }
    });

    // Configurar evento para validar la entrada del usuario
    $w('#input1,#input2,#input3,#input4').onInput(() => {
        // Utilizar una expresión regular para validar la contraseña
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\x00-\x7F]{5,}$/;

        if ($w('#input1').valid && $w('#input2').valid && $w('#input3').valid && $w('#input4').valid && regex.test($w('#input4').value)) {
            $w('#button6').enable(); // Habilitar el botón de registro
        } else {
            $w('#button6').disable(); // Deshabilitar el botón de registro
        }
    });

    // Configurar evento para el registro de un nuevo usuario
    $w('#button6').onClick(async () => {
        $w('#image7').show();
        $w('#text13').hide();
        $w('#button6').disable();
        const animation = wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay();

        const registerResponse = await register($w('#input1').value, $w('#input4').value, $w('#input2').value, $w('#input3').value, $w('#checkboxGroup1').value);

        if (registerResponse) {
			await hideRegister(); // Ocultar la sección de registro
            await resetRepeater(); // Actualizar el repetidor
			$w('#input1,#input2,#input3,#input4').value = ""; // Limpiar campos de entrada
			animation.pause();
			$w('#image7').hide();
        } else {
            $w('#text13').show("slide", { duration: 1000, direction: "right" });
            $w('#button6').enable();
            $w('#image7').hide();
        }
    });
});

// Función para reiniciar el repetidor con los usuarios
async function resetRepeater() {
    $w('#repeater1').data = await getAllUsers(); // Cargar datos de usuarios en el repetidor

    // Ocultar el repetidor y mostrar texto alternativo si no hay datos
    if ($w('#repeater1').data.length === 0) {
        await $w('#repeater1').collapse();
        await $w('#text12').expand();
    }
    return true;
}

// Función para ocultar la sección de registro
async function hideRegister() {
    await $w('#section3').hide("slide", { duration: 1000, direction: "right" });
    await $w('#section3').collapse();
    await $w('#section2').expand();
    await $w('#section2').show("slide", { duration: 1000, direction: "left" });

    $w('#button5').label = wixWindow.multilingual.currentLanguage === "en" ? "Add user" : "Agregar usuario"; // Restablecer el texto del botón

    return true;
}
