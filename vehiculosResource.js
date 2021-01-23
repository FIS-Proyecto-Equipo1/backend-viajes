const urljoin = require('url-join')
const request = require('request-promise-native').defaults({json: true})


class VehiculosResource {
    static STATUS_DISPONIBLE = "DISPONIBLE"
    static STATUS_RESERVADO = "RESERVADO"
    static STATUS_TRAYECTO = "TRAYECTO"
    
    static vehiculosUrl(resourceUrl) {
        const vehiculosServer = (process.env.VEHICULOS_URL || 'https://urbanio-vehiculos.herokuapp.com');
        return urljoin(vehiculosServer, resourceUrl);
    }

    static requestHeaders() {
        return {
            "x-role": "ADMIN",
            "rol": "ADMIN"
        };
    }

    static patchVehicle(id_vehiculo, estado) {
        console.log("patchVehicle " + id_vehiculo + ", " + estado)
        const url = VehiculosResource.vehiculosUrl("/api/v1/vehicles/" + id_vehiculo);
        var body = {
            estado: estado
        }
        const options = {
            headers: VehiculosResource.requestHeaders(),
            body: body
        }

        return request.patch(url, options);
    }
}


module.exports = VehiculosResource;