let Product = require('../models/product');
let mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/shooping"); 

let shoes = [
   
    new Product({
        imagePath : 'images/gmb1.jpeg',
        title : 'Vans Old Skool mid',
        description : 'awesome sneakers and exactly classic new 1',
        qty : 10,
        price : 1050
    }),
    new Product({
        imagePath : 'images/gmb2.jpeg',
        title : 'Vans Old Skool high',
        description : 'awesome sneakers and exactly classic new 2',
        qty : 16,
        price : 1650
    }),
    new Product({
        imagePath : 'images/gmb3.jpeg',
        title : 'Vans check mate',
        description : 'awesome sneakers and exactly classic new 3',
        qty : 10,
        price : 1250
    }),
    new Product({
        imagePath : 'images/gmb4.jpeg',
        title : 'Vans Old chekc mate',
        description : 'awesome sneakers and exactly classic new 4',
        qty : 10,
        price : 1350
    }),
    new Product({
        imagePath : 'images/gmb5.jpeg',
        title : 'Vans new era',
        description : 'vans x nike, yeah its cool',
        qty : 10,
        price : 2250
    })
]

let done = 0;
for (let i = 0;i < shoes.length; i++){
    shoes[i].save((err, result)=>{
        done++;
        if(done==shoes.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
