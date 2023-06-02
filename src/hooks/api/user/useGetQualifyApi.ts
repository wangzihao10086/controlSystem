import useHttp from '@/service/axios/index.ts'

export const useLogin = () => {
  const { request, cancel, cancelAll, loading } = useHttp()

  const loginApi = async (data: any) => {
    const res = await request({
      url: '/login',
      method: 'POST',
      data,
    })
    return res
  }

  return { request, cancel, cancelAll, loading, loginApi }
}
