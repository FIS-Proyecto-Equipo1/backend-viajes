const Travel = require('../travels.js');
const mongoose = require('mongoose');
const dbConnect = require('../db.js');

jest.setTimeout(30000);


describe('Travel db connection', ()=>{

    beforeAll(()=>{
        return dbConnect(); 
    })

    beforeEach((done)=>{
        Travel.deleteMany({}, (err)=>{
            done();
        });
    });

    it('writes a travel in the DB', (done)=>{
        const travel = new Travel({"id_cliente":"1","id_vehiculo":"6743TRQ","estado":"FINALIZADO","duracion":"00:00:03.493"})
        travel.save((err, travel) => {
            expect(err).toBeNull();
            Travel.find({}, (err, travels) => {
                expect(travels).toBeArrayOfSize(1);
                done();
            });
        });
    })

    afterAll((done) => {
        mongoose.connection.db.DropDatabase(() => {
            mongoose.connection.close(done);
        })
    })
})