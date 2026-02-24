const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
}) ;

function generateSignature(data) {
  let pfOutput = "";

  Object.keys(data).forEach(key => {
    pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`;
  });

  pfOutput = pfOutput.slice(0, -1);
  pfOutput += `&passphrase=${encodeURIComponent(process.env.PASSPHRASE)}`;

  return crypto.createHash("md5").update(pfOutput).digest("hex");
}

app.post("/create-payment", (req, res) => {
  const paymentData = {
    merchant_id: process.env.MERCHANT_ID,
    merchant_key: process.env.MERCHANT_KEY,
    return_url: process.env.RETURN_URL,
    cancel_url: process.env.CANCEL_URL,
    notify_url: process.env.NOTIFY_URL,
    amount: "120.00",
    item_name: "DoDay Premium Subscription",
  };

  paymentData.signature = generateSignature(paymentData);

  const paymentUrl =
    "https://www.payfast.co.za/eng/process?" +
    new URLSearchParams(paymentData).toString();

  res.json({ paymentUrl });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("DoDay Backend Running 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
