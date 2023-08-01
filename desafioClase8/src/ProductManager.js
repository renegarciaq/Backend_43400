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

  async createProduct({title, description, price, thumbnail, code, stock, category, status = true}) {
    try {
      if(!title || !description || !price || !thumbnail || !code || !stock || !category){
        return 'Error: todos los datos son obligatorios'
      }
      const productPrev = await this.getProducts()
      const listCode = productPrev.find(e => e.code === code)
      if (listCode){
        return "El código ya se encuentra ingresado"
      }
      let obj = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        category: category,
        status: status
      }
      let id
      if (!productPrev.length) {
        id = 1
      } else {
        id = productPrev[productPrev.length - 1].id + 1
      }
      const newProduct = {...obj, id}
      productPrev.push(newProduct)
      await fs.promises.writeFile(this.path, JSON.stringify(productPrev))
      return `El producto con el ID ${id} fue generado correctamente`
    } catch (error) {
      return error
    }
  }

  async updateProduct(id, obj) {
    try {
      const productPrev = await this.getProducts()
      const productIndex = productPrev.findIndex((p) => p.id === id)
      if (productIndex === -1) {
        return 'No hay un producto con ese id'
      }
      const producto = productPrev[productIndex]
      productPrev[productIndex] = { ...producto, ...obj }
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


const ProductsManager = new ProductManager('Productos.json')
export default ProductsManager