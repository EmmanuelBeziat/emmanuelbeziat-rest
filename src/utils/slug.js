/**
 * slugName
 * @param {string} fileName
 * @param {boolean} [path=false]
 * @returns string
 */

let slug = function (fileName) {
	return fileName.replace(/\.[^/.]+$/, '').slice(11)
}

export {
	slug as slug
}