import { businessesMock } from "./mocks/businessesMock.js"
import { loopOverBusinesses } from "./services/loopOverBusinesses.js"
import { pullData } from "./services/pullData.js"

// const businesses = await pullData()

const businesses = businessesMock

await loopOverBusinesses(businesses)
