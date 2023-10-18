// Importación de módulos y funciones
import { authentication, currentMember, members, authorization } from "wix-members-backend"; // Importar funciones relacionadas con la autenticación y miembros

/**
 * Obtener el nombre completo del usuario actual.
 * @returns {Promise<string>} - Promesa que resuelve con el nombre completo del usuario.
 */
export async function getNombreUsuario() {
    const userInfo = (await currentMember.getMember({ fieldsets: ["FULL"] })).contactDetails;
    return `${userInfo.firstName} ${userInfo.lastName}`;
}

/**
 * Eliminar un usuario por su ID.
 * @param {string} id - ID del usuario a eliminar.
 * @returns {Promise<void>} - Promesa que resuelve después de eliminar al usuario.
 */
export async function deleteUser(id = "") {
    return await members.deleteMember(id);
}

/**
 * Registrar un nuevo usuario con roles específicos.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} apellidos - Apellidos del usuario.
 * @param {string[]} rol - Roles del usuario.
 * @returns {Promise<boolean>} - Promesa que resuelve con true si el registro fue exitoso, o false en caso contrario.
 */
export async function register(email = "", password = "", nombre = "", apellidos = "", rol = []) {
    try {
        const user = await authentication.register(email, password, { contactInfo: { firstName: nombre, lastName: apellidos } });

        // Asignar roles específicos al usuario
        if (rol.includes("administrador")) {
            authorization.assignRole("281d19e2-e326-4cb2-9584-1e02ad843629", user.member._id, { suppressAuth: true });
        }

        if (rol.includes("editar")) {
            authorization.assignRole("d1ef1744-e3c8-49a8-9264-3e075deb745b", user.member._id, { suppressAuth: true });
        }

        if (rol.includes("agregar")) {
            authorization.assignRole("c855651c-9584-41f3-8ae6-4fb9dd7605ad", user.member._id, { suppressAuth: true });
        }

        if (rol.includes("eliminar")) {
            authorization.assignRole("1f8340b8-e508-4759-9480-3428b049a351", user.member._id, { suppressAuth: true });
        }

        return true; // Registro exitoso
    } catch (_) {
        return false; // Error en el registro
    }
}

/**
 * Iniciar sesión de un usuario con correo electrónico y contraseña.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - Promesa que resuelve con un objeto que indica el estado de inicio de sesión (status: true/false) y un token en caso de éxito.
 */
export async function login(email = "", password = "") {
    try {
        const loginResponse = await authentication.login(email, password);

        return { status: true, token: loginResponse }; // Inicio de sesión exitoso
    } catch (err) {
        return { status: false }; // Error en el inicio de sesión
    }
}

/**
 * Obtener los roles del usuario actual.
 * @returns {Promise<object>} - Promesa que resuelve con un objeto que indica si el usuario tiene los roles de 'editar', 'agregar', 'eliminar' y 'administrador', junto con un JSON de todos los roles.
 */
export async function getRoles() {
    const roles = await currentMember.getRoles();

    // Verificar la presencia de roles específicos y crear un objeto con indicadores booleanos
    var editar = roles.filter(x => x._id === "d1ef1744-e3c8-49a8-9264-3e075deb745b").length === 0 ? false : true;
    var agregar = roles.filter(x => x._id === "c855651c-9584-41f3-8ae6-4fb9dd7605ad").length === 0 ? false : true;
    var eliminar = roles.filter(x => x._id === "1f8340b8-e508-4759-9480-3428b049a351").length === 0 ? false : true;
    var admin = roles.filter(x => x._id === "281d19e2-e326-4cb2-9584-1e02ad843629").length === 0 ? false : true;

    return { editar: editar, agregar: agregar, eliminar: eliminar, admin: admin, JSON: roles };
}
