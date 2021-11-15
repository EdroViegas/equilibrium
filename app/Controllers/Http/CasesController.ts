import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Case from 'App/Models/Case'
import User from 'App/Models/User'
import Code from 'Contracts/enums/code'

export default class CasesController {
  public async index({ response }: HttpContextContract) {
    try {
      const cases = await Case.query()
        .preload('user')
        .preload('contact')
        .whereNull('isDeleted')
        .orderBy('id', 'desc')
      return response.send({
        message: 'Lista de casos positivos',
        cases: cases,
        code: Code.SUCCESS,
      })
    } catch (error) {
      return response
        .status(202)
        .send({ message: 'Ocorreu um erro ao obter casos ', code: error.code })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    const caseData = request.all()
    const userId = caseData.userId

    try {
      const user = await User.findOrFail(userId)

      const addedCase = await Case.create(caseData)

      await addedCase.related('user').associate(user)

      return response
        .status(202)
        .send({ message: 'Caso adicionado', case: addedCase, code: Code.SUCCESS })
    } catch (error) {
      console.log(error)
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao adicionar caso', code: error.code })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const caseData = await Case.find(params.id)

      if (caseData) {
        await caseData.load('contact')
        await caseData.load('user')
        return response
          .status(202)
          .send({ message: 'Informações do caso', caso: caseData, code: Code.SUCCESS })
      }

      return response.status(200).send({ message: 'Caso não encontrado', code: Code.NOT_FOUND })
    } catch (error) {
      return response.status(200).send({
        message: 'Ocorreu um erro ao obter dados do caso',
        code: error.code,
      })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    const data = request.all()
    try {
      const caseData = await Case.find(params.id)
      if (caseData) {
        caseData.merge(data)
        caseData.save()
        return response
          .status(202)
          .send({ message: 'Caso actualizado', case: caseData, code: Code.SUCCESS })
      } else {
        return response.status(200).send({ message: 'Caso não encontrado', code: Code.NOT_FOUND })
      }
    } catch (error) {
      return response.status(200).send({
        message: 'Ocorreu um erro ao actualizar caso',
        code: error.code,
      })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    const isDeleted = 1
    try {
      const caseData = await Case.find(params.id)

      if (caseData) {
        caseData.merge({ isDeleted: isDeleted })
        caseData.save()
        return response.status(202).send({ message: 'Caso apagado', code: Code.SUCCESS })
      } else {
        return response.status(200).send({ message: 'Caso não encontrado', code: Code.NOT_FOUND })
      }
    } catch (error) {
      return response.status(200).send({
        message: 'Ocorreu um erro ao apagar caso',
        code: error.code,
      })
    }
  }

  public async search({ response, request }: HttpContextContract) {
    const keyword = request.input('search')
    const search = '%' + keyword + '%'

    try {
      const caseData = await Case.query().where('name', 'LIKE', search)

      return response
        .status(202)
        .send({ message: 'Lista de casos encontrados', case: caseData, code: Code.SUCCESS })
    } catch (error) {
      return response.status(200).send({
        message: 'Ocorreu um erro ao obter  caso',
        code: error.code,
      })
    }
  }
}
