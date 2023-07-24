import express from 'express'
import productsManager from './ProductManager.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req,res)=>{
    try {
        const products = await productsManager.getProducts()
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const response = limit ? products.slice(0, limit) : products;
        res.status(200).json({ message: 'Products', response })
    } catch (error) {
        res.status(500).json({ error })
    }
})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    try {
      const product = await productsManager.getProductById(+pid)
      res.status(200).json({ message: 'Product', product })
    } catch (error) {
      res.status(500).json({ error })
    }
  })

app.listen(8080, () => {
    console.log('Escuchando al puerto 8080')
  })