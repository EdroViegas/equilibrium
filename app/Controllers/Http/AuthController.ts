// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Code from 'Contracts/enums/code'
import Hash from '@ioc:Adonis/Core/Hash'
export default class AuthController {
  /* public async login({ auth, response, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)

      return response.status(202).send({ message: 'Login efectuado', token, code: Code.SUCCESS })
    } catch (error) {
      return response.status(401).send({ message: 'Credenciais inválida', code: Code.ER_LOGIN })
    }
  }*/

  public async show({ response, auth }: HttpContextContract) {
    try {
      const user = await User.find(auth.user?.id)

      if (user) {
        return response
          .status(202)
          .send({ message: 'Informações do usuário', user: user, code: Code.SUCCESS })
      }

      return response.status(404).send({ message: 'Usuário não encontrado', code: Code.NOT_FOUND })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao obter usuário', code: error.code })
    }
  }

  public async login({ auth, response, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const user = await User.query()
        .where('email', email)
        .where('isActive', 1)
        .whereNull('isDeleted')
        .first()

      if (!user) {
        return response
          .status(200)
          .send({ message: 'E-mail ou senha incorrecta!', code: Code.ER_LOGIN })
      }

      if (!(await Hash.verify(user.password, password))) {
        return response
          .status(200)
          .send({ message: 'E-mail ou senha incorrecta!', code: Code.ER_LOGIN })
      }

      const token = await auth.use('api').generate(user, {
        expiresIn: '10days',
        name: user.email,
      })

      return response
        .status(202)
        .send({ message: 'Login efectuado', token, user, code: Code.SUCCESS })
    } catch (error) {
      console.log(error)
      return response
        .status(200)
        .send({ message: 'Ops! Ocorreu um erro ao efectuar o login', code: error.code })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      if (auth.use('api').isLoggedOut) {
        return response.status(202).send({ message: 'Logout efectuado', code: Code.SUCCESS })
      } else {
        return response
          .status(202)
          .send({ message: 'Não foi possível efectuar Logout', code: Code.ER_LOGOUT })
      }
    } catch (error) {
      return response.status(200).send({ message: 'Erro ao efectuar logout', code: error.code })
    }
  }
}
