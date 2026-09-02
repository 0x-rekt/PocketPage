import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin:["*"]}))

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`)
})