import { ErrorCode } from "react-native-agora";


class ExpressoError extends Error {
  _userMessage?: string
  constructor(code: ErrorCode) {
    super(String(code));
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'ExpressoError'
    this._userMessage = convertCode(code)
  }
}

const convertCode = (code:ErrorCode) => {
  switch (code) {
    case 0:
      return 'All good.'
    case 1:
      return 'General Error. Please try again.'
    case 9:
      return 'Permission to access is not granted. Check whether your app has access to the audio and video device.'
    case 17:
      return 'The request to join the channel is rejected.'
    case 18:
      return 'The request to leave the channel is rejected.'
    case 102:
      return 'The specified channel name is invalid.'
    default:
      return `${code}`
  }
}

export const userErrors = ['1', '9', '17', '18', '102']

export default ExpressoError