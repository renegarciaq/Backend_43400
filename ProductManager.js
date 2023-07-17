const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const infoArchivo = await fs.promises.readFile(this.path, 'utf-8')
                return JSON.parse(infoArchivo)
            } else {
                return []
            }
        } catch (error) {
            return error
        }
    }

    async addProduct(obj) {
        try {
            const productPrev = await this.getProducts()
            let id
            if (!productPrev.length) {
                id = 1
            } else {
                id = productPrev[productPrev.length - 1].id + 1
            }
            productPrev.push({ ...obj, id })
            await fs.promises.writeFile(this.path, JSON.stringify(productPrev))
        } catch (error) {
            return error
        }
    }

    async getProductById(id) {
        try {
            const productPrev = await this.getProducts()
            const product = productPrev.find((p) => p.id === id)
            if (!product) {
                return 'Producto con id no encontrado'
            }
            return product
        } catch (error) {
            return error
        }
    }

    async updateProduct(id, obj) {
        try {
            const productPrev = await this.getProducts()
            const productIndex = productPrev.findIndex((p) => p.id === id)
            if (productIndex === -1) {
                return 'No existe un producto con ese id'
            }
            const product = productPrev[productIndex]
            productPrev[productIndex] = { ...product, ...obj }
            await fs.promises.writeFile(this.path, JSON.stringify(productPrev))
        } catch (error) {
            return error
        }
    }

    async deleteProduct(id) {
        try {
            const productPrev = await this.getProducts()
            const nuevoArregloProductos = productPrev.filter((p) => p.id !== id)
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(nuevoArregloProductos)
            )
        } catch (error) {
            return error
        }
    }
}

const producto1 = {
    title: 'iPhone',
    description: 'iphone 14 pro',
    price: 800,
    thumnbnail: 'url',
    code: 1,
    stock: 20
}

const producto2 = {
    title: 'PC',
    description: 'Hp Victus 16',
    price: 1200,
    thumnbnail: 'url',
    code: 2,
    stock: 10
}

const producto3 = {
    title: 'ipad',
    description: 'ipad pro',
    price: 1000,
    thumnbnail: 'url',
    code: 3,
    stock: 15
}

const producto4 = {
    title: 'TV',
    description: 'LG Led tv 50',
    price: 500,
    thumnbnail: 'url',
    code: 4,
    stock: 5
}

obj = {
    price: 900,
    stock: 5
}

async function prueba (){
    const manager = new ProductManager('Productos.json')
    // await manager.addProduct(producto4)
    // const productos = await manager.getProducts()
    // const producto = await manager.getProductById(1)
    // await manager.deleteProduct(4)
    // await manager.updateProduct(1,obj)
    // console.log(producto)
}

prueba ()
