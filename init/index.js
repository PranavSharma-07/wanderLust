const mongoose  =  require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")


main()
.then(()=>{
    console.log("connection successful!");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

}

let initDb = async () => {
    await Listing.deleteMany({ });
    initData.data = initData.data.map((obj) => ({...obj, owner: '6a68aae06b4b781c38e69cb7' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

// ⚠️ WARNING:
// Running this file will delete all existing listings

initDb();