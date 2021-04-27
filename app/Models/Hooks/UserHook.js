'use strict'
const SendGrid = require('@sendgrid/mail')
const ENV = use('Env')
SendGrid.setApiKey(ENV.get('SENDGRID_KEY'))
const UserHook = (exports = module.exports = {})

UserHook.sendNewUserEmail = async (userInstance) => {
  if (!userInstance.email || !userInstance.dirty.email) return
  console.log('salvou!!')
  const { name, email, token } = await userInstance
  await SendGrid.send({
    to: email,
    from: 'naoresponda@bembrasil.org.br',
    subject: 'Multiaction | Confirmação do Cadastro',
    html: `
        <p>
            olá ${name},
            para fazer login na plataforma você deverá confirmar o cadastro no seguinte link:
            <a href="${ENV.get('FRONTEND_URL')}/${ENV.get('ACTIVATE_USER_ROUTE')}?token=${token}"> Ativar Cadastro</a>
        </p>`
  }).then(() => {}, error => {
    console.error(error)
    if (error.response) {
      console.error('error', error.response.body)
    }
  })
}
