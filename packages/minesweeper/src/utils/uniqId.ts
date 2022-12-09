const map = new Map()

export default function uniqId(key = '') {
  let value = map.get(key) || 0
  const id = `${key}-${value++}`
  map.set(key, value)
  return id
}
