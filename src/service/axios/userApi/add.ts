import HttpClient from '../index'

export interface userParams {
  name: string
}
export interface userResult {
  message: string
}
export const useLoginApi = () => {
  const loginApi = async (data: userParams): Promise<userResult> => {
    try {
      const httpClient = new HttpClient()
      const response = await httpClient.post<userResult>(
        '/user/user-server/api/v1/user/mobilelogin_defreg',
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    loginApi,
  }
}
