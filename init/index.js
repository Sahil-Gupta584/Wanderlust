const mongoose = require("mongoose");
const initdata = require("./init");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
  .then(() => console.log('connected to DB'))
  .catch(err => console.error(err));


const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({ ...obj, owner: "6602b9ad24a87f73aa485370"}));
    await Listing.insertMany(initdata.data);
    console.log("DB process done");
  
};

initDB();
