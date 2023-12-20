import { passportCall } from '../middleware/auth.js';
import BaseRouter from './Router.js';
import productsController from '../controllers/products.controller.js';


export default class ProductsRouter extends BaseRouter {
    //http://localhost:8080/api/products?limit=2
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), passportCall('jwt', { strategyType: 'github' }), productsController.getProducts)

        //http://localhost:8080/api/products/
        this.get('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProductId)

        //http://localhost:8080/api/products/
        this.post('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.postProduct)

        this.put('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.putProduct)

        this.delete('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.deleteProduct)
    }

}



// export default this