import { getAllUbicaciones } from "backend/database"
import { getRoles } from "backend/users"
import wixWindow from 'wix-window';

$w.onReady(async function () {
	const roles = await getRoles()

	console.log(roles)
    if (roles.editar || roles.admin) {
        $w('#vectorImage1').show()
    }

	if(roles.agregar || roles.admin){
		$w('#button5').show()
	}

    $w('#repeater1').data = await getAllUbicaciones()

    if ($w('#repeater1').data.length === 0) {
        $w('#section2').collapse()
        $w('#text12,#section3').expand();
    }

    $w('#repeater1').onItemReady(($item, itemData, index) => {
        $item('#text8').text = itemData.nombre;
		$item('#image7').src = itemData.logo

        $item('#container1').onClick(async () => {
            const slideOptions = { duration: 500, direction: "bottom" }
            if ($w('#box1').isVisible) {
                await $w('#box1').hide("slide", slideOptions)
            }

            $w('#text13').text = itemData.nombre;
            $w('#text14').text = itemData.descripcion;
            $w('#text15').text = (wixWindow.multilingual.currentLanguage === "en" ? "Categories: " : "Categoría(s): ") + itemData.categorias.toString()
            $w('#text16').text = (wixWindow.multilingual.currentLanguage === "en" ? "Address: " : "Ubicación:\n") + itemData.ubicacion.formatted
			$w('#image8').src = itemData.logo

            $w('#vectorImage1').link = "/ubicacion/ver/" + itemData._id

            await $w('#box1').show("slide", slideOptions)
        })
    });

    $w('Section').onClick(() => {
        $w('#box1').hide("slide", { duration: 500, direction: "bottom" })
    })

});
