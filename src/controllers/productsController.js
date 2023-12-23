const { log } = require('console');
const fs = require('fs');
const { get } = require('http');
const path = require('path');
const { uuid } = require('uuidv4');


const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');

const getJson = () =>{
	const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	return products
}


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		const {id} = req.params;
		const products = getJson()
        const product = products.find(producto => producto.id == +id);
		res.render('products', {products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const {id} = req.params;
		const products = getJson()
        const product = products.find(producto => producto.id == +id);
        res.render('detail', { title: product.name, product, toThousand });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) =>{
		const file = req.file;
		const products = getJson()
		const {name,price,discount,category,description,image} = req.body
		const id = products[products.length -1].id +1 ;
		const newObjet = {
			id: +id,
			name,
			price: +price,
			discount: +discount,
			category,
			description,
			image: file ? file.filename : "default.webp",
		}
		products.push(newObjet)
		const json = JSON.stringify(products);
		fs.writeFileSync((productsFilePath),json, "utf-8")
		res.redirect("/products")
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;
		const products = getJson()
        const product = products.find(producto => producto.id == +id);
        res.render('product-edit-form', {product, toThousand });
	},
	// Update - Method to update
	update: (req, res) => {
		const images = []
      if(req.files){
        files.forEach(element => {
          images.push(element.filename)
        });
      }
		const {id} = req.params;
		const {name,price,discount,category,description,image} = req.body;
		const products = getJson()
		const nuevoArray = products.map(product =>{
			if(product.id == id){
				return{
					id: +id,
					name:name.trim(),
					price: +price,
					discount: +discount,
					category,
					description: description.trim(),
					image: images.length > 0  ? images : product.image
				}
			}
			return product	
		})
		const json = JSON.stringify(nuevoArray);
		fs.writeFileSync(productsFilePath,json, "utf-8")
		res.redirect(`/products/detail/${id}`)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const {id} = req.params;
        const products = getJson("products");
		const product = products.find(producto => producto.id == id)
		const newArray = products.filter(product => product.id != id);
		const json = JSON.stringify(newArray);
		
		fs.unlink(`./public/images/products/${product.image}`, (err)=>{
			if(err) throw err;
			console.log(`borre el archivo ${product.image}`)
		})
		fs.writeFileSync((productsFilePath),json, "utf-8")
		res.redirect("/products")
	}
};

module.exports = controller;