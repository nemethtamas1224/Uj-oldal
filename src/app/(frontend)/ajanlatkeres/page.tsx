import { getPayload } from 'payload'
import config from '@payload-config'
import QuoteForm from './quote-form'

export const dynamic='force-dynamic'
export default async function QuotePage({searchParams}:{searchParams:Promise<{termek?:string;hasznalt?:string}>}){
 const {termek,hasznalt}=await searchParams;const payload=await getPayload({config})
 const product=termek?(await payload.find({collection:'products',where:{and:[{slug:{equals:termek}},{status:{equals:'published'}}]},limit:1,depth:0})).docs[0]:undefined
 const used=hasznalt?(await payload.find({collection:'used-machines',where:{and:[{slug:{equals:hasznalt}},{status:{equals:'published'}}]},limit:1,depth:0})).docs[0]:undefined
 return <main className="plain-page wrap quote-page"><p className="eyebrow">RM Hajdú Hungary</p><h1>Ajánlatkérés</h1>{product&&<p className="lead">Termék: <strong>{product.name}</strong></p>}{used&&<p className="lead">Használt gép: <strong>{used.title}</strong></p>}<QuoteForm productId={product?.id} usedMachineId={used?.id}/></main>
}
