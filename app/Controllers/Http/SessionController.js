'use strict'
const crypto = require('crypto')
const DB = use('Database')
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
    try {
      const userActivated = await User.findBy('active', true)
      if (userActivated) {
        if (await auth.attempt(email, password)) {
          const user = await User.findBy('email', email)
          const token = await auth.generate(user)
          return response.json({
            user: user,
            token: token
          })
        }
      } else {
        return response.status(404).json({
          message: 'Erro! Seu cadastro está inativo, favor, verificar email de confirmação!'
        })
      }
    } catch (e) {
      console.log(e)
      return response.json({ message: 'Email não cadastrado!' })
    }
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
