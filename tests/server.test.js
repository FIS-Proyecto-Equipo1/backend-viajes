const app = require('../server.js')
const request = require('supertest')
const Travel = require('../travels.js');
jest.setTimeout(30000);

describe("Travels API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            })
        }); 
    });
});


describe("GET /travels", () =>{
            beforeAll(() => {
                const travels = [
                    new Travel({"id_cliente":"235","id_vehiculo":"457","estado":"EN CURSO","duracion":"001 min"}),
                    new Travel({"id_cliente":"234","id_vehiculo":"454","estado":"EN CURSO","duracion":"001 min"})
                ];
                dbFind = jest.spyOn(Travel, "find");
                dbFind.mockImplementation((query, callback) => {
                    callback(null, travels);
                });
            });
            it('Shoud return all travels', ()=>{
                return request(app).get('/api/v1/travels').then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toBeArrayOfSize(2);
                    expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
});


describe("POST /vehicles", () => {
    const travel = {"id_cliente":"231","id_vehiculo":"451","estado":"EN CURSO","duracion":"001 min"}
    let dbInsert;
     
    beforeEach(() => {
        dbInsert = jest.spyOn(Travel, "create");
    })


    it ("should add a new vehicle", () => {
       dbInsert.mockImplementation((c, callback) => {
           callback(false);
       });

       return request(app).post('/api/v1/travels').send(travel).then((response) => {
            expect(response.statusCode).toBe(201);
            expect(dbInsert).toBeCalledWith(travel, expect.any(Function));
       });

    });

    it('should return 500 if any error occurred', ()=>{
        dbInsert.mockImplementation((c, callback) => {
            callback(true);
        });

        return request(app).post('/api/v1/travels').send(travel).then((response) => {
            expect(response.statusCode).toBe(500);
       });
    });
});