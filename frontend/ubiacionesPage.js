// Importación de módulos y configuración inicial
import wixWindow from 'wix-window'; // Importar el módulo 'wix-window'
import * as wixData from "backend/database"; // Importar el módulo 'wixData' desde el archivo 'backend/database'
import wixLocation from 'wix-location'; // Importar el módulo 'wix-location'
import wixAnimations from 'wix-animations'; // Importar el módulo 'wix-animations'

// Función que se ejecuta cuando la página está lista
$w.onReady(function () {
    // Obtener datos de la URL
    const context = wixWindow.getRouterData();
    const type = context.type;
    const ubicacion = context.ubicacion;
    const roles = context.roles;

    // Definir un objeto para guardar datos
    var toSave = {
        "ubicacion": undefined,
        "nombre": undefined,
        "descripcion": undefined
    }

    // Verificar el tipo de operación (ver o editar)
    if (type === "ver") {
        // Mostrar detalles de la ubicación
        $w('#inputNombre').value = ubicacion.nombre;
        $w('#textBoxDescripcion').value = ubicacion.descripcion
        $w('#addressInput1').value = ubicacion.ubicacion
        $w('#selectionTags1').value = ubicacion.categorias
        $w('#image8').src = ubicacion.logo
        $w('#text11').text = "Cambiar Logo o Icono *"

        toSave = ubicacion

        // Verificar roles para mostrar u ocultar botones
        if (roles.eliminar) {
            $w('#text11,#uploadButton1').hide()
            $w('#button5').show();
        }

        if (roles.editar) {
            $w('#button6').show();
            $w('#inputNombre,#textBoxDescripcion,#addressInput1').readOnly = false;
        }

        if (roles.admin) {
            $w('#button6,#button5').show();
            $w('#inputNombre,#textBoxDescripcion,#addressInput1').readOnly = false;
        }
    } else {
        // Ocultar botón de eliminación y mostrar botón de carga
        $w('#button5').hide();
        $w('#text11,#uploadButton1').show()
        $w('#group1').hide()

        // Verificar roles para mostrar botón de edición y habilitar campos de entrada
        if (roles.agregar || roles.admin) {
            $w('#button6').show();
            $w('#inputNombre,#textBoxDescripcion,#addressInput1').readOnly = false;
        }
    }

    // Manejar clic en el botón de eliminación
    $w('#button5').onClick(async () => {
        $w('#image7').show()
        wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay()

        // Eliminar la ubicación y redirigir a la página de inicio
        await wixData.deleteUbicacionByID(context.id)
        await wixLocation.to("/inicio")
    });

    // Manejar clic en el botón de edición o guardado
    $w('#button6').onClick(async () => {
        $w('#image7').show()
        $w('#button6').disable()
        wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay()

        // Guardar los datos editados
        toSave = {
            ...toSave,
            "ubicacion": $w('#addressInput1').value,
            "nombre": $w('#inputNombre').value,
            "descripcion": $w('#textBoxDescripcion').value,
            "categorias": $w('#selectionTags1').value,
            "logo": $w('#image8').src
        }

        await wixData.addOrUpdateUbicacion(toSave)
        await wixLocation.to("/inicio")
    })

    // Manejar cambio en la carga de imagen
    $w('#uploadButton1').onChange(async () => {
        $w('#uploadButton1').disable()
        $w('#image8').src = "https://static.wixstatic.com/media/4c0a11_5a2e388d917d428e986537e27ecc064b~mv2.png"
        $w('#group1').show()
        const firstAnim = wixAnimations.timeline({ repeat: -1 }).add($w('#image8'), { rotate: 360, duration: 1000, easing: "easeLinear" })
        firstAnim.play()

        // Subir el archivo seleccionado y mostrar la imagen
        const file = await $w('#uploadButton1').uploadFiles()
        firstAnim.pause();
        wixAnimations.timeline().add($w('#image8'), { rotate: 0, duration: 1, easing: "easeLinear", delay: 500 }).replay()
        $w('#image8').src = file[0].fileUrl
        $w('#uploadButton1').enable()
    })

    // Manejar cambios en los campos de entrada
    $w('#uploadButton1,#textBoxDescripcion,#addressInput1,#inputNombre,#selectionTags1').onChange(() => {
        // Habilitar o deshabilitar el botón de guardado según la validez de los campos
        if ($w('#inputNombre').valid && $w('#addressInput1').valid && $w('#textBoxDescripcion').valid && $w('#selectionTags1').value.length > 0) {
            $w('#button6').enable()
        } else {
            $w('#button6').disable()
        }
    })
});
