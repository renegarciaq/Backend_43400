import fs from 'fs'

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
}


const ProductsManager = new ProductManager('Productos.json')
export default ProductsManager