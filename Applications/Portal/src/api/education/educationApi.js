

//queries

import educationResult from './graphql/educationResult.json'
import educationAdditionalTraining from './graphql/educationAdditionalTraining.json'
import educationPlan from './graphql/trainingPlan.graphql'


import gql from 'graphql-tag'

import {getClient} from '../tools'

export class EducationApi {
  static async getEducationPlan() {
    try {
      return await getClient('TRAINING').query({
        query: gql` ${educationPlan}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static getEducationResult() {
    try {
      return educationResult
    } catch (e) {
      throw new Error(e.message)
    }
  }
  static getEducationAdditionalTraining() {
    try {
      return educationAdditionalTraining
    } catch (e) {
      throw new Error(e.message)
    }
  }

}