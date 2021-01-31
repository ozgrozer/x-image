import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Form, Input } from 'rfv'

import './../css/style.scss'

const validations = {
  empty: [
    {
      rule: 'isLength',
      args: { min: 1 },
      invalidFeedback: 'Please provide a value'
    }
  ]
}

const App = () => {
  const [imageData, setImageData] = useState()
  const postSubmit = res => setImageData(res.data)

  return (
    <div>
      <Form
        postSubmit={postSubmit}
        postOptions={{ method: 'post', url: '/get-image' }}
      >
        <Input
          type='text'
          name='tweetUrl'
          validations={validations.empty}
          placeholder='https://twitter.com/ozgrozer/status/1355138534777245697'
        />

        <div className='generatedImageWrapper'>
          {
            imageData
              ? (
                <img src={`data:image/png;base64, ${imageData}`} className='generatedImage' />
                )
              : (
                <div className='helpText'>Type the tweet URL above</div>
                )
          }
        </div>
      </Form>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
