import { Router } from "express";
import { cartManager } from "../CartManager.js";
const router = Router()

router.get('/id', async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartManager.getOneCart(+id)
        res.status(200).json({ message: 'Cart' }, cart)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/', async (req, res) => {
    try {
        const createCart = await cartManager.createCart()
        res.status(200).json({ message: 'Cart', cart: createCart })
    } catch (error) {
        res.status(500).json({ error })

    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const addProduct = await cartManager.addProduct(+cid, +pid)
        res.status(200).json({message: 'Product-Cart', cart:addProduct})
    } catch (error) {
        res.status(500).json({ error })
    }
})

export default router