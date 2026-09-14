import { contactLinks } from '../../lib/config'
import { useId, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { Rollover } from '../shared/rollover'

const control = 'block w-full min-w-0 border-[0.361px] border-[#1a1a1a]/[0.17] bg-[#eef2ff]/50 p-[8.674px] font-sans text-[12px] leading-[15.902px] text-ink placeholder:text-[#1a1a1a]/50 max-md:min-h-11'

function Root({ children }: { children: ReactNode }) {
  const statusId = useId()
  const [status, setStatus] = useState('')
  return (
    <form
      aria-label="Project inquiry" aria-describedby={statusId}
      className="**:focus-visible:outline-brand! **:focus-visible:outline-offset-0! min-h-[547px] rounded-[10px] bg-white pt-[29.21px] pr-[37.559px] pb-[34px] pl-[40.69px] text-[#1a1a1a] max-md:px-5"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const subject = `Project inquiry: ${data.get('project')}`
        const body = [
          `Name: ${data.get('firstName')} ${data.get('lastName')}`,
          `Email: ${data.get('email')}`,
          `Phone: ${data.get('phone') || 'Not provided'}`,
          `Project: ${data.get('project')}`,
          `Role: ${data.get('role')}`,
          '', String(data.get('message') || ''),
        ].join('\n')
        window.location.href = `${contactLinks.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        setStatus('Your email app will open with your message. Send it there to contact our team.')
      }}
    >
      {children}
      <p id={statusId} role="status" className="sr-only">{status || 'Opens your email app to send your message.'}</p>
    </form>
  )
}

function Field({ label, ...props }: ComponentProps<'input'> & { label: string }) {
  const id = useId()
  return <label htmlFor={id}><span className="sr-only">{label}</span><input {...props} id={id} placeholder={label} className={`${control} h-[33.972px] rounded-full`} /></label>
}

function Project() {
  const id = useId()
  return (
    <label htmlFor={id} className="relative mt-[9.848px] block">
      <span className="sr-only">What’s your project</span>
      <select id={id} name="project" required defaultValue="" className={`${control} h-[35.418px] rounded-full appearance-none pr-10`}>
        <option value="" disabled>What’s your project</option>
        <option>Emergency response</option><option>Slope stabilization</option><option>Roadway and drainage</option><option>Infrastructure planning</option><option>Other</option>
      </select>
      <img src="/contact-page/select-arrow.svg" alt="" width="18" height="18" className="pointer-events-none absolute right-[8.674px] top-1/2 size-[17.348px] -translate-y-1/2" />
    </label>
  )
}

function Roles() {
  return (
    <fieldset className="mt-[9.491px]">
      <legend className="text-[12px] leading-[15.902px]">How would you describe yourself</legend>
      <div className="mt-[12.309px] grid grid-cols-2 gap-x-[17.348px] gap-y-[10.12px] max-[480px]:grid-cols-1">
        {['Property owner', 'Government agency', 'Developer', 'Engineering / design consultant', 'General contractor / subcontractor', 'Other'].map((role) => (
          <label key={role} className="flex min-h-[17.348px] cursor-pointer items-center gap-[8.674px] text-[12px] leading-[15.902px] max-md:min-h-10">
            <input type="radio" name="role" value={role} required className="size-[13.011px] shrink-0 accent-brand max-md:size-4" />{role}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Message() {
  const id = useId()
  return <label htmlFor={id} className="mt-[38.216px] block"><span className="sr-only">Tell us about your project</span><textarea id={id} name="message" required maxLength={4000} placeholder="Tell us about your project" className={`${control} h-[130.108px] min-h-[130.108px] resize-y rounded-[10.433px]`} /></label>
}

function Consent() {
  return <label className="mt-[9.702px] flex min-h-[24.576px] cursor-pointer items-start gap-[5.783px] pb-[11.565px] text-[12px] leading-[13.011px] max-md:min-h-11"><input type="checkbox" name="terms" required className="size-[13.011px] accent-brand max-md:size-4" />I agree to the terms</label>
}

function Submit() {
  return <button type="submit" className="mt-[18.144px] inline-flex h-[30px] min-w-[95px] items-center justify-center rounded-[5px] bg-brand px-[13px] font-display text-[14px] leading-[22px] text-white max-md:min-h-11"><Rollover reveal={false}>Submit</Rollover></button>
}

export const ContactForm = { Root, Field, Project, Roles, Message, Consent, Submit }
