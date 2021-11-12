import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import validateEmail from 'App/helpers/helper_functions'
import User from 'App/Models/user'
import Code from 'Contracts/enums/code'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query().where('isActive', 1)
      return response
        .status(202)
        .send({ message: 'Lista de usuários', data: users, code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao obter usuários', code: error.code })
    }
  }

  public async store({ auth, response, request }: HttpContextContract) {
    const loggeUser = auth.user
    const userData = request.all()

    if (loggeUser.role !== 'admin') {
      return response
        .status(200)
        .send({ message: 'Não tem permissão para realizar a operação', code: Code.ER_EMAIL_FORMAT })
    }

    if (!validateEmail(userData.email))
      return response
        .status(200)
        .send({ message: 'E-mail no formato errado', code: Code.ER_EMAIL_FORMAT })

    try {
      const emailExists = await User.findBy('email', userData.email)

      if (!emailExists) {
        const user = await User.create(userData)
        return response
          .status(202)
          .send({ message: 'Usuário adicionado', data: user, code: Code.SUCCESS })
      } else {
        return response
          .status(200)
          .send({ message: 'Já existe um usuário com este e-mail', code: Code.ER_EMAIL_EXISTS })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao adicionar usuários', code: error.code })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

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

  public async update({ response, request, params }: HttpContextContract) {
    const userData = request.all()

    try {
      const user = await User.find(params.id)

      if (user) {
        user.merge(userData)
        user.save()
        return response
          .status(202)
          .send({ message: 'Usuário actualizado ', data: user, code: Code.SUCCESS })
      } else {
        return response
          .status(404)
          .send({ message: 'Usuário não encontrado ', code: Code.NOT_FOUND })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao actualizar usuário', code: error.code })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      const isActive = 0

      if (user) {
        user.merge({ isActive: isActive })
        user.save()
        return response.status(202).send({ message: 'Usuário desativado', code: Code.SUCCESS })
      } else {
        return response.status(200).send({
          message: 'Não foi possível desativar o usuário',
          code: Code.ER_COULD_NOT_DEACTIVATE,
        })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao desativar usuário', code: error.code })
    }
  }

  public async activate({ response, params }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      const isActive = 1

      if (user) {
        user.merge({ isActive: isActive })
        user.save()
        return response.status(202).send({ message: 'Usuário activado', code: Code.SUCCESS })
      } else {
        return response.status(200).send({
          message: 'Não foi possível activar o usuário',
          code: Code.ER_COULD_NOT_ACTIVATE,
        })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao activar usuário', code: error.code })
    }
  }
}
