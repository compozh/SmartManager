

//queries

import educationPlan from './graphql/educationPlan.json'
import educationResult from './graphql/educationResult.json'
import educationAdditionalTraining from './graphql/educationAdditionalTraining.json'

export class EducationApi {
  static getEducationPlan() {
    try {
      return educationPlan
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