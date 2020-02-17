export default {
  SET_ATTACHMENT_DETAILS(state, {fileId, fileDetails, taskOrCaseId: id, rootState}) {
    const task = rootState.sm.taskInfo[id]
      || rootState.sm.caseDetails[id]
    task.originals.forEach(original => {
      if (original.id === fileId) {
        original.url = fileDetails.FileUrl
        original.versions = fileDetails.VERSIONS
      }
    })
  }
}
