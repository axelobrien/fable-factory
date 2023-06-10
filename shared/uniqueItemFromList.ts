function uniqueItemFromList<T>(list: T[], item?: T): T {
  if (list.length === 1) 
    return list[0]

  let newItem = list[Math.floor(Math.random() * list.length)]

  if (newItem === item) 
    newItem = uniqueItemFromList(list, item)

  return newItem
}

export default uniqueItemFromList
