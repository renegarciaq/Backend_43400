const socketClient = io()

const formProd = document.getElementById("formProduct")
const tableProds = document.getElementById("bodyProd")
const formDelete = document.getElementById("deleteProduct")
const id = document.getElementById("id");
const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const code = document.getElementById('code')
const stock = document.getElementById('stock')
const category = document.getElementById('category')

formProd.onsubmit = (e) => {
    e.preventDefault();
    const obj = {
        title: title.value,
        description: description.value,
        price: Number(price.value),
        code: code.value,
        stock: Number(stock.value),
        category: category.value,
    }
    socketClient.emit("agregar", obj);
    title.value = ''
    description.value = ''
    price.value = ''
    code.value = ''
    stock.value = ''
    category.value = ''
}

formDelete.onsubmit = (e) => {
    e.preventDefault()
    socketClient.emit('eliminar', Number(id.value))
    id.value = ''
}

socketClient.on("added", (newProduct) => {
    if (typeof newProduct === "object") {
        const addRow = `
        <tr>
            <td>${newProduct.id}</td>
            <td>${newProduct.title}</td>
            <td>${newProduct.description}</td>
            <td>${newProduct.price}</td>
            <td>${newProduct.stock}</td>
            <td>${newProduct.code}</td>
        </tr>`;
        tableProds.innerHTML += addRow;
    } else {
        Toastify({
            text: newProduct,
            duration: 3000,
            gravity: "top",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            },
        }).showToast()
    }
})

socketClient.on('deleted', (arrProducts) => {
    if (typeof arrProducts === "object") {
        const addRow = arrProducts.map((obj) => {
            return `
              <tr>
                  <td>${obj.id}</td>
                  <td>${obj.title}</td>
                  <td>${obj.description}</td>
                  <td>${obj.price}</td>
                  <td>${obj.stock}</td>
                  <td>${obj.code}</td>
              </tr>`
        }).join(' ')
        tableProds.innerHTML = addRow;
    } else {
        Toastify({
            text: arrProducts,
            duration: 3000,
            gravity: "top",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)"
            },
        }).showToast()
    }
})