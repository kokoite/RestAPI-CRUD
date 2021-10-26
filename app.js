const express =  require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
// mongo connection
mongoose.connect("mongodb://127.0.0.1:27017/Products").then(()=>{
    console.log("Mongoose connection success");
}).catch((err)=>{
    console.log(err);
})
const product = new mongoose.Schema({
    name:String,
    description:String,
    price:Number
})
const Product = new mongoose.model("Product",product);

// read all product
app.get("/api/v1/products",async(req,res) =>{
    const prod = await Product.find();
    res.status(200).json({
        success:true,
        prod
    })
})
// create all product
app.post("/api/v1/product/new",async (req,res) =>{
    const prod = await Product.create(req.body);
    res.status(201).json({
        success:true,
        prod
    })
})
// updating product
app.put("/api/v1/product/:id",async (req,res) =>{
//   let prod = await Product.findById(req.params.id);
  let prod = await Product.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      useFindAndModify:false,
      runValidators:true
  });
  res.status(200).json({
      success:true,
      prod
  })  
})
// deleting product
app.delete("/api/v1/product/:id",async(req,res)=>{
    const prod = await Product.findById(req.params.id);
    if(!prod)
    {
           return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    else
    {
        prod.remove();
        res.status(200).json({
        success:true,
        message:"Product deleted successfully",
    })}
})
// server starting
app.listen(PORT,()=>{
    console.log(`Server connection success on http://localhost:${PORT}`);
})