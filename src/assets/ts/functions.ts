// 对身份证号显示进行加密
export const hideIdCard = (idCard: string) => {
  if (idCard && idCard.length > 4)
    return idCard.slice(0, 2) + "******" + idCard.slice(-4);
  return idCard;
};
