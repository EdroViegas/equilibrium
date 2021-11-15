import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import validateEmail from 'App/helpers/helper_functions'
import User from 'App/Models/User'
import Code from 'Contracts/enums/code'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query().whereNull('is_deleted').orderBy('id', 'desc')
      return response
        .status(202)
        .send({ message: 'Lista de usuários', users: users, code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao obter usuários', code: error.code })
    }
  }

  public async store({  response, request }: HttpContextContract) {
     
    //const loggedUser = auth.user
    const userData = request.all()

    //Only admin can register user
    /*
    if (loggedUser.role !== 'administrador') {
      return response
        .status(200)
        .send({ message: 'Não tem permissão para realizar a operação', code: Code.ER_EMAIL_FORMAT })
    
    }
  */
    /*
    if (!validateEmail(userData.email))
      return response
        .status(200)
        .send({ message: 'E-mail no formato errado', code: Code.ER_EMAIL_FORMAT })*/

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

      await user?.delete()
      return response.status(200).send({ message: 'Usuário  eliminado', code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao eliminar o usuário', code: error.code })
    }
  }

  public async changeState({ response, params }: HttpContextContract) {
    try {
      const user = await User.find(params.id)

      const isActive = user?.isActive === 1 ? 0 : 1
      const state = isActive === 0 ? 'desativado' : 'activado'

      if (user) {
        user.merge({ isActive: isActive })
        user.save()
        return response
          .status(202)
          .send({ message: `O usuário foi ${state}`, user: user, code: Code.SUCCESS })
      } else {
        return response.status(200).send({
          message: `Não foi possível  ${state} o usuário`,
          code: Code.ER_COULD_NOT_CHANGE_STATE,
        })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao desativar usuário', code: error.code })
    }
  }
}
