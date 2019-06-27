import gql from 'graphql-tag'

export const ALL_EQUIPMENT = gql`
query equipment($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID] ) {
  eam {
    equipmentsConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids)  {
      edges {
        node {
          id
          type {
            id
            name
          }
          responsibleEmployee {
            id
            fullName
          }
          name
          designation
          fullName
          description
          factoryNumber
          itObject {
            id
            name
          }
          department {
            id
            name
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
`

export const ALL_DOWNTIME = gql`
query downtime($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID] ) {
  eam {
    downTimesConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids) {
      edges {
        node {
          id
          date
          endDate
          equipment {
            id
            name
          }
          technicalPlace {
            id
            name
          }
          department {
            id
            name
          }
          description
          comment          
          value
          additionalData{
            direction{id name}
            downTimeType
            failureReason{id name}
            failureType{id name}
            isEmergency
            isPlanned
            sourceTechPlace{id name}
            responsible{id fullName}
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
`

export const ALL_WORK_REQUESTS = gql`
query workRequest($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    workRequestConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids) {
      edges {
        node {
          id
          creationDate
          equipment {
            id
            name
          }
          technicalPlace {
            id
            name
          }
          department {
            id
            name
          }
          content         
          
          declarerEmployee {
            id
            fullName
          }
          responsibleEmployee {
            id
            fullName
          }
          performerEmployee {
            id
            fullName
          }
          workRequestCategoryId
          source
          status
          isValid
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
`

export const ALL_INSPECTIONS = gql`
query conditionParameterValues($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID] ) {
  eam {
    conditionParameterValuesConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids) {
      edges {
        node {
          id
          date  
          conditionParameter{
            id
            name
            measurementUnit{
              id
              name
            }
            maxValue
            minValue
            valueRanges {
              id
              description
              minValue
              maxValue
              workRequestCategoryId
            }
          }          
          equipment {
            id
            name
          }
          technicalPlace {
            id
            name
          }
          department {
            id
            name
          }
          description
          comment          
          value
          additionalData{            
            failureReason{id name}
            failureType{id name}            
            responsible{id fullName}
            isValid
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
}
`