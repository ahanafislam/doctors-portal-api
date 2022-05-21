const express = require('express');
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9zj3w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run =  async () => {
    try {
        await client.connect();
        const servicesCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // Apis for booking
        app.post('/booking', async(req, res) => {
          const booking = req.body;
          const query = {treatment: booking.treatment, date: booking.date, patient: booking.patient}
          const exists = await bookingCollection.findOne(query);
          
          if(exists) {
            return res.send({success: false, booking: exists});
          }

          const result = await bookingCollection.insertOne(booking);
          return res.send({success: true, result});
        });
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Doctors Portal Api');
})

app.listen(port, () => {
  console.log(`Doctors Portal app listening on port ${port}`);
})