const urljoin = require ('url-join');
const request = require('request-promise-native').defaults({json: true});

class ReservasResource{
    static reservasUrl(resourceUrl){
        const reservasServer = (process.env.RESERVAS_URL || 'https://urbanio-reservas.herokuapp.com/api/v1');
        return urljoin(reservasServer, resourceUrl);
    };
}

    static requestHeaders() {
        const reservasKey = (process.env.RESERVAS_APIKEY || '/reservas');
        return{
            apikey: reservasKey
        };
    }

    static getNuevasReservas() {
        const url = ReservasResource.reservasUrl
    }