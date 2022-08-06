import React from 'react'

const Filter = ({filter, handler}) =>
  <div>
    filter shown with 
    <input value={filter} onChange={handler} />
  </div>

export default Filter