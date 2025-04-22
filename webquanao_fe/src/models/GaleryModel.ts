class GaleryModel{
    id: number;
    imageName?: string;
    mainImage?: boolean;
    link?: string;
    imageData?: string;


    constructor(
        id: number,
        imageName?: string,
        mainImage?: boolean,
        link?: string,
        imageData?: string,
    ){
        this.id=id
        this.imageName=imageName
        this.mainImage=mainImage
        this.link=link
        this.imageData=imageData


    }

}
export default GaleryModel