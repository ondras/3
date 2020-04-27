import Box from "./box.js";

let boxes = [];
const form = document.querySelector("form");
const submit = form.querySelector("[type=submit]");

function formEnabled(enabled) {
	submit.textContent = (enabled ? "Create!" : "Please wait...");
	[...form.querySelectorAll("input, button")].forEach($ => $.disabled = !enabled);
}

async function create(str, parent) {
	let response = await fetch(`create/?str=${encodeURIComponent(str)}`);
	if (response.status != 200) {
		let text = await response.text();
		throw new Error(text);
	}

	let urls = await response.json();
	boxes = [];
	while (urls.length) {
		let box = await Box.create(urls.shift());
		boxes.push(box);
		parent.appendChild(box.node);
	}
}

async function onSubmit(e) {
	e.preventDefault();
	const results = document.querySelector("#results");

	const str = document.querySelector("[name=str]").value.trim();
	if (str.length != 3) { return alert("Please enter exactly three characters"); }

	try {
		formEnabled(false);
		boxes.forEach(box => box.dispose());
		results.innerHTML = "";
		await create(str, results);
	} catch (e) {
		alert(e.message);
	} finally {
		formEnabled(true);
	}
}

form.addEventListener("submit", onSubmit);
formEnabled(true);
