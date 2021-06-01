import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTasks } from '@fortawesome/pro-regular-svg-icons/faTasks'
import { faSuitcase } from '@fortawesome/pro-regular-svg-icons/faSuitcase'
import { faProjectDiagram } from '@fortawesome/pro-regular-svg-icons/faProjectDiagram'
import { faFolder } from '@fortawesome/pro-regular-svg-icons/faFolder'
import { faFolderOpen } from '@fortawesome/pro-regular-svg-icons/faFolderOpen'
import { faMoneyCheckEdit } from '@fortawesome/pro-regular-svg-icons/faMoneyCheckEdit'
import { faChalkboardTeacher } from '@fortawesome/pro-regular-svg-icons/faChalkboardTeacher'
import { faCommentAltDots } from '@fortawesome/pro-regular-svg-icons/faCommentAltDots'
import { faPaperclip } from '@fortawesome/pro-regular-svg-icons/faPaperclip'
import { faRecycle } from '@fortawesome/pro-regular-svg-icons/faRecycle'
import { faExclamationCircle } from '@fortawesome/pro-regular-svg-icons/faExclamationCircle'
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons/faCheckCircle'
import { faFileSearch } from '@fortawesome/pro-regular-svg-icons/faFileSearch'
import { faTimes } from '@fortawesome/pro-regular-svg-icons/faTimes'
import { faExclamationSquare } from '@fortawesome/pro-regular-svg-icons/faExclamationSquare'
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye'
import { faCommentAltLines } from '@fortawesome/pro-regular-svg-icons/faCommentAltLines'
import { faHorizontalRule } from '@fortawesome/pro-regular-svg-icons/faHorizontalRule'
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash'
import { faUsers } from '@fortawesome/pro-regular-svg-icons/faUsers'
import { faMailBulk } from '@fortawesome/pro-regular-svg-icons/faMailBulk'
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons/faChevronRight'
import { faBars } from '@fortawesome/pro-regular-svg-icons/faBars'
import { faUser } from '@fortawesome/pro-regular-svg-icons/faUser'
import { faAt } from '@fortawesome/pro-regular-svg-icons/faAt'
import { faUserTag } from '@fortawesome/pro-regular-svg-icons/faUserTag'
import { faSignOutAlt } from '@fortawesome/pro-regular-svg-icons/faSignOutAlt'
import { faFileAlt } from '@fortawesome/pro-regular-svg-icons/faFileAlt'
import { faSync } from '@fortawesome/pro-regular-svg-icons/faSync'
import { faAward } from '@fortawesome/pro-regular-svg-icons/faAward'
import { faBorderAll } from '@fortawesome/pro-regular-svg-icons/faBorderAll'
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck'
import { faLayerPlus } from '@fortawesome/pro-regular-svg-icons/faLayerPlus'
import { faEdit } from '@fortawesome/pro-regular-svg-icons/faEdit'
import { faDownload } from '@fortawesome/pro-regular-svg-icons/faDownload'
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock'
import { faPaperPlane } from '@fortawesome/pro-regular-svg-icons/faPaperPlane'
import { faSearchPlus } from '@fortawesome/pro-regular-svg-icons/faSearchPlus'
import { faSearchMinus } from '@fortawesome/pro-regular-svg-icons/faSearchMinus'
import { faCompressArrowsAlt } from '@fortawesome/pro-regular-svg-icons/faCompressArrowsAlt'
import { faCompress } from '@fortawesome/pro-regular-svg-icons/faCompress'
import { faArrowAltLeft } from '@fortawesome/pro-regular-svg-icons/faArrowAltLeft'
import { faFlag } from '@fortawesome/pro-regular-svg-icons/faFlag'
import { faClipboardCheck } from '@fortawesome/pro-regular-svg-icons/faClipboardCheck'
import { faUndo } from '@fortawesome/pro-regular-svg-icons/faUndo'
import { faThumbsUp } from '@fortawesome/pro-regular-svg-icons/faThumbsUp'
import { faThumbsDown } from '@fortawesome/pro-regular-svg-icons/faThumbsDown'
import { faArrowAltRight } from '@fortawesome/pro-regular-svg-icons/faArrowAltRight'
import { faStar } from '@fortawesome/pro-regular-svg-icons/faStar'
import { faSitemap } from '@fortawesome/pro-regular-svg-icons/faSitemap'
import { faFolderTree } from '@fortawesome/pro-regular-svg-icons/faFolderTree'
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons/faEllipsisV'
import { faListAlt } from '@fortawesome/pro-regular-svg-icons/faListAlt'
import { faTable } from '@fortawesome/pro-regular-svg-icons/faTable'
import { faFire } from '@fortawesome/pro-regular-svg-icons/faFire'
import { faHourglass } from '@fortawesome/pro-regular-svg-icons/faHourglass'
import { faCheckDouble } from '@fortawesome/pro-regular-svg-icons/faCheckDouble'
import { faLink } from '@fortawesome/pro-regular-svg-icons/faLink'
import { faReply } from '@fortawesome/pro-regular-svg-icons/faReply'
import { faTags } from '@fortawesome/pro-regular-svg-icons/faTags'
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons/faQuestionCircle'
import { faUserPlus } from '@fortawesome/pro-regular-svg-icons/faUserPlus'
import { faCubes } from '@fortawesome/pro-regular-svg-icons/faCubes'
import { faSave } from '@fortawesome/pro-regular-svg-icons/faSave'
import { faFileContract } from '@fortawesome/pro-regular-svg-icons/faFileContract'
import { faFileSignature } from '@fortawesome/pro-regular-svg-icons/faFileSignature'
import { faSignature } from '@fortawesome/pro-regular-svg-icons/faSignature'
import { faUserCog } from '@fortawesome/pro-regular-svg-icons/faUserCog'
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle'
import { faInboxIn } from '@fortawesome/pro-regular-svg-icons/faInboxIn'
import { faFileTimes } from '@fortawesome/pro-regular-svg-icons/faFileTimes'
import { faClipboardListCheck } from '@fortawesome/pro-regular-svg-icons/faClipboardListCheck'
import { faRedo } from '@fortawesome/pro-regular-svg-icons/faRedo'
import { faUsbDrive } from '@fortawesome/pro-regular-svg-icons/faUsbDrive'
import { faUnlock as falUnlock } from '@fortawesome/pro-light-svg-icons/faUnlock'
import { faStar as falStar } from '@fortawesome/pro-light-svg-icons/faStar'
import { faFilesMedical as falFilesMedical } from '@fortawesome/pro-light-svg-icons/faFilesMedical'
import { faArrowAltDown as falArrowAltDown } from '@fortawesome/pro-light-svg-icons/faArrowAltDown'
import { faTrash as falTrash } from '@fortawesome/pro-light-svg-icons/faTrash'
import { faTimes as falTimes } from '@fortawesome/pro-light-svg-icons/faTimes'
import { faCheck as falCheck } from '@fortawesome/pro-light-svg-icons/faCheck'
import { faExclamation as falExclamation } from '@fortawesome/pro-light-svg-icons/faExclamation'
import { faDownload as falDownload } from '@fortawesome/pro-light-svg-icons/faDownload'
import { faCalendarDay as falCalendarDay } from '@fortawesome/pro-light-svg-icons/faCalendarDay'
import { faUser as falUser } from '@fortawesome/pro-light-svg-icons/faUser'
import { faSave as falSave } from '@fortawesome/pro-light-svg-icons/faSave'
import { faFlag as falFlag } from '@fortawesome/pro-light-svg-icons/faFlag'
import { faClipboardCheck as falClipboardCheck } from '@fortawesome/pro-light-svg-icons/faClipboardCheck'
import { faCommentAltLines as falCommentAltLines } from '@fortawesome/pro-light-svg-icons/faCommentAltLines'
import { faFolderPlus as falFolderPlus } from '@fortawesome/pro-light-svg-icons/faFolderPlus'
import { faFileSignature as falFileSignature } from '@fortawesome/pro-light-svg-icons/faFileSignature'
import { faAward as falAward } from '@fortawesome/pro-light-svg-icons/faAward'
import { faClipboardListCheck as falClipboardListCheck } from '@fortawesome/pro-light-svg-icons/faClipboardListCheck'
import { faFileContract as falFileContract } from '@fortawesome/pro-light-svg-icons/faFileContract'

