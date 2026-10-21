'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function QuoteForm({productId,usedMachineId}:{productId?:number|string;usedMachineId?:number|string}){
 const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle')
 const [error,setError]=useState('')
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setState('sending');setError('')
  const form=event.currentTarget;const data=new FormData(form)
  const body={name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||''),message:String(data.get('message')||''),privacyConsent:data.get('privacyConsent')==='yes',website:String(data.get('website')||''),productId,usedMachineId}
  try{const response=await fetch('/api/ajanlatkeres',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});if(!response.ok)throw new Error('Kérjük, próbálja meg újra.');setState('sent');form.reset()}
  catch(e){setError(e instanceof Error?e.message:'Az ajánlatkérés nem sikerült.');setState('error')}
 }
 if(state==='sent')return <div className="quote-success" role="status"><h2>Köszönjük az érdeklődést!</h2><p>Az ajánlatkérést rögzítettük.</p><Link href="/termekek">Vissza a termékekhez</Link></div>
 return <form className="contact-form quote-form" onSubmit={submit}><label>Név<input name="name" autoComplete="name" maxLength={120} required/></label><label>E-mail cím<input name="email" type="email" autoComplete="email" maxLength={200} required/></label><label>Telefonszám<input name="phone" autoComplete="tel" maxLength={50}/></label><label>Üzenet<textarea name="message" rows={6} minLength={10} maxLength={5000} required/></label><label className="quote-consent"><input type="checkbox" name="privacyConsent" value="yes" required/><span>Elolvastam az <a href="/tartalom/adatvedelmiadatkezelesiszab.pdf" target="_blank" rel="noopener noreferrer">adatkezelési tájékoztatót</a>, és hozzájárulok az adataim kezeléséhez az ajánlatkérés megválaszolása érdekében.</span></label><label className="sr-only" aria-hidden="true">Weboldal<input name="website" tabIndex={-1} autoComplete="off"/></label>{error&&<p role="alert" className="quote-error">{error}</p>}<button className="button button-red" type="submit" disabled={state==='sending'}>{state==='sending'?'Küldés…':'Ajánlatkérés elküldése'}</button></form>
}
