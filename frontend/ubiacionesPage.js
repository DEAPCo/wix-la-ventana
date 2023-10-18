import wixWindow from 'wix-window';
import * as wixData from "backend/database"
import wixLocation from 'wix-location';
import wixAnimations from 'wix-animations';

$w.onReady(function () {
    const context = wixWindow.getRouterData();
    const type = context.type;
    const ubicacion = context.ubicacion;
    const roles = context.roles;

    var toSave = {
        "ubicacion": undefined,
        "nombre": undefined,
        "descripcion": undefined
    }

    if (type === "ver") {
        $w('#inputNombre').value = ubicacion.nombre;
        $w('#textBoxDescripcion').value = ubicacion.descripcion
        $w('#addressInput1').value = ubicacion.ubicacion
        $w('#selectionTags1').value = ubicacion.categorias
        $w('#image8').src = ubicacion.logo
        $w('#text11').text = "Cambiar Logo o Icono *"

        toSave = ubicacion

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
        $w('#button5').hide();
        $w('#text11,#uploadButton1').show()
        $w('#group1').hide()

        if (roles.agregar || roles.admin) {
            $w('#button6').show();
            $w('#inputNombre,#textBoxDescripcion,#addressInput1').readOnly = false;
        }
    }

    $w('#button5').onClick(async () => {
        $w('#image7').show()
        wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay()

        await wixData.deleteUbicacionByID(context.id)
        await wixLocation.to("/inicio")
    });

    $w('#button6').onClick(async () => {
        $w('#image7').show()
        $w('#button6').disable()
        wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay()

        toSave = {
            ...toSave,
            "ubicacion": $w('#addressInput1').value,
            "nombre": $w('#inputNombre').value,
            "descripcion": $w('#textBoxDescripcion').value,
            "categorias":$w('#selectionTags1').value,
            "logo":$w('#image8').src
        }

        await wixData.addOrUpdateUbicacion(toSave)
        await wixLocation.to("/inicio")
    })

    $w('#uploadButton1').onChange(async ()=>{
        $w('#uploadButton1').disable()
        $w('#image8').src = "https://static.wixstatic.com/media/4c0a11_5a2e388d917d428e986537e27ecc064b~mv2.png"
        $w('#group1').show()
        const firstAnim = wixAnimations.timeline({ repeat: -1 }).add($w('#image8'), { rotate: 360, duration: 1000, easing: "easeLinear" })
        firstAnim.play()

        const file = await $w('#uploadButton1').uploadFiles()
        firstAnim.pause();
        wixAnimations.timeline().add($w('#image8'), { rotate: 0, duration: 1, easing: "easeLinear",delay:500 }).replay()
        $w('#image8').src = file[0].fileUrl
        $w('#uploadButton1').enable()
    })

    $w('#uploadButton1,#textBoxDescripcion,#addressInput1,#inputNombre,#selectionTags1').onChange(()=>{
        if($w('#inputNombre').valid && $w('#addressInput1').valid && $w('#textBoxDescripcion').valid && $w('#selectionTags1').value.length > 0){
            $w('#button6').enable()
        } else {
            $w('#button6').disable()
        }
    })

});
