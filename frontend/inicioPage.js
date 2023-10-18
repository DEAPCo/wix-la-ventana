// Importación de módulos y configuración inicial
import { getAllUbicaciones } from "backend/database"; // Importar la función 'getAllUbicaciones' desde el archivo 'backend/database'
import { getRoles } from "backend/users"; // Importar la función 'getRoles' desde el archivo 'backend/users'
import wixWindow from 'wix-window'; // Importar el módulo 'wix-window'

// Función que se ejecuta cuando la página está lista
$w.onReady(async function () {
    // Obtener los roles del usuario actual
	const roles = await getRoles();

	console.log(roles);

    // Mostrar un ícono si el usuario tiene permisos para editar o administrar
    if (roles.editar || roles.admin) {
        $w('#vectorImage1').show();
    }

    // Mostrar un botón para agregar si el usuario tiene permisos para agregar o administrar
	if (roles.agregar || roles.admin){
		$w('#button5').show();
	}

    // Cargar datos de ubicaciones en el repetidor
    $w('#repeater1').data = await getAllUbicaciones();

    // Ocultar sección si no hay datos en el repetidor y mostrar texto alternativo
    if ($w('#repeater1').data.length === 0) {
        $w('#section2').collapse();
        $w('#text12,#section3').expand();
    }

    // Configurar evento para cuando un elemento del repetidor está listo
    $w('#repeater1').onItemReady(($item, itemData, index) => {
        // Establecer el texto y la imagen para cada elemento
        $item('#text8').text = itemData.nombre;
		$item('#image7').src = itemData.logo;

        // Configurar evento al hacer clic en un elemento del repetidor
        $item('#container1').onClick(async () => {
            const slideOptions = { duration: 500, direction: "bottom" };
            if ($w('#box1').isVisible) {
                await $w('#box1').hide("slide", slideOptions);
            }

            // Mostrar información detallada del elemento seleccionado
            $w('#text13').text = itemData.nombre;
            $w('#text14').text = itemData.descripcion;
            $w('#text15').text = (wixWindow.multilingual.currentLanguage === "en" ? "Categories: " : "Categoría(s): ") + itemData.categorias.toString();
            $w('#text16').text = (wixWindow.multilingual.currentLanguage === "en" ? "Address: " : "Ubicación:\n") + itemData.ubicacion.formatted;
            $w('#image8').src = itemData.logo;

            // Establecer el enlace para editar el elemento
            $w('#vectorImage1').link = "/ubicacion/ver/" + itemData._id;

            await $w('#box1').show("slide", slideOptions);
        });
    });

    // Configurar evento para ocultar la caja al hacer clic en la sección
    $w('Section').onClick(() => {
        $w('#box1').hide("slide", { duration: 500, direction: "bottom" });
    });
});
