//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { DateTime, Duration } from 'luxon'
import { v4 as uuid } from 'uuid'

//-----------------------------------------------------------------------------
// Utils
//-----------------------------------------------------------------------------

// Build New Id
export const buildNewId: () => string = () => {
  return uuid()
}

// Format Date
export const formatDate: (
  unformattedISODate: string | null | undefined
) => string = (unformattedISODate) => {
  const dateFormat = 'yyyy-MM-dd'
  return unformattedISODate
    ? DateTime.fromISO(unformattedISODate).toFormat(dateFormat)
    : DateTime.now().toFormat(dateFormat)
}

// Get Human Duration From ISO
export const getHumanDurationFromISO: (
  ISODuration: string | null | undefined
) => string = (ISODuration) => {
  return ISODuration
    ? Duration.fromISO(ISODuration).toHuman()
    : Duration.fromObject({ weeks: 1 }).toHuman()
}

// Get ISO Duration From Human
export const getISODurationFromHuman: (
  humanDuration: string | null | undefined
) => string = (humanDuration) => {
  // Set the default duration to 1 week
  const defaultDuration = 'P1W'
  if (humanDuration) {
    // Get the duration value by removing all the non-numeric values from the string
    const durationValueString = humanDuration.replace(/[^0-9]/g, '')
    const durationValue = Number(durationValueString)
    // If the duration value is 0, return a 0 day duration ISO string
    if (durationValue === 0) {
      return 'P0D'
    } else {
      // Get the duration period by searching for the first letter of  Year, 
      // Month, Week, or Day in the humanDuration
      const durationPeriod = humanDuration
        .split('')
        .find((currentStringInArray) => {
          return ['Y', 'M', 'W', 'D'].includes(
            currentStringInArray.toUpperCase()
          )
        })
      if (durationPeriod) {
        return ('P' + durationValue + durationPeriod).toUpperCase()
      } else {
        return defaultDuration
      }
    }
  } else {
    return defaultDuration
  }
}
