import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { registerRestaurant } from './routes/register-restaurant'
import { registerCustomer } from './routes/register-customer'
import { sendAuthenticationLink } from './routes/send-authentication-link'
import { createOrder } from './routes/create-order'
import { approveOrder } from './routes/approve-order'
import { cancelOrder } from './routes/cancel-order'
import { getOrders } from './routes/get-orders'
import { createEvaluation } from './routes/create-evaluation'
import { getEvaluations } from './routes/get-evaluations'
import { updateMenu } from './routes/update-menu'
import { updateProfile } from './routes/update-profile'
import { authentication } from './authentication'
import { getProfile } from './routes/get-profile'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { signOut } from './routes/sign-out'
import { getOrderDetails } from './routes/get-order-details'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'
import { getDailyReceiptInPeriod } from './routes/get-daily-receipt-in-period'
import { getPopularProducts } from './routes/get-popular-products'
import { dispatchOrder } from './routes/dispatch-order'
import { deliverOrder } from './routes/deliver-order'

const corsMiddleware = (app: Elysia) => {
  return app.onRequest(({ request, set }) => {
    const allowedOrigins = ['https://pizzashop.projects.viniciosbarbosa.com']
    const requestOrigin = request.headers.get('Origin')

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      set.headers['Access-Control-Allow-Origin'] = requestOrigin
      set.headers['Access-Control-Allow-Methods'] =
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      set.headers['Access-Control-Allow-Headers'] =
        'Content-Type, Authorization'
      set.headers['Access-Control-Allow-Credentials'] = 'true'
    }

    // Se for uma requisição OPTIONS (preflight), retorna status 204 sem conteúdo
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 })
    }
  })
}

const app = new Elysia()
  .use(corsMiddleware)
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(registerCustomer)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateMenu)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status

        return error.toResponse()
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 })
      }
      default: {
        console.error(error)

        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(process.env.PORT ?? 3000)

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
)
