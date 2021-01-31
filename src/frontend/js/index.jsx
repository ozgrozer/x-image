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

  const [formIsSubmitting, setFormIsSubmitting] = useState(false)
  const onSubmit = res => {
    if (res.isFormValid) {
      setImageData('')
      setFormIsSubmitting(true)
    }
  }
  const postSubmit = res => {
    setFormIsSubmitting(false)
    setImageData(res.data)
  }

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        postSubmit={postSubmit}
        postOptions={{ method: 'post', url: '/get-image' }}
      >
        <fieldset disabled={formIsSubmitting}>
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
                  <div className='helpText'>
                    {
                      formIsSubmitting
                        ? (<div>Loading...</div>)
                        : (<div>Type the tweet URL above</div>)
                    }
                  </div>
                  )
            }
          </div>
        </fieldset>
      </Form>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
