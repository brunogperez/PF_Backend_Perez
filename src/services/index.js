import { Carts, Products, Users, Messages, Tickets } from '../dao/factory.js'

import CartsRepository from './carts.repository.js'
import ProductsRepository from './products.repository.js'
import UsersRepository from './users.repository.js'
import MessagesRepository from './messages.repository.js'
import TicketsRepository from './tickets.repository.js'

export const cartsService = new CartsRepository(new Carts())
export const productsService = new ProductsRepository(new Products())
export const usersService = new UsersRepository(new Users())
export const messagesService = new MessagesRepository(new Messages())
export const ticketsService = new TicketsRepository(new Tickets())