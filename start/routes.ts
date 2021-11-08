/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'Equilibrium test API' }
})

Route.post('login', 'AuthController.login')
Route.post('logout', 'AuthController.logout')
Route.resource('users', 'UsersController').apiOnly()

//Routas protegidas
Route.group(() => {
  // Route.resource('users', 'UsersController').apiOnly()
  Route.post('users/activate/:id', 'UsersController.activate')

  Route.resource('cases', 'CasesController').apiOnly()
  Route.post('cases/search/', 'CasesController.search')

  Route.resource('contacts', 'ContactsController').apiOnly()
  Route.post('contacts/blockeds/', 'ContactsController.blockeds')
}).middleware('auth:api')
