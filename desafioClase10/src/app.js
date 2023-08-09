import express from 'express'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductsManager from './ProductManager.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))

//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


//rutas
app.use('/', viewsRouter)


const PORT = 8080

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT}`)
  })

const socketServer = new Server(httpServer)

socketServer.on('connection', socket => {
  console.log(`Cliente conectado: ${socket.id}`); 

  socket.on('agregar', async (obj) => {
      const opAdd = await ProductsManager.addProduct(obj);
      if(opAdd){
          socketServer.emit('added', opAdd.newProduct);
      } else{
          socket.emit('added', opAdd.message);
      }
  });

  socket.on('eliminar', async (id) => {
      const opDel = await ProductsManager.deleteProduct(id);
      if(opDel){
          socketServer.emit("deleted", opDel.modData);
      } else{
          socket.emit("deleted", opDel.message);
      }
  });
});