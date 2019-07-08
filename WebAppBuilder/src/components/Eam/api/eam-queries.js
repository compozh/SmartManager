import gql from 'graphql-tag'

export const ALL_EQUIPMENT = gql `
query equipment($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID], $search: String) {
  eam {
    equipmentsConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, search:$search) {
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
          model {
            id
            name
          }
          itObject {
            id
            name
          }
          department {
            id
            name
          }
          currentMovementRecord {
            id
            technicalPlace {
              id
              name
            }
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

export const SINGLE_EQUIPMENT_INFO = gql `
query equipment($id: ID) {
  eam {
    equipment(id: $id) {
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
      installDate
      model {
        id
        name
      }
      itObject {
        id
        name
      }
      department {
        id
        name
      }
      status {
        id
        name
      }
      category {
        id
        name
      }
      currentMovementRecord {
        id
        technicalPlace {
          id
          name
        }
      }
    }
  }
}
`

export const EQUIPMENT_ATTACHMENTS = gql `
query equipment($id: ID) {
  eam {
    equipment(id: $id) {
      id
      attachments {
        id
        fileName
        fileSize
        url
      }
    }
  }
}
`

export const EQUIPMENT_IMAGES = gql `
query equipment($id: ID) {
  eam {
    equipment(id: $id) {
      id
      images {
        id
        fileName
        fileSize
        url
      }
    }
  }
}
`

export const ALL_DOWNTIME = gql `
query downtime($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID], $search: String ) {
  eam {
    downTimesConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, search:$search) {
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

export const ALL_WORK_REQUESTS = gql `
query workRequest($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID], $search: String) {
  eam {
    workRequestConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, search:$search) {
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

export const ALL_INSPECTIONS = gql `
query conditionParameterValues($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID], $search: String ) {
  eam {
    conditionParameterValuesConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, search:$search) {
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

export const DIRECTIONS = gql`
query directions($where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    workRequestDirections(where: $where, orderBy: $orderBy, ids: $ids) {
      id
      name
      isValid
    }
  }
}
`

export const CATEGORIES = gql`
query categories($where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    workRequestCategories(where: $where, orderBy: $orderBy, ids: $ids) {
      id
      name
      isValid
    }
  }
}
`

export const EQUIPMENT_TYPES_SELECT = gql`
query equipmentTypes($take:Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    equipmentTypes(take:$take, where: $where, orderBy: $orderBy, ids: $ids) {
      id
      name
    }
  }
}
`