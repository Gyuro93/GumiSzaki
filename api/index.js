var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
const res = require("express/lib/response");

var app = Express();
app.use(cors());
app.use(Express.json());

var CONNECTION_STRING = "mongodb+srv://gumiSzaki:admin@gyurodb.fkypbj1.mongodb.net/?retryWrites=true&w=majority";

var DATABSENAME = "munka";
var database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("Kapcsolódási hiba: ", error);
            return;
        }
        database = client.db(DATABSENAME);
        console.log("Kapcsolat létrejött ..");
    });
});

app.get('/api/munkacollection/GetNotes', (request, response) => {
    database.collection("munkacollection").find({}).toArray((error, result) => {
        if (error) {
            console.error("Hiba a lekérdezés során: ", error);
            response.status(500).json("Hiba történt a lekérdezés során");
        } else {
            response.json(result);
        }
    });
});

app.post('/api/munkacollection/AddNote', (request, response) => {
    const newRendszam = request.body.rendszam;
    const newMunka = request.body.munka;
    const newPrice = request.body.price;

    database.collection("munkacollection").countDocuments({}, (error, numOfDocs) => {
        if (error) {
            console.error("Hiba a számolás során: ", error);
            response.status(500).json("Hiba történt a számolás során");
        } else {
            const newId = (numOfDocs + 1).toString();
            database.collection("munkacollection").insertOne({
                id: newId,
                rendszam: newRendszam,
                munka: newMunka,
                price: newPrice
            }, (error, result) => {
                if (error) {
                    console.error("Hiba a hozzáadás során: ", error);
                    response.status(500).json("Hiba történt a hozzáadás során");
                } else {
                    response.json("Sikeresen hozzáadva");
                }
            });
        }
    });
});

app.delete('/api/munkacollection/DeleteNotes/:id', (request, response) => {
    const idToDelete = request.params.id;
    database.collection("munkacollection").deleteOne({ id: idToDelete }, (error, result) => {
        if (error) {
            console.error("Hiba a törlés során: ", error);
            response.status(500).json("Hiba történt a törlés során");
        } else {
            response.json("Sikeresen törölve");
        }
    });
});
