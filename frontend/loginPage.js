import {login} from "backend/users"
import wixAnimations from 'wix-animations';
import {authentication} from "wix-members"
import wixLocation from 'wix-location';

$w.onReady(function () {
	const animation = wixAnimations.timeline({repeat:-1}).add($w('#image1'),{rotate:360,duration:1000, easing:"easeLinear"})

	$w('#button1').onClick(async ()=>{
		animation.replay();
		$w('#text5').hide();
		$w('#button1').disable()

		const loginResponse = await login($w('#input1').value, $w('#input2').value)
		if(loginResponse.status){
			await authentication.applySessionToken(loginResponse.token)
			$w('#text5').text = "Ingresando a tu cuenta..."
			$w('#text5').show()
			
			wixLocation.to("/inicio")
		} else {
			animation.pause();
			$w('#text5').show();
			$w('#button1').enable();
		}
	});

});
