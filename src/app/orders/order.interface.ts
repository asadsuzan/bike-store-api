// import core modules 
import { ObjectId } from "mongoose"

/*
{
  "email": "customer@example.com",
  "product": "648a45e5f0123c45678d9012",
  "quantity": 2,
  "totalPrice": 2400
}
*/

interface IOrder {
    email: string;
    product: ObjectId;
    quantity: number;
    totalPrice: number;
}


export default IOrder