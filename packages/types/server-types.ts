const AUTH_ROOT_SERVER = "http://localhost:3001";

export enum AuthenticationAPIEndpoints {
  AUTHENTICATION = "http://localhost:3001/api/auth",
  AUTHENTICATION_LOGIN_TEACHER = "http://localhost:3001/api/auth/login/teacher",
  AUTHENTICATION_LOGIN_STUDENT = "http://localhost:3001/api/auth/login/student",
  AUTHENTICATION_LOGIN_ADMIN = "http://localhost:3001/api/auth/login/admin",
  AUTHENTICATION_CREATE_TEACHER = "http://localhost:3001/api/auth/create/teacher",
  AUTHENTICATION_CREATE_STUDENT = "http://localhost:3001/api/auth/create/student",
  AUTHENTICATION_LOGOUT = "http://localhost:3001/api/auth/logout",
  AUTHENTICATION_REFRESH = "http://localhost:3001/api/auth/refresh",
}

export enum FunctionalityAPIEndpoints {
  FUNCTIONALITY = "http://localhost:3002/v1/api/",
  UPLOAD_IMAGE = "http://localhost:3002/v1/api/admin/image-upload",
  /**
   * Requires student ID in end of URL
   */
  GET_STUDENT_INFO = "http://localhost:3002/v1/api/teachers/info/students/",
  /**
   * Teachers JWT token will access students from a class.
   * @param classID
   */
  GET_STUDENTS_FROM_CLASS = "http://localhost:3002/v1/api/teachers/classes/",
}

enum URLsWithParams {
  GET_ASSIGNMENTS_FROM_STUDENT = "http://localhost:3002/v1/api/teachers/info/students/",
  ADMIN_STUDENTS = "http://localhost:3002/v1/api/admin/students/",
}

export type GET_ASSIGNMENTS_FROM_STUDENT =
  `${URLsWithParams.GET_ASSIGNMENTS_FROM_STUDENT}${string}/assignments`;
export type SEE_ASSIGNMENT_FROM_STUDENT =
  `${URLsWithParams.ADMIN_STUDENTS}${string}/assignments/${string}`;
