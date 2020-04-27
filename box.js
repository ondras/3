import Scene from "./scene.js";

export default class Box {
	static async create(url) {
		let scene = await Scene.create(url);
		return new this(url, scene);
	}

	constructor(url, scene) {
		this._scene = scene;

		this.node = document.createElement("div");
		this.node.classList.add("box");

		this.node.appendChild(this._scene.node);

		let a = document.createElement("a");
		a.href = url;
		a.target = "_blank";
		a.textContent = url.split("/").pop();
		this.node.appendChild(a);
	}

	dispose() {
		this._scene.dispose();
	}
}
