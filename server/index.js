require('dotenv').config();  // To load environment variables from .env file
const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
// (your route imports here... same as before)
const authRouter = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const uomRoutes = require('./routes/uomRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const customerRoutes = require('./routes/customerRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const salesOrderRoutes = require('./routes/salesOrderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const assetRoutes = require('./routes/assetRoutes');
const projectRoutes = require('./routes/projectRoutes');
const assemblyRoutes = require('./routes/assemblyRoutes');
const transferRoutes = require('./routes/transferRoutes');
const projectDetailsRoutes = require('./routes/projectDetailsRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const productionRoutes = require('./routes/productionRoutes');
const dieselRoutes = require('./routes/dieselRoutes');

const app = express();

// 1) Middleware
app.use(cors());
app.use(express.json());

// 2) Routes for API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/uom', uomRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/purchaseOrder', purchaseOrderRoutes);
app.use('/api/salesOrder', salesOrderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/assembly', assemblyRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/projectDetails', projectDetailsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/diesel', dieselRoutes);

// Serve static files from React (the dist folder)
app.use(express.static(path.join(__dirname, 'dist')));

// For all routes, send back the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// 3) Mongoose schema with lowercase example
const testSchema = new mongoose.Schema({
  testSimple: String,
  testLowercase: { type: String, lowercase: true }
});

const TestModel = mongoose.model('TestModel', testSchema);

// 4) MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB!');

        // Create and save a test document after DB connection
        const doc = new TestModel({
          testSimple: 'HELLO WORLD',
          testLowercase: 'HELLO WORLD'
        });

        doc.save()
          .then(savedDoc => console.log('Test document saved:', savedDoc))
          .catch(err => console.error('Error saving test document:', err));
    })
    .catch((error) => console.error('Failed to connect to MongoDB: ', error));

// 5) Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// 6) Set dynamic port for Heroku
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});