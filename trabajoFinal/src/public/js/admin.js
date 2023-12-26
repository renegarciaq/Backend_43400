
const allProducts = document.getElementById('allProducts')
const productsStock = document.getElementById('productsStock')
const productsInFront = document.getElementById('productsInFront')
const formUpdate = document.getElementById('formUpdate')
let products;

allProducts.addEventListener('click', () => {
    products = ''
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            data.payload.forEach(prod => {
                // console.log(prod)
                products += `<div class='container'>
                                <h3 class='my-3'>
                                    name:${prod.title} - owner:${prod.owner}
                                </h3> 
                                <a class='mx-2 btn btn-danger delete-product' id=${prod._id}>
                                    Delete
                                </a>
                            </div>`
            })
            productsInFront.innerHTML = products;
            let deleteButtons = document.querySelectorAll('.delete-product');

            // Paso 3: Agregar el evento a cada botón
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault(); // Previene la acción por defecto del enlace

                    fetch(`/api/products/${e.target.id}`, {
                        method: 'DELETE',
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.status === 'success') {
                                e.target.parentElement.remove();  // Eliminar el producto del frontend
                                Swal.fire({
                                    title: `The product was deleted`,
                                    icon: 'success',
                                })
                            } else {
                                console.error('Error al eliminar el producto');
                            }
                        })
                        .catch(error => {
                            console.error('Error al llamar al API:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener productos:', error);
        });
})





document.querySelectorAll('.update-product').forEach(button => {
    button.addEventListener('click', (event) => {
        let productID = event.target.id;
        let title = document.getElementById(`card-title-${productID}`).textContent;
        let price = document.getElementById(`card-price-${productID}`).textContent;
        let stock = document.getElementById(`card-stock-${productID}`).textContent;

        document.getElementById('modal-title').value = title;
        document.getElementById('modal-price').value = price;
        document.getElementById('modal-stock').value = stock;

        new bootstrap.Modal(document.getElementById('yourModalID')).show();
    });
});

let updatedProduct = {
    title: title,
    price: price,
    stock: stock
};

const productsFromDB = () => {

    products = '';
    fetch('/api/products?filterStock=20')
        .then(response => response.json())
        .then(data => {
            data.payload.forEach(product => {
                products += `
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title text-danger" id="card-title-${product._id}">${product.title}</h5>
                        <label for="card-price-${product._id}" class="form-label">Price:</label>
                        <span>$</span><p class="card-text text-danger" id="card-price-${product._id}">${product.price}</p>
                        <label for="card-stock-${product._id}" class="form-label">Stock: </label>
                        <p class="card-text text-danger" id="card-stock-${product._id}">${product.stock}</p>
                        <button class="btn btn-warning update-product" id=${product._id}>Update</button>
                    </div>
                </div>`;
            });

            productsInFront.innerHTML = products;


            document.querySelectorAll('.update-product').forEach(button => {
                button.addEventListener('click', (event) => {

                    let productID = event.target.id;

                    let title = document.getElementById(`card-title-${productID}`).textContent;
                    let price = document.getElementById(`card-price-${productID}`).textContent;
                    let stock = document.getElementById(`card-stock-${productID}`).textContent;

                    document.getElementById('modal-title').value = title;
                    document.getElementById('modal-price').value = price;
                    document.getElementById('modal-stock').value = stock;
                    document.getElementById('modal-id').value = productID;

                    new bootstrap.Modal(document.getElementById('yourModalID')).show();
                });

            });

        })
        .catch(error => { throw new Error(error) });
}

productsStock.addEventListener('click', () => {

    productsFromDB();
});


document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();

    let formData = new FormData(event.target);
    let productData = Object.fromEntries(formData);
    productData['thumbnails'] = [productData['thumbnails']]
    productData['price'] = Number(productData['price'])
    productData['status'] = productData['status'] === 'on' ? true : false;
    productData['stock'] = Number(productData['stock'])


    fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: `The product ${formData['title']} has already been added`,
                    icon: 'success',
                })
            } else {
                Swal.fire({
                    title: "Can't not add product",
                    icon: 'error',
                });
            }
        })

        .catch(error => { throw new Error(error) });
    const modalElement = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    event.target.reset()

});

formUpdate.addEventListener('submit', async event => {
    try {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        const { id, ...rest } = data
        const response = await fetch(`/api/products/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rest)
            }
        );
        if (response.ok) {
            const modalElement = document.getElementById('yourModalID');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            Swal.fire({
                title: 'Product updated successfully',
                text: `ID: ${id} - Quantity: ${rest.stock}`,
                icon: 'success',
            })
            productsFromDB();
        }

    } catch { (error => { throw new Error(error) }) };


});
