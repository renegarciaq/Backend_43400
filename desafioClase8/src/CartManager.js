import fs from 'fs'

class CartManager {
    constructor(path) {
        this.path = path
    }

    async getAllCarts() {
        if (fs.existsSync(this.path)) {
            const carts = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(carts)
        } else {
            return []
        }
    }

    async getOneCart(id) {
        const carts = await this.getAllCarts()
        const cart = carts.find((c => c.id === id))
        return cart
    }

    async createCart() {
        const carts = await this.getAllCarts()
        let id
        if (!carts.length) {
            id = 1
        } else {
            id = carts[carts.length - 1].id + 1
        }
        const newCart = { products: [], id }
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return newCart
    }

    async addProduct(cid, pid) {
        const carts = await this.getAllCarts()
        const cart = carts.find(c=>c.id===cid)
        const productIndex = cart.products.findIndex(p => p.product === pid)
        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 })
        } else {
            cart.products[productIndex].quantity++
        } 
        await fs.promises.writeFile(this.path,JSON.stringify(carts))
        return cart 
    }
}

export const cartManager = new CartManager('Carts.json')