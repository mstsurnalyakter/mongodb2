const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

/** -------------
 * connect MongoDB database to the express server
 * ------------------ */
const connectDB = async () =>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/schemaValidationDB");
        console.log(`db's connected`);
    } catch (error) {
        console.log(error);
        console.log(`db's not connected`);
        process.exit(1);
    }
}


/** -------------Schema------------------ */
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "product title is required"],
    minlength: [3, "minimum length of the product title should be 3"],
    maxlength: [15, "maximum length of the product title shold be 15"],
    lowercase: true,
    trim: true,
    // enum: {
    //   values: ["book", "beg", "pen"],
    //   message:"{VALUE} is not supported"
    // },
  },
  price: {
    type: Number,
    required: [true, "product price is required"],
    min: [5, "minimum price of the product  should be 5Tk"],
    max: [2000, "maximum price of the product  should be 2000Tk"],
  },
  email:{
    type:String,
    unique:true

  },
  rating: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

/** -------------Model------------------ */
const Product = mongoose.model("products",productSchema)

/** -------------Home Route------------------ */
app.get("/",(req, res)=>{
    res.send(`<h1>Home route</h1>`);
})


/** -------------
 * create  Products data(post method)
 * ------------------ */
app.post("/product", async (req, res)=>{
    try {
        const {productName, price, email,rating} = req.body;
        const newProduct = new Product({
            productName,
            price,
            email,
            rating
        });
        const saveProduct = await newProduct.save();
        if (saveProduct) {
          res.status(201).send({
            success: true,
            message: `Create products`,
            data: saveProduct,
          });
        } else {
          res.status(404).send({
            success: false,
            message: `404 Not create products`,
          });
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
});

/** -------------get Products data(get method)------------------ */
app.get("/product", async (req, res)=>{
    try {

        const products = await Product.find();
        if (products) {
          res.status(200).send({
            success: true,
            message: `Create products`,
            data: products,
          });
        } else {
          res.status(404).send({
            success: false,
            message: `404 Not create products`,
          });
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
});

/** -------------get specific Products data(get method)------------------ */
app.get("/product/:id", async (req, res)=>{
    try {
        const id = req.params.id
        const product = await Product.find({_id:id});
        if (product) {
          res.status(200).send({
            success: true,
            message: `Create products`,
            data: product,
          });
        } else {
          res.status(404).send({
            success: false,
            message: `404 Not create products`,
          });
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
});

/** -------------update specific Products data(put method)------------------ */
app.put("/product/:id", async (req, res)=>{
    try {
        const {productName, price, rating} = req.body;
        const id = req.params.id
        const product = await Product.findByIdAndUpdate(
            {_id:id},
            {
                $set:{
                    productName,
                    price,
                    rating
                }
            },
            {
                new:true
            }
            );
        if (product) {
          res.status(200).send({
            success: true,
            message: `Create products`,
            data: product,
          });
        } else {
          res.status(404).send({
            success: false,
            message: `404 Not create products`,
          });
        }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
});

/** ------------- exports ------------------ */
module.exports = {
    app,
    connectDB
}