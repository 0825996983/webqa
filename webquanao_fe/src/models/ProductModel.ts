class ProductModel {
    id: number;
    productName?: string;
    price?: number;
    listPrice?: number;
    description?: string;
    quantity?: number;
    size?: string;
    color?: string;
    imageData?: string; // Thêm thuộc tính imageData

    constructor(
        id: number,
        productName?: string,
        price?: number,
        listPrice?: number,
        description?: string,
        quantity?: number,
        size?: string,
        color?: string,
        imageData?: string // Thêm imageData vào constructor
    ) {
        this.id = id;
        this.productName = productName;
        this.price = price;
        this.listPrice = listPrice;
        this.description = description;
        this.quantity = quantity;
        this.size = size;
        this.color = color;
        this.imageData = imageData; // Gán imageData vào thuộc tính
    }
}
export default ProductModel;
