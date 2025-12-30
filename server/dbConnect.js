const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://harsh123:harsh%40123@cluster0.famxsr6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  try {
    const connect =  await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongodb connected: ${connect.connection.host}`)
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
