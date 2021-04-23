'use strict'
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with sessions
 */
class SessionController {
  /**
   * Create/save a new session.
   * POST sessions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login ({ request, response, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    const user = auth.user
    return {
      token: token,
      user: user
    } // your structured object
  }

  async forgot ({ request, response }) {
    try {
      const { email } = request.all()
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(60).toString('hex')
      user.token_created_at = new Date()
      await user.save()
      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('naoresponda@bembrasil.org.br', 'Bem Brasil | Multiaction')
            .subject('Recuperação de Senha')
        }

      )
    } catch (e) {
      return response.status(e.status).send({ error: { message: 'Email não encontrado na base de dados!' } })
    }
  }
}

module.exports = SessionController
