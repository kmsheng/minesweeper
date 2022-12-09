import isDef from '@/utils/isDef'

export default function pick(obj: object, props: Array<string>) {
  return props.reduce((o, prop) => {
    const value = (obj as any)[prop]
    if (isDef(value)) {
      o[prop] = value
    }
    return o
  }, Object.create(null))
}
