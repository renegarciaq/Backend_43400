import { Router } from 'express'
import ProductsManager from '../ProductManager.js'

const router = Router()

router.get("/", async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.render('realTimeProducts', { products })
});


export default router