import { orderItems, orders, products, restaurants, users } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia, { t } from 'elysia'
import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'

export const registerRestaurant = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning()

    const [restaurant] = await db
      .insert(restaurants)
      .values({
        name: restaurantName,
        managerId: manager.id,
      })
      .returning()

    const [customer1, customer2] = await db
      .insert(users)
      .values([
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          role: 'customer',
        },
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          role: 'customer',
        },
      ])
      .returning()

    const availableProducts = await db
      .insert(products)
      .values([
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
        {
          name: faker.commerce.productName(),
          priceInCents: Number(
            faker.commerce.price({
              min: 190,
              max: 490,
              dec: 0,
            }),
          ),
          restaurantId: restaurant.id,
          description: faker.commerce.productDescription(),
        },
      ])
      .returning()

    const ordersToInsert: (typeof orders.$inferInsert)[] = []
    const orderItemsToPush: (typeof orderItems.$inferInsert)[] = []

    for (let i = 0; i < 200; i++) {
      const orderId = createId()

      const orderProducts = faker.helpers.arrayElements(availableProducts, {
        min: 1,
        max: 3,
      })

      let totalInCents = 0

      orderProducts.forEach((orderProduct) => {
        const quantity = faker.number.int({
          min: 1,
          max: 3,
        })

        totalInCents += orderProduct.priceInCents * quantity

        orderItemsToPush.push({
          orderId,
          productId: orderProduct.id,
          priceInCents: orderProduct.priceInCents,
          quantity,
        })
      })

      ordersToInsert.push({
        id: orderId,
        customerId: faker.helpers.arrayElement([customer1.id, customer2.id]),
        restaurantId: restaurant.id,
        status: faker.helpers.arrayElement([
          'pending',
          'canceled',
          'processing',
          'delivering',
          'delivered',
        ]),
        totalInCents,
        createdAt: faker.date.recent({
          days: 40,
        }),
      })
    }

    await db.insert(orders).values(ordersToInsert)
    await db.insert(orderItems).values(orderItemsToPush)

    set.status = 204
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: 'email' }),
    }),
  },
)
