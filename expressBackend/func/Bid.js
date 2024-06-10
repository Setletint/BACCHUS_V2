const Database = require('better-sqlite3');
const db = new Database('./bidsDatabase.sqlite');
db.pragma('journal_mode = WAL');

class Bid {
    constructor() {
        this.createDatabase();
    }

    createDatabase() {
        db.exec(`
            CREATE TABLE IF NOT EXISTS bids (
                auctionID TEXT,
                auctionName TEXT,
                userID TEXT,
                highestBid DECIMAL(255, 2)
            )
        `);
    }

    dropBidsTable() {
        db.exec("DROP TABLE IF EXISTS bids");
    }

    checkBid(productId) {
        const maxBidObj = db.prepare(`SELECT MAX(highestBid) as highestBid FROM bids WHERE auctionID = ?`).get(productId);
        return maxBidObj.highestBid;
    }

    makeBid(productId, auctionName, userID, amount, isBidExist) {
        if (!isBidExist) {
            const stmt = db.prepare(`INSERT INTO bids (auctionID, auctionName, userID, highestBid) VALUES (?, ?, ?, ?)`);
            stmt.run(productId, auctionName, userID, amount);
        } else {
            const stmt = db.prepare(`UPDATE bids SET userID = ?, highestBid = ? WHERE auctionID = ?`);
            stmt.run(userID, amount, productId);
        }
    }
}

module.exports = Bid;
