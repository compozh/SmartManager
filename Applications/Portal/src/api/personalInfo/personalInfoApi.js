
import gql from 'graphql-tag'

import {getClient} from '../tools'
//queries

import fullUserInfo from './graphql/fullUserInfo.graphql'
import updateUserInfo from './graphql/updateUserInfo.graphql'
import employeeInfo from './graphql/employeeInfo.graphql'

export class PersonalInfoApi {

  static getFullUserInfo() {
    try {
      return getClient('PERSONAL_INFO').query({
        query: gql` ${fullUserInfo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  static async getEmployeeInfo() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${employeeInfo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static updateUserInfo(value) {
    return getClient('PERSONAL_INFO').mutate({
      mutation: gql` ${updateUserInfo}`,
      variables: { email: value.email, skype: value.skype, phone: value.phone  }
    })
  }
}
