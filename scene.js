const SIZE = [400, 400];
document.body.style.setProperty("--scene-width", SIZE[0]);

export default class Scene {
	static async create(url) {
		let data = await load(url);
		return new this(data);
	}

	constructor(data) {
		this._disposables = [];

		preprocess(data);

		let renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize(...SIZE);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		this._disposables.push(renderer);

		let scene = new THREE.Scene();
		scene.background = new THREE.Color(0xdddddd);
		this._disposables.push(scene);

		lights(scene, 50);
		walls(scene, 20);
		scene.add(data);

		let ratio = SIZE[0]/SIZE[1];
		let w = 45;
		let h = w / ratio;

		let camera = new THREE.OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, 1, 1000 )
		camera.position.set(9, 9, 15);

		function render() { renderer.render(scene, camera); }

		let controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener("change", render);
		this._disposables.push(controls);

		render();
		this.node = renderer.domElement;
	}

	dispose() {
		this._disposables.forEach(d => d.dispose());
	}
}

function preprocess(data) {
	data.rotateX(-Math.PI/2);

	const ch = data.children[0].children[0];
	ch.castShadow = true;
	const material = ch.material;
	material.specular = {r:.2, g:.2, b:.2};
}

function lights(scene, dist) {
	for (let i=0;i<3;i++) {
		let light = new THREE.DirectionalLight(0xffffff, 0.7);
		light.castShadow = true;
		light.position.set(i == 0 ? dist : 0, i == 1 ? dist : 0, i == 2 ? dist : 0);
		scene.add(light);
	}
}

function walls(scene, dist) {
	for (let i=0;i<3;i++) {
		let material = new THREE.MeshPhongMaterial({color: 0xffffff - i*0x111111, side: THREE.DoubleSide});
		let geometry = new THREE.PlaneGeometry(2*dist, 2*dist);
		let plane = new THREE.Mesh(geometry, material);
		plane.receiveShadow = true;
		let pos = -dist;
		plane.position.set(i == 0 ? pos : 0, i == 1 ? pos : 0, i == 2 ? pos : 0);
		if (i == 0) plane.rotateY(Math.PI/2);
		if (i == 1) plane.rotateX(Math.PI/2);
		scene.add(plane);
	}
}

async function load(url) {
	return new Promise((resolve, reject) => {
		new THREE.ThreeMFLoader().load(url, resolve, null, reject);
	});
}
