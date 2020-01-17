
import gql from 'graphql-tag'

import {getClient} from '../tools'
//queries

import fullUserInfo from './graphql/fullUserInfo.graphql'
import updateUserInfo from './graphql/updateUserInfo.graphql'
import employeeInfo from './graphql/employeeInfo.graphql'

export class PersonalInfoApi {

  static async getFullUserInfo() {
    try {
      const client = await getClient('PERSONAL_INFO')
      return await client.query({
        query: gql` ${fullUserInfo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getEmployeeInfo() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${employeeInfo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async updateUserInfo(value) {
    const client = await getClient('PERSONAL_INFO')
    return await client.mutate({
      mutation: gql` ${updateUserInfo}`,
      variables: { email: value.email, skype: value.skype, phone: value.phone  }
    })
  }
}
