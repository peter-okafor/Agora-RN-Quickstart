import { ErrorCode, WarningCode } from "react-native-agora";


class ExpressoError extends Error {
  _userMessage: string
  constructor(code: (ErrorCode|WarningCode)) {
    super(String(code));
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'ExpressoError'
    this._userMessage = convertCode(code)
  }
}

const convertCode = (code:(ErrorCode|WarningCode)) => {
  switch (code) {
    case ErrorCode.NoError:
      return 'All good.'
    case ErrorCode.Failed:
      return 'General Error. Please try again.'
    case ErrorCode.InvalidArgument:
      return 'An invalid parameter is used.'
    case ErrorCode.NotReady:
      return 'The SDK module is not ready.'
    case ErrorCode.NotSupported:
      return 'The current state of the SDK does not support this function.'
    case ErrorCode.Refused:
      return 'The request is rejected.'
    case ErrorCode.BufferTooSmall:
      return 'The SDK is not initialized before calling this method.'
    case ErrorCode.NotInitialized:
      return 'Permission to access is not granted. Check whether your app has access to the audio and video device.'
    case ErrorCode.JoinChannelRejected:
      return 'The request to join the channel is rejected.'
    case ErrorCode.LeaveChannelRejected:
      return 'The request to leave the channel is rejected.'
    case ErrorCode.InvalidChannelId:
      return 'The specified channel name is invalid.'
    case WarningCode.AdmPlaybackMalfunction:
      return 'Audio: Playback device fails!'
    case WarningCode.AdmInterruption:
      return 'Audio: Call interrupted!'
    case WarningCode.AdmPlayoutAudioLowlevel:
      return 'Audio: Playout audio low'
    case WarningCode.AdmRecordAudioLowlevel:
      return 'Audio: The recorded audio is too low'
    case WarningCode.AdmRecordIsOccupied:
      return 'Audio: The recording device is busy.'
    default:
      return `Error from agora!`
  }
}

export default ExpressoError