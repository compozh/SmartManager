
import gql from 'graphql-tag'

import {getClient} from '../tools'
//queries

import fullUserInfo from './graphql/fullUserInfo.graphql'

export class PersonalInfoApi {

  static getFullUserInfo() {
    return getClient('ITPORTAL').query({
      query: gql` ${fullUserInfo}`
    })
  }

}
