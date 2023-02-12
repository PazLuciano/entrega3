const { log } = require("console");
const fs = require("fs/promises");
const path = require("path");

// ----

const express = require("express");
const { request } = require("https");
const { send } = require("process");
const PORT = 8080;
const app = express()


class ProductManager{
    constructor(path){       
        this.path = path;
    }

    addProduct = async (product) => {
        let info = await fs.readFile(this.path)
        let data = await JSON.parse(info)
        
        if (data.Productos == undefined){
            console.log("EStamos por undefined");
            const data = {Productos : []}
            fs.writeFile(this.path, JSON.stringify(data))
        }


        
        // console.log(data.Productos);
        if(product.hasOwnProperty("title") && product.hasOwnProperty("description") && product.hasOwnProperty("price")
        && product.hasOwnProperty("thumbnail") && product.hasOwnProperty("code") && product.hasOwnProperty("stock")){

            const {title, description, price, thumbnail, code, stock} = product;   

            this.title = title;
            this.description = description;
            this.price = price;
            this.thumbnail = thumbnail;
            this.code = code;
            this.stock = stock;

            if (data.Products != undefined){                
                if(data.length == 0){ 
                    // console.log("Por aca entra?");
                    this.id = 1;
                    const productoAgregar = {
                        id: this.id,
                        title : this.title,
                        description : this.description,
                        price : this.price,
                        thumbnail : this.thumbnail,
                        code : this.code,
                        stock : this.stock
                    } ;
                    // Agregar producto al json sacar
                    data.push(productoAgregar);
                    await fs.writeFile(this.path, JSON.stringify(data));
                    return "Elemento añadido correctamente1!"
                }else{        
                         
                    const encontrar = data.Productos.some(objeto => objeto.code == product.code);
                    
                    if(encontrar){
                        // console.log("producto agregado anteriormente!");
                        return "producto agregado anteriormente!"
                    }else{      
                            let valorId = data.Productos.length + 1;                         
                            const productoAgregar = {
                                id : valorId,
                                title : this.title,
                                description : this.description,
                                price : this.price,
                                thumbnail : this.thumbnail,
                                code : this.code,
                                stock : this.stock
                            };
                            data.Productos.push(productoAgregar);                        
                            fs.writeFile(this.path, JSON.stringify(data)) // Agregar al json                  
                            // console.log("Elemento añandido correctaenteLOG");
                            let retorno = "Elemento añadido correctamentea";
                            return retorno
                        }
                             
                }
            }else{
                console.log(data);
                this.id = 1;
                const productoAgregar = {
                    id: this.id,
                    title : this.title,
                    description : this.description,
                    price : this.price,
                    thumbnail : this.thumbnail,
                    code : this.code,
                    stock : this.stock
                };
                data.Productos = [productoAgregar];               
                await fs.writeFile(this.path, JSON.stringify(data));
                return "Elemento añadido correctamente1!"
            }
        }else{
            console.log("campos incorrectos");
            return "Campos incorrectos"
        }
    }      
    getProducts = async () =>{
        try {
            const info = await fs.readFile(this.path);
            // console.log(info);
            const data = await JSON.parse(info);
            // console.log(data);
            if(data.Productos){
                return data.Productos
            }else{
                // console.log("Ahora por aca!");
                const data = {Productos : []}
                fs.writeFile(this.path, JSON.stringify(data))
                const info = await fs.readFile(this.path);
                return info
            }


            
        } catch (error) {
            console.log(error);    
        }
    }
    getProductById = async (id) => {
        const info = await this.getProducts()
        let productoEncontrado;
        info.forEach(element => {
            if (element.id == id) {
                productoEncontrado = element;
            }
        })
        if(productoEncontrado){
            return productoEncontrado;
        }else{
            return "Producto no encontrado!"
        }
    }
    updateProduct = async (id, objetoActualizar) => {
        const info = await this.getProducts()
        const encontrar = info.some(objeto => objeto.id == id);
        if(encontrar){

            let indiceProducto = info.findIndex(obj => obj.id == id);
            
            info[indiceProducto].title = objetoActualizar.title || info[indiceProducto].title;
            info[indiceProducto].description = objetoActualizar.description || info[indiceProducto].description;
            info[indiceProducto].price = objetoActualizar.price || info[indiceProducto].price;
            info[indiceProducto].thumbnail = objetoActualizar.thumbnail || info[indiceProducto].thumbnail;
            info[indiceProducto].code = objetoActualizar.code || info[indiceProducto].code;
            info[indiceProducto].stock = objetoActualizar.stock || info[indiceProducto].stock;
            let productos = {Productos : info}
            // console.log(info[indiceProducto]);
            // console.log(info);
            fs.writeFile(this.path, JSON.stringify(productos));
            return "Producto actualizado correctamente!"
            
        }else{
            return "Producto no encontrado para actualizar!!"
        }
    }
    deleteProduct = async (id) => {
        
        const info = await fs.readFile(this.path);
        const data = await JSON.parse(info);
        const array = data.Productos;
        
        let indexProducto = array.findIndex(obj => obj.id == id);
        let idProducto = array[indexProducto].id;
        // console.log(idProducto);
        // console.log(indexProducto);
        if(indexProducto != -1){
            // console.log(array);
            array.splice(indexProducto,1);
            // console.log(array);
            let productos = {Productos : array}
            fs.writeFile(this.path, JSON.stringify(productos));
            // this.espaciosLibres.push(idProducto)
            return "Producto eliminado correctamente!"
            
            
        }else{
            return "Producto no encontrado!"
        }

    }
}

objetoPrueba = {
    title : "Prueba",
    description : "Estamos probando",
    price : 1000,
    thumbnail : "estoEsUnaImagen",
    code : 20,
    stock : 200
}
objetoPrueba2 = {
    title : "Prueba2",
    description : "Estamos probando2",
    price : 10002,
    thumbnail : "estoEsUnaImagen2",
    code : 202,
    stock : 2002
}
objetoPrueba3 = {
    title : "probando actualizar",
    description : "actulizando un objeto",
    price : 2000,
    thumbnail : "imagen actualizacion",
    code: 1233,
    stock : 20
}





// SERVIDOR
app.use(express.urlencoded({extended : true}))

app.listen(PORT, () => {
    console.log("API RUNNING ON PORT " + PORT);
})

app.get("/", (request, response) => {
    response.send("En una api por el puerto " + PORT)
} )


app.get("/products", async (req, response) => {
        const archivo = __dirname;
        let instancia = new ProductManager(archivo + "/db.json")
        let productos = await instancia.getProducts()
        console.log(productos);
        const { cantidad } = req.query;
        if (cantidad) {
            let productosSeleccionados = []
            let numero = 1;
            productos.forEach(element => {
                if (numero <= cantidad){
                    productosSeleccionados.push(element);
                    numero ++;
                }
            });
            return response.send(productosSeleccionados)
        }
        else{
            return response.send(productos)
        }
        
})

app.get("/productos/:pid", async(req, response) => {

    const archivo = __dirname;
    let instancia = new ProductManager(archivo + "/db.json")
    let productos = await instancia.getProducts()
   
    const pid = req.params.pid;
    
    const productoSeleccionado = productos.find(producto => producto.id == pid);
    if(productoSeleccionado){
        response.send(productoSeleccionado)
    }else{
        response.send("No se ha encontrado el producto")
    }

})