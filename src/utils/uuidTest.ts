/**
 * 测试字符串是否符合UUID规范
 * @param uuid 任意字符串
 */
const uuidTest = (uuid: string) => {
  return /[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(uuid)
}

export default uuidTest
