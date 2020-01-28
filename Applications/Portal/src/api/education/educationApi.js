//queries
import educationResult from './graphql/educationResult.graphql'
import educationAdditionalTraining from './graphql/educationAdditionalTraining.graphql'
import educationPlan from './graphql/trainingPlan.graphql'
import strategicGoals from './graphql/strategicGoals.graphql'
import taskForYear from './graphql/taskForYear.graphql'
import resultsInterimEvaluation from './graphql/resultsInterimEvaluation.graphql'
import criterialEvaluation from './graphql/criterialEvaluation.graphql'
import selfEsteemResults from './graphql/selfEsteemResults.graphql'
import resultsAssessmentSupremo from './graphql/resultsAssessmentSupremo.graphql'
import trainingSchedule from './graphql/trainingSchedule.graphql'
import individualPlanReport from './graphql/individualPlanReport.graphql'
import characteristic from './graphql/characteristic.graphql'
import normsOfWorkwear from './graphql/normsOfWorkwear.graphql'
import workwearOnPersonal from './graphql/workwearOnPersonal.graphql'
import otherStocksOnPersonal from './graphql/otherStocksOnPersonal.graphql'
import workWearOnPlace from './graphql/workWearOnPlace.graphql'

import gql from 'graphql-tag'
import {getClient} from '../tools'

export class EducationApi {
  static async getEducationPlan() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${educationPlan}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }


  static async getStrategicGoals() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${strategicGoals}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTaskForYear() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${taskForYear}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getResultsInterimEvaluation() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${resultsInterimEvaluation}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getCriterialEvaluation() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${criterialEvaluation}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getSelfEsteemResults() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${selfEsteemResults}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getResultsAssessmentSupremo() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${resultsAssessmentSupremo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getEducationResult() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${educationResult}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getEducationAdditionalTraining() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${educationAdditionalTraining}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTrainingSchedule() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${trainingSchedule}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getIndividualPlanReport() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${individualPlanReport}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getСharacteristic() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${characteristic}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getNormsOfWorkwear() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${normsOfWorkwear}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getWorkwearOnPersonal() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${workwearOnPersonal}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getOtherStocksOnPersonal() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${otherStocksOnPersonal}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getWorkWearOnPlace() {
    try {
      const client = await getClient('PORTALNABU')
      return await client.query({
        query: gql` ${workWearOnPlace}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }


}
