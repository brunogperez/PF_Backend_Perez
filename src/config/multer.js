import multer from 'multer'

const storage = multer.diskStorage({})

const uploader = multer({storage})

export {uploader}