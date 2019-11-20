

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


import gql from 'graphql-tag'

import {getClient} from '../tools'

export class EducationApi {
  static async getEducationPlan() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${educationPlan}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }


  static async getStrategicGoals() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${strategicGoals}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTaskForYear() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${taskForYear}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  static async getResultsInterimEvaluation() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${resultsInterimEvaluation}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getCriterialEvaluation() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${criterialEvaluation}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getSelfEsteemResults() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${selfEsteemResults}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getResultsAssessmentSupremo() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${resultsAssessmentSupremo}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  static async getEducationResult() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${educationResult}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getEducationAdditionalTraining() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${educationAdditionalTraining}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }

  static async getTrainingSchedule() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${trainingSchedule}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
  static async getIndividualPlanReport() {
    try {
      return await getClient('PORTALNABU').query({
        query: gql` ${individualPlanReport}`
      })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  
}