const app = require('../server.js');
const request = require('supertest');
const Travel = require('../travels.js');

jest.setTimeout(30000);


describe("Travels API", () => {


    describe("GET /", () => {
        it("should return html", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });

    describe("GET /travels", () => {
        let dbFind;
        let dbFindOne;
        let travelOK;

        beforeAll( () => {
            const travels = [
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"1","id_vehiculo":"6743TRQ","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"2","id_vehiculo":"6744TGW","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0})
            ];

            dbFind = jest.spyOn(Travel, "find");
            dbFind.mockImplementation(({}, callback) => {
                callback(null, travels);
            });

            travelOK = travels[0];

            dbFindOne = jest.spyOn(Travel, "findOne");
            dbFindOne.mockImplementation((filter, callback) => {
                callback(null, travelOK);
            });
        });

        it("should return all travel", () => {
            return request(app).get('/api/v1/travels').set({rol:"ADMIN"}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(3);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });            
        })

        it("should return one travel searching by id_cliente", () => {
            return request(app).get('/api/v1/travels/find?id_cliente='+travelOK.id_cliente).set({rol:"ADMIN"}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbFindOne).toBeCalledWith({"id_cliente":travelOK.id_cliente}, expect.any(Function));
            });
        })

        it("should return one travel searching by id_vehiculo", () => {
            return request(app).get('/api/v1/travels/find?id_vehiculo='+travelOK.id_vehiculo).set({rol:"ADMIN"}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbFindOne).toBeCalledWith({"id_vehiculo":travelOK.id_vehiculo}, expect.any(Function)); 
            });
        })

        it("should return one travel searching by estado", () => {
            return request(app).get('/api/v1/travels/find?estado='+travelOK.estado).set({rol:"ADMIN"}).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(dbFindOne).toBeCalledWith({"estado":travelOK.estado}, expect.any(Function)); 
            });
        })


        // it("should not return any travel", () => {
        //     dbFindOne.mockImplementation((filter, callback) => {
        //         callback(null, null);
        //     })
        //     return request(app).get('/api/v1/travels/find?id=abc').then((response) => {
        //         expect(response.statusCode).toBe(404);
        //         expect(dbFindOne).toBeCalledWith({"id":"abc"}, expect.any(Function));
        //     });
        // })
    });

    describe("POST /travels", () => {
        const travel = {"_id":"6010a090523dc838601265bf","id_cliente":"1","id_vehiculo":"6743TRQ","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}
        let dbInsert;
         
        beforeEach(() => {
            dbInsert = jest.spyOn(Travel, "create");
        })

        it('should be forbidden without rol admin', ()=>{
            return request(app).post('/api/v1/travels/').send(travel).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });

        it ("should add a new travel", () => {
           dbInsert.mockImplementation((c, callback) => {
               callback(false);
           });

           return request(app).post('/api/v1/travels').set({rol:"ADMIN"}).send(travel).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(travel, expect.any(Function));
           });

        });

        it('should return 500 if any error occurred', ()=>{
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/travels').set({rol:"ADMIN"}).send(travel).then((response) => {
                expect(response.statusCode).toBe(500);
           });
        });
    });

    describe("DELETE /travels/:id", () => {
        let dbDelete;
        let travelOK;

        beforeAll( () => {
            const travels = [
                new Travel({"_id":"1","id_cliente":"1","id_vehiculo":"6743TRQ","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"2","id_cliente":"2","id_vehiculo":"6744TGW","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"3","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0})
            ];
            
            travelOK = travels[0];

            dbDelete = jest.spyOn(Travel, "findOneAndDelete");
            dbDelete.mockImplementation(({}, callback) => {
                callback(null, travelOK);
            });
        });

        it('should delete  one travel', ()=>{
            return request(app).delete('/api/v1/travels/'+travelOK._id).then((response) => {
                expect(response.statusCode).toBe(204);
                expect(dbDelete).toBeCalledWith({ "_id": travelOK.id}, expect.any(Function));
           });

        
        });

        it('should not delete any travel', ()=>{
            return request(app).delete('/api/v1/travels/aaaaa').then((response) => {
                expect(response.statusCode).toBe(204);
                expect(String(response.body)).toMatch(String({}));
                expect(dbDelete).toBeCalledWith({"_id":'aaaaa'}, expect.any(Function));
           });
        });
    });

    // describe("PUT /travels/:id", () => {
    //     let dbPut;
    //     let travelOK;
    //     let travelUp;
        
    //     beforeAll( () => {
    //         const travels = [
    //             new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
    //             new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"2","id_vehiculo":"6744TGW","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
    //             new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0})
    //         ];
            
    //         travelOK = travels[0];
    //         travelUp =  new Travel({"matricula":"2345TGF", "tipo": "Moto", "estado":"RESERVADO", "permiso":"AB", "localizacion" : "Malaga" });
            
    //         dbPut = jest.spyOn(Travel, "findOneAndUpdate");
    //         dbPut.mockImplementation((filter, update_travel, validators, callback) => {
    //             callback(null, travelUp);
    //         });
    //     });

    //     it('should not modify any travel', ()=>{
    //         dbPut.mockImplementation((filter, update_travel, validators, callback) => {
    //             callback(null, null);
    //         });
    //     });

    // });

    describe("PATCH /travels/:id", () => {
        let dbPatch;
        let travelOK;
        let travelUp;

        beforeAll( () => {
            const travels = [
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"2","id_vehiculo":"6744TGW","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0}),
                new Travel({"_id":"6010a090523dc838601265bf","id_cliente":"3","id_vehiculo":"6743TRE","estado":"FINALIZADO","duracion":"00:00:03.493","__v":0})
            ];
            
            travelOK = travels[0];
            travelUp =  {"estado": "EN CURSO"};
            
            dbPatch = jest.spyOn(Travel, "updateOne");
            dbPatch.mockImplementation((filter, update_travel, validators, callback) => {
                callback(null, travelOK);
            });
        });
        
        it('Should return 500 if any error ocurred', ()=>{
            return request(app).patch('/api/v1/travels/'+travelOK._id).send(travelUp).then((response) => {
                expect(response.statusCode).toBe(500);
                //expect(String(response.body)).toMatch(String(travelOK.cleanId()));
                //expect(dbPatch).toBeCalledWith({"matricula":travelOK.matricula}, expect.any(Object), {"runValidators": true} ,expect.any(Function));
           });
        });


     });
     });
    // });