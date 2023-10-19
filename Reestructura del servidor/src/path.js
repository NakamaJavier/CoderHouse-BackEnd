import { fileURLToPath } from "url"
import { dirname } from "path"

export const __filename = fileURLToPath(import.meta.url) //convierte la url de donde esta el index a una variable path
export const __dirname = dirname(__filename) //da el path de la carpeta padre del path __filename