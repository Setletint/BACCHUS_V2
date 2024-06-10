import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './expressBackend/bidsDatabase.sqlite'
})

const bids = sequelize.define(
    'bids',
    {
        auctionID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        auctionName: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        highestBid: {
            type: DataTypes.FLOAT
        }
    }
)