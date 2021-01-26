const urljoin = require ('url-join');
const request = require ('request-promise-native').defaults({json:true});

class FacturasResource {
    static billsUrl(resourceUrl){
        const billsServer = (process.env.BILLS_URL || "https://backend-facturacion-1.herokuapp.com");
        return urljoin (billsServer, resourceUrl);
    }

    static requestHeaders(){
        const billsKey = (process.env.BILLS_APIKEY || "WEFWEF");
        return {
            apikey : billsKey};
    }

    static postBills(id_client, matricula, duration) {
        console.log("postBills " + matricula + ", " + duration + " " + id_client)
        const url = FacturasResource.billsUrl("/api/v1/bills");
        var body = {
            id_client: id_client,
            id_vehicle: matricula,
            duration: duration,
            billStatus: "No pagado"
        }
        const options = {
            headers: FacturasResource.requestHeaders(),
            body: body
        }
        return request.post(url, options);
    }
}
module.exports = FacturasResource;