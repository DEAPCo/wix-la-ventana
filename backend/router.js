// Importación de módulos y funciones
import { ok, notFound, WixRouterSitemapEntry } from "wix-router"; // Importar funciones y objetos relacionados con enrutamiento
import { getUbicacionByID } from 'backend/database'; // Importar la función 'getUbicacionByID' desde el archivo 'backend/database'
import { getRoles } from "backend/users"; // Importar la función 'getRoles' desde el archivo 'backend/users'

// Función de enrutamiento para las páginas de ubicación
export async function ubicacion_Router(request) {
    if (request.path[0] === "ver") {
        // Obtener la ubicación por su ID
        const ubicacion = await getUbicacionByID(request.path[1]);

        if (ubicacion) {
            // Definir datos de SEO (Optimización para motores de búsqueda)
            const seoData = {
                title: ubicacion.nombre,
                description: ubicacion.description,
                noIndex: true
            };

            // Obtener roles del usuario
            const roles = await getRoles();
            
            // Renderizar la página de ubicación con los datos obtenidos
            return ok("ubicacion-page", { ubicacion: ubicacion, roles: roles, type: request.path[0], id: request.path[1] }, seoData);
        }

        // Devolver un error 404 si la ubicación no se encuentra
        return notFound();
    } else if (request.path[0] === "agregar") {
        // Definir datos de SEO
        const seoData = {
            title: "Agregar",
            description: "Agregar una nueva ubicación",
            noIndex: true
        };

        // Obtener roles del usuario
        const roles = await getRoles();
        
        // Renderizar la página de ubicación para agregar una nueva ubicación
        return ok("ubicacion-page", { ubicacion: undefined, roles: roles, type: request.path[0] }, seoData);
    }

    // Devolver un error 404 si la ruta no se encuentra
    return notFound();
}