import FaIcon from '@/components/FaIcon'

library.add(
  faTasks,
  faSuitcase,
  faProjectDiagram,
  faFolder,
  faFolderOpen,
  faMoneyCheckEdit,
  faChalkboardTeacher,
  faCommentAltDots,
  faPaperclip,
  faRecycle,
  faExclamationCircle,
  faCheckCircle,
  faFileSearch,
  faTimes,
  faExclamationSquare,
  faEye,
  faCommentAltLines,
  faHorizontalRule,
  faTrash,
  faUsers,
  faMailBulk,
  faSearch,
  faChevronRight,
  faBars,
  faUser,
  faAt,
  faUserTag,
  faSignOutAlt,
  faFileAlt,
  faSync,
  faAward,
  faBorderAll,
  faCheck,
  faLayerPlus,
  faEdit,
  faDownload,
  faClock,
  faPaperPlane,
  faSearchPlus,
  faSearchMinus,
  faCompressArrowsAlt,
  faCompress,
  faArrowAltLeft,
  faFlag,
  faClipboardCheck,
  faUndo,
  faThumbsUp,
  faThumbsDown,
  faArrowAltRight,
  faStar,
  faSitemap,
  faFolderTree,
  faEllipsisV,
  faListAlt,
  faTable,
  faFire,
  faHourglass,
  faCheckDouble,
  faReply,
  faLink,
  faTags,
  faQuestionCircle,
  faUserPlus,
  faCubes,
  faSave,
  faFileContract,
  faFileSignature,
  faSignature,
  faUserCog,
  faInfoCircle,
  faInboxIn,
  faFileTimes,
  faClipboardListCheck,
  faRedo,
  faUsbDrive,
  falUnlock,
  falStar,
  falFilesMedical,
  falArrowAltDown,
  falTrash,
  falTimes,
  falCheck,
  falArrowAltDown,
  falExclamation,
  falDownload,
  falCalendarDay,
  falUser,
  falSave,
  falFlag,
  falClipboardCheck,
  falCommentAltLines,
  falFolderPlus,
  falFileSignature,
  falAward,
  falClipboardListCheck,
  falFileContract)

Vue.component('fa-icon', FaIcon)
