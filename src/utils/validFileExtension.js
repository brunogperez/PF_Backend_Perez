export const validFileExtension = (name = '') => {

  const valid = ['png', 'jpg', 'jpeg']

  const validExtension = name.split('.')

  const extension = validExtension[validExtension.length - 1]

  if (valid.includes(extension.toLocaleLowerCase()))
    return true
  return false
}