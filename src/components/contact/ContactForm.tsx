import { cn } from '../../lib/cn'
import { contactSchema, projectTypes, contactRoles } from '../../lib/schemas/contact'
import { createContactEmail } from '../../lib/contact'
import { useId, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { Rollover } from '../shared/rollover'

const focus = 'focus-visible:outline-brand! focus-visible:outline-offset-0!'

const control = `block w-full min-w-0 border border-ink/20 bg-indigo-50/50 px-3 py-2 text-caption leading-4 text-ink placeholder:text-ink/50 ${focus}`

function Root({ children }: { children: ReactNode }) {
  const statusId = useId()
  const [status, setStatus] = useState('')
  return (
    <form
      aria-label="Project inquiry"
      aria-describedby={statusId}
      className="rounded-card bg-white p-5 text-ink md:px-10 md:py-8"
      noValidate
      onInput={(event) => {
        const target = event.target
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLSelectElement ||
          target instanceof HTMLTextAreaElement
        )
          target.setCustomValidity('')
      }}
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        const result = contactSchema.safeParse(Object.fromEntries(new FormData(form)))
        if (!result.success) {
          const issue = result.error.issues[0]
          const field = form.querySelector<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >(`[name="${String(issue.path[0])}"]`)
          if (field) {
            field.setCustomValidity(issue.message)
            field.reportValidity()
            field.focus()
          }
          return
        }
        window.location.href = createContactEmail(result.data)
        setStatus('Your email app will open with your message. Send it there to contact our team.')
      }}
    >
      {children}
      <p id={statusId} role="status" className="sr-only">
        {status || 'Opens your email app to send your message.'}
      </p>
    </form>
  )
}

function Field({ label, ...props }: ComponentProps<'input'> & { label: string }) {
  const id = useId()
  return (
    <label htmlFor={id}>
      <span className="sr-only">{label}</span>
      <input {...props} id={id} placeholder={label} className={cn(control, "rounded-full")} />
    </label>
  )
}

function Project() {
  const id = useId()
  return (
    <label htmlFor={id} className="relative mt-2.5 block">
      <span className="sr-only">What’s your project</span>
      <select
        id={id}
        name="project"
        required
        defaultValue=""
        className={cn(control, "rounded-full appearance-none pr-10")}
      >
        <option value="" disabled>
          What’s your project
        </option>
        {projectTypes.map((project) => (
          <option key={project}>{project}</option>
        ))}
      </select>
      <img
        src="/contact-page/select-arrow.svg"
        alt=""
        width="18"
        height="18"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2"
      />
    </label>
  )
}

function Roles() {
  return (
    <fieldset className="mt-3">
      <legend className="text-caption leading-4">How would you describe yourself</legend>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 max-[480px]:grid-cols-1">
        {contactRoles.map((role) => (
          <label
            key={role}
            className="flex min-h-5 cursor-pointer items-center gap-2 text-caption leading-4 max-md:min-h-10"
          >
            <input
              type="radio"
              name="role"
              value={role}
              required
              className={cn("size-3.5 shrink-0 accent-brand", focus)}
            />
            {role}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Message() {
  const id = useId()
  return (
    <label htmlFor={id} className="mt-8 block">
      <span className="sr-only">Tell us about your project</span>
      <textarea
        id={id}
        name="message"
        required
        maxLength={4000}
        placeholder="Tell us about your project"
        className={cn(control, "h-32 min-h-32 resize-y rounded-card")}
      />
    </label>
  )
}

function Consent() {
  return (
    <label className="mt-3 flex min-h-6 cursor-pointer items-center gap-2 text-caption leading-4">
      <input
        type="checkbox"
        name="terms"
        required
        className={cn("size-3.5 accent-brand", focus)}
      />
      I agree to the terms
    </label>
  )
}

function Submit() {
  return (
    <button
      type="submit"
      className={cn(
        "mt-4 inline-flex min-h-8 items-center justify-center rounded-md bg-brand px-4 font-display text-small leading-5.5 text-white",
        focus,
      )}
    >
      <Rollover reveal={false}>Submit</Rollover>
    </button>
  )
}

export const ContactForm = { Root, Field, Project, Roles, Message, Consent, Submit }
