import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request:Request){
 const origin=request.headers.get('origin')
 if(origin){
  try{if(new URL(origin).host!==(request.headers.get('host')||new URL(request.url).host))return Response.json({error:'invalid_origin'},{status:403})}
  catch{return Response.json({error:'invalid_origin'},{status:403})}
 }
 if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'too_large'},{status:413})
 let data:any
 try{data=await request.json()}catch{return Response.json({error:'invalid_json'},{status:400})}
 if(data.website)return Response.json({ok:true})
 const name=String(data.name||'').trim(),email=String(data.email||'').trim(),phone=String(data.phone||'').trim(),message=String(data.message||'').trim()
 if(name.length<2||name.length>120||!/^\S+@\S+\.\S+$/.test(email)||email.length>200||phone.length>50||message.length<10||message.length>5000||data.privacyConsent!==true)return Response.json({error:'invalid_fields'},{status:400})
 const payload=await getPayload({config})
 const productId=Number(data.productId),usedMachineId=Number(data.usedMachineId)
 const product=Number.isInteger(productId)&&productId>0?(await payload.find({collection:'products',where:{and:[{id:{equals:productId}},{status:{equals:'published'}}]},limit:1,depth:0})).docs[0]:undefined
 const usedMachine=Number.isInteger(usedMachineId)&&usedMachineId>0?(await payload.find({collection:'used-machines',where:{and:[{id:{equals:usedMachineId}},{status:{equals:'published'}}]},limit:1,depth:0})).docs[0]:undefined
 await payload.create({collection:'inquiries',overrideAccess:true,data:{name,email,phone,message,privacyConsent:true,product:product?.id,usedMachine:usedMachine?.id,handled:false}} as any)
 return Response.json({ok:true},{status:201})
}
