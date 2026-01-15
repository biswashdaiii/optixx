const CryptoJS = require('crypto-js');

exports.generateSignature = (req, res) => {
    try {
        const { amount, transaction_uuid, product_code } = req.body;
        // Official eSewa v2 Sandbox Secret Key
        const secretKey = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";

        // IMPORTANT: The message string MUST NOT have any spaces and must match the order in signed_field_names
        const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

        const hash = CryptoJS.HmacSHA256(message, secretKey);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

        res.json({ signature: hashInBase64 });
    } catch (error) {
        console.error("eSewa Signature Error:", error);
        res.status(500).json({ error: "Could not generate signature" });
    }
};

exports.verifyPayment = (req, res) => {
    const { data } = req.query;
    if (!data) return res.status(400).json({ error: "No data provided" });

    try {
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        res.json({ message: "Payment Verified", decodedData });
    } catch (error) {
        res.status(400).json({ error: "Invalid data format" });
    }
};
