import useHttp from "@/service/axios/index.ts";

import LocalCache from "@/utils/cache";

// 登录
export const useLogin = () => {
  const { request, cancel, cancelAll, loading } = useHttp();

  const loginRequest = async (data: any) => {
    const res = await request({
      url: "/login",
      method: "POST",
      params: {
        loginId: data.loginId,
        pwd: data.pwd,
      },
    });
    return res;
  };

  return { cancel, cancelAll, loading, loginRequest };
};

// 注册
export const useRegister = () => {
  const { request, cancel, cancelAll, loading } = useHttp();
  const registerRequest = async (data: any) => {
    const res = await request({
      url: "/register",
      method: "POST",
      params: {
        email: data.email ? data.email : "",
        nickname: data.nickname ? data.nickname : "",
        phone: data.phone ? data.phone : "",
        pwd: data.pwd ? data.pwd : "",
      },
    });
    return res;
  };
  return { cancel, cancelAll, loading, registerRequest };
};

// 获取当前用户信息
export const useUserInfo = () => {
  const { request, cancel, cancelAll, loading } = useHttp();
  const userInfoRequest = async (data: any) => {
    const res = await request({
      url: "/qualification/query",
      method: "GET",
      params: {
        token: data.token,
      },
    });
    if (res.code == 200) {
      LocalCache.setCache("userInfo", res.data.userVo);
    }
    return res;
  };
  return { cancel, cancelAll, loading, userInfoRequest };
};
