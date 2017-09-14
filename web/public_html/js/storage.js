function storagesetItem(key,value) {
    return localStorage.setItem(key, JSON.stringify(value));
}

function storagegetItem(key) {
	// console.log("key",key);
	// console.log(JSON.parse(localStorage.getItem(key)));
    return JSON.parse(localStorage.getItem(key));
}
function storageremoveItem(key) {
	// console.log("key",key);
    return localStorage.removeItem(key);
}



// localStorage.removeItem(key);