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
  return { Message: 'Equilibrium test API' }
})

Route.post('login', 'AuthController.login')

//Routas protegidas
Route.group(() => {
  Route.post('logged_user', 'AuthController.show')
  Route.post('logout', 'AuthController.logout')
  Route.resource('users', 'UsersController').apiOnly()

  Route.get('users/state/:id', 'UsersController.changeState')

  Route.resource('cases', 'CasesController').apiOnly()
  Route.post('cases/search/', 'CasesController.search')

  Route.resource('contacts', 'ContactsController').apiOnly()
  Route.post('contacts/blockeds/', 'ContactsController.blockeds')
}).middleware('auth:api')
