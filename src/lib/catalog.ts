type Related={id:number|string;slug?:string;parent?:number|string|Related|null;catalogRole?:string}
type Category={id:number|string;slug:string;parent?:number|string|Related|null;catalogRole?:string}
type Family={id:number|string;slug:string;category?:number|string|Related|null}
type Product={slug:string;category?:Array<number|string|Related>|null;family?:number|string|Related|null}
const idOf=(value:number|string|Related|null|undefined)=>typeof value==='object'&&value?String(value.id):String(value||'')
export const catalogCategories=<T extends Category>(categories:T[])=>categories.filter(c=>c.catalogRole==='catalog')
export function categoryHref(category:Category,categories:Category[]){
 const parent=categories.find(c=>String(c.id)===idOf(category.parent))
 return parent?`/termekek/${parent.slug}/${category.slug}`:`/termekek/${category.slug}`
}
export function familyHref(family:Family,categories:Category[]){
 const cat=categories.find(c=>String(c.id)===idOf(family.category))
 return cat?`${categoryHref(cat,categories)}/${family.slug}`:'/termekek'
}
export function productHref(product:Product,categories:Category[],families:Family[]=[]){
 const cat=(product.category||[]).map(ref=>categories.find(c=>String(c.id)===idOf(ref))).find(Boolean)
 if(!cat)return `/termekek/${product.slug}`
 const family=families.find(f=>String(f.id)===idOf(product.family))
 return `${categoryHref(cat,categories)}${family?`/${family.slug}`:''}/${product.slug}`
}
