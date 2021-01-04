const Travel = require('../travels.js');
const mongoose = require('mongoose');
const dbConnect = require('../db.js');

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
        const travel =  Travel({"id_cliente":"235","id_vehiculo":"457","estado":"EN CURSO","duracion":"001 min"});
        travel.save((err, travel) => {
            expect(err).toBeNull();
            Travel.find({}, (err, travels) => {
                expect(travels).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.DropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});
