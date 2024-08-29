import * as React from 'react'
import styles from './Form.module.scss'
import { IFormProps } from './IFormProps'
import { sp } from '@pnp/sp/presets/all'

const Form: React.FC<IFormProps> = (props) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = (event.target as any).message.value.trim()
    const messageType = (event.target as any).subject.value
    if (!message) {
      alert('Please enter a valid message.')
      return
    }

    try {
      const user = await sp.web.currentUser.get()
      const groups = await sp.web.currentUser.groups()

      let listName = ''
      if (groups.some((g) => g.Title === 'Group A')) {
        listName = 'complaintsA'
      } else if (groups.some((g) => g.Title === 'Group B')) {
        listName = 'complaintsB'
      } else if (groups.some((g) => g.Title === 'Group C')) {
        listName = 'complaintsC'
      } else {
        throw new Error('You are not a member of any recognized group.')
      }
      await sp.web.lists.getByTitle(listName).items.add({
        Title: message,
        typeMessage: messageType,
        AuthorName: user.Title,
        AuthorEmail: user.Email,
      })
      alert('Your message has been submitted successfully!')
    } catch (error) {
      console.error('Error submitting form: ', error)
      alert('There was an error submitting your message. Please try again.')
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        Bizimlə əlaqə saxlamaq üçün formanı doldur
      </h2>
      <p>
        Salam. Anketi göndərdiyinizdə, adınız və poçt ünvanınız qeyd
        olunacaqdır.
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Mövzu *</label>
          <div className={styles.radioGroup}>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="proposal"
                name="subject"
                value="Təklif"
                defaultChecked
              />
              <label htmlFor="proposal">Təklif</label>
            </div>
            <div className={styles.radioOption}>
              <input
                type="radio"
                id="complaint"
                name="subject"
                value="Şikayət"
              />
              <label htmlFor="complaint">Şikayət</label>
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Mesaj *</label>
          <textarea
            id="message"
            name="message"
            placeholder="Enter your answer"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Göndər
        </button>
      </form>
    </div>
  )
}

export default Form
