import React, { FormEvent, useState } from "react";

const ProductForm: React.FC<{}> = () => {
  const [product, setProduct] = useState({
    id: 0,
    productName: "",
    price: 0,
    listPrice: 0,
    description: "",
    quantity: 0,
  
  });

  const handleSubmit = (event: FormEvent) => {
     event.preventDefault();
     const token = localStorage.getItem('token');
     fetch('http://localhost:8080/product',
        {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${token} `
            },
            body: JSON.stringify(product)
        }
     ).then((reponse)=>{
        if(reponse.ok){
            alert("Đã thêm sản phẩm thành công");
            setProduct({
                id: 0,
                productName: "",
                price: 0,
                listPrice: 0,
                description: "",
                quantity: 0,
            })
        }else{
            alert("gặp lỗi trong quá trình thêm sản phẩm.")

        }
     })
  };

  return (

    <div className="container m-36 pt-10 row d-flex align-center justify-content-center ">
        <div className="">
            <h1>ADD PRODUCT</h1>
      <form action="" onSubmit={handleSubmit}>
        <input type="hidden" id="id" value={product.id} />

        <label htmlFor="productName">Tên Sản Phẩm</label>
        <input
          className="form-control"
          type="text"
          value={product.productName}
          onChange={(e) =>
            setProduct({ ...product, productName: e.target.value })
          }
          required
        />

        <label htmlFor="productName">Price</label>
        <input
          className="form-control"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseFloat( e.target.value) })}
          required
        />


        <label htmlFor="productName">List Price</label>
        <input
          className="form-control"
          type="number"
          value={product.listPrice}
          onChange={(e) => setProduct({ ...product, listPrice: parseFloat( e.target.value ) })}
          required
        />


        <label htmlFor="productName">description</label>
        <input
          className="form-control"
          type="text"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          required
        />


        <label htmlFor="productName"> Quantity </label>
        <input
          className="form-control"
          type="number"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value  ) })}
          required
        />

        <button type="submit" className="btn btn-success mt-3"> Luu</button>


      </form>
      </div>
    </div>
  );
};
export default ProductForm;
