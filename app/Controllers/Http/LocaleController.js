'use strict'
const Locale = use('App/Models/Locale')
const City = use('App/Models/City')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with locales
 */
class LocaleController {
  /**
   * Show a list of all locales.
   * GET locales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, params }) {
    return Locale.all()
  }

  /**
   * Create/save a new locale.
   * POST locales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only([
      'name',
      'zipCode',
      'street',
      'city',
      'city_id',
      'state',
      'neighborn',
      'number'
    ])
    return Locale.create(data)
  }

  /**
   * Display a single locale.
   * GET locales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {

  }

  /**
   * Update locale details.
   * PUT or PATCH locales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a locale with id.
   * DELETE locales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const register = await Locale.findBy('id', params.id)
    if (!register) {
      return response.status(401).json({
        message: 'Erro! não encontrado!'
      })
    }
    await register.delete()
    return response.status(200).json({
      message: 'Removido com sucesso!'
    })
  }
}

module.exports = LocaleController
