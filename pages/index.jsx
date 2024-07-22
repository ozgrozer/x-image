import Head from 'next/head'
import React, { useState } from 'react'
import { Form, Input, Select } from 'rfv'

const validations = {
  empty: [
    {
      rule: 'isLength',
      args: { min: 1 },
      invalidFeedback: 'Please provide a value'
    }
  ]
}

export default () => {
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
    setImageData(res.data.data)
  }

  const saveBase64AsFile = (base64, fileName) => {
    const link = document.createElement('a')
    document.body.appendChild(link)
    link.setAttribute('type', 'hidden')
    link.href = `data:text/plain;base64, ${base64}`
    link.download = fileName
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <Head>
        <title>X Image</title>
      </Head>

      <Form
        onSubmit={onSubmit}
        postSubmit={postSubmit}
        postOptions={{ method: 'post', url: '/api/get-image' }}
      >
        <fieldset disabled={formIsSubmitting}>
          <div className='narrowInputs one'>
            <div className='inputWrapper'>
              <label htmlFor='xUrl'>X URL</label>
              <div className='inputWithButton'>
                <Input
                  type='text'
                  id='xUrl'
                  name='xUrl'
                  validations={validations.empty}
                  placeholder='https://x.com/ozgrozer/status/1812591967756255298'
                />

                <button type='submit' className='submitButton'>
                  <i className='icon icon-navigate_next' />
                </button>
              </div>
            </div>
          </div>

          <div className='narrowInputs two'>
            <div className='inputWrapper'>
              <label htmlFor='width'>Width</label>
              <Input
                id='width'
                type='text'
                name='width'
                value='1000'
                placeholder='1000'
                validations={validations.empty}
              />
            </div>

            <div className='inputWrapper'>
              <label htmlFor='padding'>Padding</label>
              <Input
                value='25'
                type='text'
                id='padding'
                name='padding'
                placeholder='50'
                validations={validations.empty}
              />
            </div>
          </div>

          <div className='narrowInputs three'>
            <div className='inputWrapper'>
              <label htmlFor='theme'>Theme</label>
              <Select id='theme' name='theme' value='light'>
                <option value='light'>Light</option>
                <option value='dark'>Dark</option>
              </Select>
            </div>

            <div className='inputWrapper'>
              <label htmlFor='hideCard'>Hide Card</label>
              <Select id='hideCard' name='hideCard' value='false'>
                <option value='true'>True</option>
                <option value='false'>False</option>
              </Select>
            </div>

            <div className='inputWrapper'>
              <label htmlFor='hideThread'>Hide Thread</label>
              <Select id='hideThread' name='hideThread' value='true'>
                <option value='true'>True</option>
                <option value='false'>False</option>
              </Select>
            </div>
          </div>

          <div className='generatedImageWrapper'>
            {
              imageData
                ? (
                  <div>
                    <img
                      className='generatedImage'
                      src={`data:image/png;base64,${imageData}`}
                    />

                    <button
                      type='button'
                      className='saveImageButton'
                      onClick={() => saveBase64AsFile(imageData, 'x.png')}
                    >
                      <i className='icon icon-file_download' />
                    </button>
                  </div>
                  )
                : (
                  <div className='helpText'>
                    {
                      formIsSubmitting
                        ? (<div>Loading...</div>)
                        : (<div>Type the X URL above</div>)
                    }
                  </div>
                  )
            }
          </div>
        </fieldset>
      </Form>

      <div className='socials'>
        <a href='https://github.com/ozgrozer/x-image' target='_blank' rel='noreferrer'>
          <i className='icon icon-github' />
        </a>

        <a href='https://x.com/ozgrozer' target='_blank' rel='noreferrer'>
          <i className='icon icon-x' />
        </a>
      </div>
    </div>
  )
}
