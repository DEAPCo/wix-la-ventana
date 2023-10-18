// Importación del módulo 'wix-data'
import wixData from 'wix-data';

// Funciones relacionadas con ubicaciones
// Estas funciones interactúan con la colección 'Ubicaciones' en la base de datos

/**
 * Agregar o actualizar una ubicación en la colección 'Ubicaciones'.
 * @param {object} toSave - Datos de la ubicación a guardar o actualizar.
 * @returns {Promise<object>} - Promesa que resuelve con el resultado de la operación.
 */
export async function addOrUpdateUbicacion(toSave = {}) {
    return await wixData.save("Ubicaciones", toSave);
}

/**
 * Eliminar una ubicación por su ID de la colección 'Ubicaciones'.
 * @param {string} id - ID de la ubicación a eliminar.
 * @returns {Promise<object>} - Promesa que resuelve con el resultado de la operación.
 */
export async function deleteUbicacionByID(id = "") {
    return await wixData.remove("Ubicaciones", id);
}

/**
 * Obtener una ubicación por su ID de la colección 'Ubicaciones'.
 * @param {string} id - ID de la ubicación a obtener.
 * @returns {Promise<object>} - Promesa que resuelve con la ubicación encontrada.
 */
export async function getUbicacionByID(id = "") {
    return await wixData.get("Ubicaciones", id);
}

/**
 * Obtener todas las ubicaciones de la colección 'Ubicaciones'.
 * @returns {Promise<Array>} - Promesa que resuelve con un array de todas las ubicaciones.
 */
export async function getAllUbicaciones() {
    const ubicaciones = (await wixData.query("Ubicaciones").find()).items;
    return ubicaciones;
}

// Funciones relacionadas con usuarios
// Estas funciones interactúan con la colección 'Members/PrivateMembersData' en la base de datos

/**
 * Obtener todos los usuarios de la colección 'Members/PrivateMembersData' con la excepción de algunos usuarios específicos.
 * @returns {Promise<Array>} - Promesa que resuelve con un array de usuarios.
 */
export async function getAllUsers() {
    const users = (await wixData.query("Members/PrivateMembersData").find({ suppressAuth: true })).items;
    
    // Filtrar y excluir usuarios específicos por ID
    return users.filter(x => x._id !== "cd004bda-0c6c-4fbd-8e02-4e95aac346df" && x._id !== "4c0a114b-54c6-4c03-a0db-76a02e494d4f");
}
