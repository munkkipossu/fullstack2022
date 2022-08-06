import React from 'react'

const Notification = ({ message, errorState }) => {
    if (message === null) {
      return null
    }
    const style = {
      color: errorState ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    }
  
    return (
      <div style={style} className='notification'>
        {message}
      </div>
    )
}

export default Notification