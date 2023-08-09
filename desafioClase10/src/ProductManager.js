import fs from 'fs'
import { __dirname } from './utils.js'

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

  async addProduct(obj) {
    try {
        const { code } = obj;
        const productPrev = await this.getProducts();
        console.log(code);
        if(productPrev.find(prod => prod.code === code)){
            return {operation: false, message: 'No se puede agregar el producto, el código que ingresó ya existe'};
        }
        let id = !productPrev.length ? 1 : productPrev[productPrev.length-1].id + 1;
        productPrev.push({...obj, id});
        await fs.promises.writeFile(this.path, JSON.stringify(productPrev));
        return {operation: true, newProduct:{...obj, id}};
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
        const productPrev = await this.getProducts();
        if(!productPrev.find(prod => prod.id === id)){
            return {operation:false, message: 'El id proporcionado no existe'}
        }
        const newArrProducts = productPrev.filter(p => p.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArrProducts));
        const modData = await this.getProducts();
        return {operation:true, modData};
    } catch (error) {
        return error;
    }
}


}


const ProductsManager = new ProductManager(__dirname + 'Productos.json')
export default ProductsManager