const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const Bid = require('./func/Bid');
const app = express();
const port = 8081;
const auctionUrl = 'http://uptime-auction-api.azurewebsites.net/api/Auction';

app.use(cors());

let auctions = new Array();

var jsonParser = bodyParser.json();

app.get('/auctions', (req, res) => {
    axios.get(auctionUrl)
        .then((response) => {
            auctions = response.data;
            res.send(auctions);
        }).catch((error) => {
            res.status(500).send('External server is disabled');
        });
});

app.get('/getBid/:id', (req, res) => {
    let reqId = req.params['id'];
    if (reqId) {
        let sem = new Bid();
        let dbRes = sem.checkBid(reqId);
        if(dbRes !== null) {
            res.send(dbRes);
        } else {
            res.status(404).send('Bid not found');
        }
    } else {
        res.status(400).send('No parameters were given');
    }
});

app.post('/makebid', jsonParser, (req, res) => {
    let { name, surname, auctionID, auctionName, amount } = req.body;

    if (!name || !surname || !auctionID || !auctionName || !amount) {
        return res.status(400).send('Invalid request');
    }

    name = name.replace(/\s/g, '').replaceAll(';', '');
    surname = surname.replace(/\s/g, '').replaceAll(';', '');
    const currentTimeDate = new Date();
    const bidID = `${name};${surname};${currentTimeDate.toJSON()}`;

    let sem = new Bid();
    let highestBid = sem.checkBid(auctionID);
    let isBidExist = highestBid === null;

    if (amount > highestBid) {
        sem.makeBid(auctionID, auctionName, bidID, amount, isBidExist);
        return res.status(201).send('Bid has been created');
    } else {
        return res.status(200).send('Bid amount must be higher than the current highest bid');
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
