export default function GetImage(image, SvgCollection){
    var img=''
    if(image && SvgCollection.some(r => r == image.toUpperCase()) && SvgCollection.length){
        img = image.toUpperCase();
    }else if(SvgCollection.length){
        img = "IT";
    }
    return img;
}