<?php 
	if($_GET['catid'] == 'tree') {
		echo '[{"catid":"1","name":"\u601d\u62d3\u4e13\u533a",hasChild:true,"childs":[]},{"catid":"2","name":"\u65b0\u95fb",hasChild:true,"childs":[]},{"catid":"3","name":"\u5a31\u4e50",hasChild:true,"childs":[]},{"catid":"4","name":"\u6c7d\u8f66",hasChild:true,"childs":[]},{"catid":"5","name":"\u623f\u4ea7",hasChild:true,"childs":[]},{"catid":"6","name":"\u65c5\u6e38",hasChild:true,"childs":[]}
		]';
	} else {
		if($_GET['catid'] == 1) {
			echo '[{"catid":"10","name":"国际",hasChild:true,"childs":[]},{"catid":"11","name":"国内",hasChild:false,"childs":[]}]';
		}
		if($_GET['catid'] == 10) {
			echo '[{"catid":"20","name":"飓风桑迪","hasChild":false,"childs":[]}]';
		}
	}
	
?>
	