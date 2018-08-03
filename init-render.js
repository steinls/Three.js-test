var scene,camera,renderer;
var controls;
function init(r){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
	camera.position.set(-30,40,30);
	camera.lookAt(scene.position);

	if(r==='webgl'){
		renderer = new THREE.WebGLRenderer({canvas:$('canvas')[0]});
	}else{
		renderer = new THREE.CanvasRenderer({canvas:$('canvas')[0]});
	}
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor('gray');
	renderer.shadowMap.enabled = true;
}

function render(){
	animation();
	requestAnimationFrame(render);
	renderer.render(scene,camera);
}

function animation(){}

function addControls(){
	controls = new THREE.OrbitControls(camera,renderer.domElement);
}



function iinit(name,fn,r){
	$('title').html(name);
	$('body').css({
		margin:0,
		padding:0,
		overflow:'hidden'
	});
	$('body').append('<canvas></canvas>');
	
	init(r);
	fn&&fn();
	addControls();
	render();
}