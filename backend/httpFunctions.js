// Importación de módulos y funciones
import { ok } from 'wix-http-functions'; // Importar la función 'ok' para responder a la solicitud HTTP
import wixData from 'wix-data'; // Importar el módulo 'wix-data' para acceder a los datos

/**
 * Función HTTP para obtener ubicaciones.
 * @param {Object} request - Objeto que representa la solicitud HTTP.
 * @returns {Object} - Objeto de respuesta que incluye los encabezados y el cuerpo de la respuesta.
 */
export async function get_locations(request) {
    const response = {
        "headers": {
            "Content-Type": "application/json"
        },
        "body": (await wixData.query("Ubicaciones").find()).items
    };
    return ok(response); // Responder con un objeto de respuesta que contiene las ubicaciones
}
