import gql from 'graphql-tag'

export const ALL_EQUIPMENT = gql`
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

export const SINGLE_EQUIPMENT_INFO = gql`
query equipments($id: ID) {
  eam {
    equipments(id: $id) {
      id
      name
      designation
      fullName
      description
      factoryNumber
      installDate
      type {
        id
        name
      }
      category {
        id
        name
      }
      status {
        id
        name
      }
      responsibleEmployee {
        id
        fullName
      }
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
      lastWorkRequest {
        id
        creationDate
      }
      lastRepair {
        id
        factDate
      }
      currentMovementRecord {
        id
        technicalPlace {
          id
          name
          responsibleEmployee {
            id
            fullName
          }
          allChildren(where: {path: "hierarchyType", comparison: equal, value: "IT_STRUCT      "}){
            id
          }
          allParents(where: {path: "hierarchyType", comparison: equal, value: "IT_STRUCT      "}, orderBy:{path:"level"}) {
            technicalPlace {
              id
              responsibleSpecialists {
                employee {
                  id
                  fullName
                }
                direction {
                  id
                  name
                }
                isResponsible
              }
            }
          }
        }
      }
    }
  }
}
`

export const EQUIPMENT_ATTACHMENTS = gql`
query equipments($id: ID) {
  eam {
    equipments(id: $id) {
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

export const EQUIPMENT_IMAGES = gql`
query equipment($id: ID) {
  eam {
    equipment(id: $id) {
      id
      images {
        id
        fileName
        url
      }
      model {
        id
        attachments {
          id
          fileName
          url
        }
      }
    }
  }
}
`

export const ALL_DOWNTIME = gql`
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
            fullName
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

const workRequestFull = gql`
{
	id
	creationDate
	equipment {
		id
		name
		fullName
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
  category {
    id
    name
  }
  direction {
    id
    name
  }
  repairType {
    id
    name
  }
	workRequestCategoryId
	source
	status
	isValid
}
`

export const ALL_WORK_REQUESTS = gql`
query ($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID], $search: String) {
  eam {
    workRequestConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, search:$search) {
      edges {
        node ${workRequestFull}
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

export const CREATE_WORK_REQUEST = gql`
mutation ($workRequest:WorkRequestInput!){
  eamMutation {
    createWorkRequest(workRequest: $workRequest) ${workRequestFull}
  }
}
`

export const ADD_WORK_REQUEST_ATTACHMENTS = gql`
mutation ($workRequestId: Int!, $fileNames: [String]!, $filePaths: [String]!, $attachmentType: String) {
  eamMutation {
    addWorkRequestAttachment(workRequestId: $workRequestId, fileNames: $fileNames, filePaths: $filePaths, attachmentType: $attachmentType)
  }
}
`

export const ALL_INSPECTIONS = gql`
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
            valueInputType
          }          
          equipment {
            id
            name
            fullName
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
          isClosed
          additionalData{            
            failureReason{id name}
            failureType{id name}            
            responsible{id fullName}
            isValid
          }
          attachments {
            id
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

export const ALL_INSPECTIONS_BYEQUIPMENT = gql`
query ($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy:[OrderByGraph], $ids: [ID], $equipmentId: String ) {
  eam {
    conditionParameterByEquipmentValuesConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids, equipmentId:$equipmentId) {
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
            valueInputType
          }          
          equipment {
            id
            name
            fullName
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
          isClosed
          additionalData{            
            failureReason{id name}
            failureType{id name}            
            responsible{id fullName}
            isValid
          }
          attachments {
            id
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

export const INSPECTION_ATTACHMENTS = gql`
query ($id: ID) {
  eam {
    conditionParameterValues(id: $id) {
      id
      attachments {
        id
        fileName
        url
      }
    }
  }
}

`

export const EDIT_INSPECTION = gql`
mutation ($inspection: ConditionParameterValueInput!) {
  eamMutation {
    editInspection(inspection: $inspection) {
      id
    }
  }
}
`

export const ADD_INSPECTION_ATTACHMENTS = gql`
mutation ($inspectionId: Int!, $fileNames: [String]!, $filePaths: [String]!, $attachmentType: String) {
  eamMutation {
    addInspectionAttachment(inspectionId: $inspectionId, fileNames: $fileNames, filePaths: $filePaths, attachmentType: $attachmentType)
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

export const FAILURE_TYPES = gql`
query categories($where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    equipmentFailureTypes(where: $where, orderBy: $orderBy, ids: $ids) {
      id
      name
      isValid
    }
  }
}
`

export const FAILURE_REASONS = gql`
query categories($where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    equipmentFailureReasons(where: $where, orderBy: $orderBy, ids: $ids) {
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

export const EQUIPMENT_SELECT = gql`
query ($take:Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    equipments(take:$take, where: $where, orderBy: $orderBy, ids: $ids) {
      id
      fullName
    }
  }
}
`

export const ALL_MAINTENANCE_NORMS = gql`
query ($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    maintenanceNormsConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids) {
      edges {
        node {
          id
          techRouteDesignation
          resource {
            id
            name
          }
          direction {
            id
            name
          }
          repairType {
            id
            name
          }          
          isValid        
          periodicity
          periodType          
          maintenanceNormType
          duration
          exactDuration
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

export const ALL_CONDITION_PARAMETERS = gql`
query ($after: String, $first: Int, $where: [WhereExpressionGraph], $orderBy: [OrderByGraph], $ids: [ID]) {
  eam {
    conditionParametersConnection(after: $after, first: $first, where: $where, orderBy: $orderBy, ids: $ids) {
      edges {
        node {
          id
          name
          measurementUnit {
            id
            name
          }
          minValue
          maxValue
          conditionParameterType {
            id
            name
          }
          period
          valueInputType
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