import { getAllUsers } from "backend/database"
import { deleteUser, register } from "backend/users"
import wixAnimations from 'wix-animations';
import wixWindow from 'wix-window';

$w.onReady(async function () {
    await resetRepeater();

    $w('#repeater1').onItemReady(($item, itemData, index) => {
        $item('#text8').text = itemData.name;
        $item('#text9').text = itemData.loginEmail;

        $item('#button3').onClick(async () => {
			$item('#button3').disable()
            await deleteUser(itemData._id)
            await resetRepeater()
        });
    });

    $w('#button5').onClick(async () => {
        if ($w('#section3').isVisible) {
            await hideRegister()
        } else {
            await $w('#section2').hide("slide", { duration: 1000, direction: "left" })
            await $w('#section2').collapse()
            await $w('#section3').expand()
            await $w('#section3').show("slide", { duration: 1000, direction: "right" })
            $w('#button5').label = "Cancelar"
        }
    });

    $w('#input1,#input2,#input3,#input4').onInput(() => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\x00-\x7F]{5,}$/;

        if ($w('#input1').valid && $w('#input2').valid && $w('#input3').valid && $w('#input4').valid && regex.test($w('#input4').value)) {
            $w('#button6').enable();
        } else {
            $w('#button6').disable()
        }
    });

    $w('#button6').onClick(async () => {
        $w('#image7').show();
        $w('#text13').hide();
        $w('#button6').disable();
        const animation = wixAnimations.timeline({ repeat: -1 }).add($w('#image7'), { rotate: 360, duration: 1000, easing: "easeLinear" }).replay()

        const registerResponse = await register($w('#input1').value, $w('#input4').value, $w('#input2').value, $w('#input3').value, $w('#checkboxGroup1').value)
        if (registerResponse) {
			await hideRegister();
            await resetRepeater()
		
			$w('#input1,#input2,#input3,#input4').value = ""
			animation.pause()
			$w('#image7').hide()
        } else {
            $w('#text13').show("slide", { duration: 1000, direction: "right" })
            $w('#button6').enable()
            $w('#image7').hide()
        }
    })

});

async function resetRepeater() {
    $w('#repeater1').data = await getAllUsers()

    if ($w('#repeater1').data.length === 0) {
        await $w('#repeater1').collapse()
        await $w('#text12').expand();
    }
    return true
}

async function hideRegister() {
    await $w('#section3').hide("slide", { duration: 1000, direction: "right" })
    await $w('#section3').collapse()
    await $w('#section2').expand()
    await $w('#section2').show("slide", { duration: 1000, direction: "left" })

    $w('#button5').label = wixWindow.multilingual.currentLanguage === "en" ? "Add user" : "Agregar usuario"

	return true
}
