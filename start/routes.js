'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.resource('users', 'UserController')

Route.post('login', 'SessionController.store')

Route.resource('locale', 'LocaleController')

Route.resource('quest', 'QuestController')

Route.resource('ask', 'AskController')
