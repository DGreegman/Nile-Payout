import Order, { IOrder, OrderStatus } from '../models/Order';
import { Schema } from 'mongoose';

export class OrderService {
  async createOrder(data: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(data);
    return order.save();
  }

  async getCompletedOrdersByVendor(vendorId: string): Promise<IOrder[]> {
    return Order.find({ vendor: vendorId, status: OrderStatus.Completed });
  }
}