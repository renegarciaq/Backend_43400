import { Router } from "express"
import productsManager from "../ProductManager.js"

const router = Router()


router.get('/', async (req, res) => {
  try {
    const products = await productsManager.getProducts()
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const response = limit ? products.slice(0, limit) : products;
    res.status(200).json({ message: 'Products', response })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const product = await productsManager.getProductById(+pid)
    res.status(200).json({ message: 'Product', product })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.post('/', async (req, res) => {
  // console.log(req.body);
  try {
    const newProduct = await productsManager.createProduct(req.body)
    console.log(newProduct)
    res.status(200).json({ message: 'Product created', product: newProduct })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const response = await productsManager.deleteProduct(+pid)
    res.status(200).json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const productUpdated = await productsManager.updateProduct(+pid, req.body)
    res.statis(200).json({ message: 'Product updated' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default router