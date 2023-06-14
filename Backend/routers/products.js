const express = require('express');

const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        // above, gets the mimeType and checks if it is included in above array
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    // above, saves to file, destination '/public/uploads', and if it a valid type, null as the error, or if not throws the uploadError defined above
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      // above, removes the spaces and then joins them with -, could also be done with .replace (' ', '-') 
      const extension = FILE_TYPE_MAP[file.mimetype];
      // above, will take the mimetype, e.g. 'image/png' and assign it as an extension, e.g. 'png'
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  // above saves the file as filename const, then Date.now to make it unique, then it's extension

  const uploadOptions = multer({ storage: storage })

// http://localhost:3000/api/vi/products
router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }
    // filter starts off as empty, BUT if there is a categories query in the URL, will save it as the filter variable (separates them by any , in the query), then filter the results accordingly

    const productList = await Product.find(filter).select('_id name image category -_id').populate('category');
    // above, finds all products but ONLY selects the name and image properties, de-selects the ID, and shows the category details ...
    // if filter if empty, i.e. no categories in the query, then just returns ALL products

    // e.g's- if get request made to http://localhost:3000/api/vi/products?categories=648857af0a866e1eb0532091, will only show that category
    // - showing multiple categories, separated by comma, e.g. http://localhost:3000/api/vi/products?categories=648857af0a866e1eb0532091,648857d50a866e1eb0532094

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
})  

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    // populate populates the fields from cross referencing, i.e. here the category

    if(!product){
        res.status(500).json({success: false})
    }
    res.send(product);
})  
 
router.post(`/`, async (req, res) => {

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
 
    product = await product.save();
    // creates new product and awaits the save

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid category');
    // finds the category in 'Category' (imported at top) and compares to the req.body. if not found, flags an error

    if(!product) {
        return res.status(500).send('The product cannot be created')
    }
    return res.send(product);

}) 


router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    // above, if the id in the params is not valid, returns error (need return in order to stop app looping and crashing)
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true} // returns the new object, as opposed to the old one
    )

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid category');
    // finds the category in 'Category' (imported at top) and compares to the req.body. if not found, flags an error
    
    if(!product) {
        return res.status(500).send('Product cannot be updated!')
       } 
    
       res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success: true, message: 'the Product has been deleted'})
        } else {
            return res.status(404).json({success: false, message: 'product not found'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();
    // above counts products, and returns an integer value

    if(!productCount){
        res.status(500).json({success: false})
    }
    res.send({
        productCount: productCount
    });
})  

router.get(`/get/featured`, async (req, res) => {
    const featuredProducts = await Product.find({isFeatured: true});
    // finds, by the object, e.g. only includes is isFeatured = true

    if(!featuredProducts){
        res.status(500).json({success: false})
    }
    res.send(featuredProducts);
})  

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const featuredProducts = await Product.find({isFeatured: true}).limit(+count);
    // count is got from the params, and if it doesn't exist, sets it to 0 (i.e. showing 0 featured products) 
    // +count converts it to a number as limit doesn't accept a string value

    if(!featuredProducts){
        res.status(500).json({success: false})
    }
    res.send(featuredProducts);
})  

router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
    // above path allows you to put a list of images and update the product to have them included
)
module.exports = router;