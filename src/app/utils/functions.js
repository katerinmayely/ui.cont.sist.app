// Función que devuelve el conteo de transacciones dado un nombre de tag
function getTransactionCountByTag(array, tagName) {
    // Buscar el tag con el nombre dado
    const tag = array.find(t => t.tag.name.toLowerCase() === tagName.toLowerCase());
    
    // Si se encuentra el tag, devolver el conteo, si no, devolver 0
    return tag ? tag.conteo : 0;
}

module.exports = getTransactionCountByTag;