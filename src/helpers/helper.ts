import { useState, useEffect } from 'react'
import uuid from 'react-native-uuid'

const DataEdit = (newData) => {
  const temp = []

  for (let index = 0; index < newData?.length; index++) {
    if (index === 0) {
      temp.push(
        {
          datetime: newData[index]?.start?.datetime,
          description: newData[index]?.start?.description,
          id: newData[index]?.start?.id,
          main_text: newData[index]?.start?.main_text,
          secondary_text: newData[index]?.start?.secondary_text,
          sessionToken: uuid.v4().toString(),
          utcOffset: newData[index]?.start?.tz_offset,
        },
        {
          datetime: newData[index]?.end?.datetime,
          description: newData[index]?.end?.description,
          id: newData[index]?.end?.id,
          main_text: newData[index]?.end?.main_text,
          secondary_text: newData[index]?.end?.secondary_text,
          utcOffset: newData[index]?.end?.tz_offset,
          sessionToken: uuid.v4().toString(),
          waypoint: {
            end_address: newData[index]?.end?.description,
            end_tz_offset: newData[index]?.end?.tz_offset,
            price: newData[index]?.price,
            start_address: newData[index]?.end?.description,
            start_tz_offset: newData[index]?.end?.tz_offset,
          },
        }
      )
    } else {
      temp.push({
        datetime: newData[index]?.start?.datetime,
        description: newData[index]?.start?.description,
        id: newData[index]?.end?.id,
        main_text: newData[index]?.end?.main_text,
        secondary_text: newData[index]?.start?.secondary_text,
        utcOffset: newData[index]?.start?.tz_offset,
        sessionToken: uuid.v4().toString(),
        waypoint: {
          end_tz_offset: newData[index]?.end?.tz_offset,
          price: newData[index]?.price,
          start_address: newData[index]?.start?.description,
          start_tz_offset: newData[index]?.start?.tz_offset,
        },
      })
    }
  }
  return temp
}

export default DataEdit
