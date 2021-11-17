import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Case from 'App/Models/Case'
import Contact from 'App/Models/Contact'
import Code from 'Contracts/enums/code'

export default class ContactsController {
  public async index({ response }: HttpContextContract) {
    try {
      const contacts = await Contact.query().preload('case')

      return response
        .status(202)
        .send({ message: 'Lista de contactos', data: contacts, code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Erro ao obter lista de contactos', code: error.code })
    }
  }

  public async blockeds({ response }: HttpContextContract) {
    try {
      const contacts = await Contact.query().where((query) => query.where('is_blocked', 1))
      return response
        .status(202)
        .send({ message: 'Lista de contactos bloqueados', data: contacts, code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Erro ao obter lista de contactos bloqueados', code: error.code })
    }
  }

  public async store({ response, request }: HttpContextContract) {
    const contactData = request.all()

    const caseId = contactData.caseId

    try {
      const caseData = await Case.find(caseId)

      if (caseData) {
        const contact = await Contact.create(contactData)
        await contact.related('case').associate(caseData)

        return response
          .status(202)
          .send({ message: 'Contacto adicionado', contact: contact, code: Code.SUCCESS })
      }
    } catch (error) {
      return response
        .status(202)
        .send({ message: 'Ocorreu um erro ao adicionar contacto', code: error.code })
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const contact = await Contact.find(params.id)

      if (contact) {
        return response
          .status(202)
          .send({ message: 'Informações do contacto', data: contact, code: Code.SUCCESS })
      }

      return response.status(404).send({ message: 'Contacto não encontrado', code: Code.NOT_FOUND })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao obter contacto', code: error.code })
    }
  }

  public async update({ response, request, params }: HttpContextContract) {
    const contactData = request.all()

    try {
      const contact = await Contact.find(params.id)

      if (contact) {
        contact.merge(contactData)
        contact.save()
        return response
          .status(202)
          .send({ message: 'Contacto actualizado ', data: contact, code: Code.SUCCESS })
      } else {
        return response
          .status(200)
          .send({ message: 'Contacto não encontrado ', code: Code.NOT_FOUND })
      }
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao actualizar contacto', code: error.code })
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const contact = await Contact.find(params.id)

      await contact?.delete()
      return response.status(200).send({ message: 'Contacto eliminado', code: Code.SUCCESS })
    } catch (error) {
      return response
        .status(200)
        .send({ message: 'Ocorreu um erro ao eliminar contacto', code: error.codeS })
    }
  }
}
