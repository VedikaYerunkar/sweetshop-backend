const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.post('/order', (req, res) => {
  try {
    const order = req.body;
    const filePath = path.join(__dirname, 'order.json');
    const orders = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      : [];
    orders.push(order);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: 'Order saved successfully!' });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
