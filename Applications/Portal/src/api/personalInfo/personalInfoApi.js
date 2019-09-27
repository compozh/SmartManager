
import gql from 'graphql-tag'

import {getClient} from '../tools'
//queries

import fullUserInfo from './graphql/fullUserInfo.graphql'

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

}
