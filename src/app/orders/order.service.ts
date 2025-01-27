/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';

import BikeService from '../bike/bike.service';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const stripe = new Stripe(
  'sk_test_51O9qBfLMULfZjXPmsgXEVtLXf0iEktwIwAKmIScIh3mKLAlfBd0dEUDxZ6gKQ1qwsUwIZdXJXGlNOTJafuvW7XJ200Z7T5QOsm',
  {
    apiVersion: '2024-12-18.acacia',
  },
);

class OrderService {
  /**
   * Create a new order
   * @param userId - ID of the user placing the order
   * @param items - Array of order items
   * @returns - Created order document or error message
   */
  async createOrder(
    userId: string,
    items: { productId: string; quantity: number }[],
  ) {
    try {
      if (!items || items.length === 0) {
        return {
          message: 'Order must contain at least one item.',
          success: false,
        };
      }

      const updatedItems = [];
      let totalPrice = 0;

      for (const item of items) {
        // Get the product details
        const bike = await BikeService.getSpecificBike(item.productId);

        if (!bike) {
          return {
            message: `Product with ID ${item.productId} not found`,
            success: false,
          };
        }

        // Check stock availability
        if (!bike.inStock) {
          return {
            message: `Product with ID ${item.productId} is out of stock`,
            success: false,
          };
        }

        if (bike.quantity < item.quantity) {
          return {
            message: `Quantity for product ID ${item.productId} not available`,
            success: false,
          };
        }

        // Calculate total price and update stock
        totalPrice += bike.price * item.quantity;
        bike.quantity -= item.quantity;
        await bike.save();

        updatedItems.push(item);
      }

      // Create the Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100), // Stripe expects the amount in cents
        currency: 'usd',
        payment_method_types: ['card'], // Only card for test mode
      });
      console.log(userId);
      // Create the order
      const orderData = {
        user: userId,
        items: updatedItems,
        status: 'Pending',
        totalPrice,
      } as unknown as IOrder;

      const order = await Order.create(orderData);

      return {
        message: 'Order created successfully',
        success: true,
        data: {
          order,
          clientSecret: paymentIntent.client_secret, // Return the client secret for client-side payment confirmation
        },
        totalPrice,
      };
    } catch (e: any) {
      return {
        message: e.message || 'An error occurred while creating the order',
        success: false,
      };
    }
  }
}

export default new OrderService();
