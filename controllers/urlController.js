// USING IT FOR VALIDATING URL RECEIVED IN REQUEST BODY
const shortId = require("shortid"); // USING IT FOR CREATING SHORT ID
const urlModel = require("../models/urlModel"); // REQUIRED THIS MODEL FOR DB-CALLS
//const redis = require("redis"); // USING REDIS PACKAGE FOR CACHING
const { promisify } = require("util"); // USING UTIL PACKAGE FOR CREATING PROMISE
///////////////////////////////////////////////////////




const urlRegex = (value) => { // USING THIS REGEX TO VALIDATE URL PATTERN
let urlRegex = /^(?:(?:(?:https?|http):)?\/\/.*\.(?:png|gif|webp|com|in|org|co|co.in|net|jpeg|jpg))/i;
if (urlRegex.test(value))
return true;
}

const createUrl = async (req, res) => {
try {
let data = req.body

if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Body is empty!" })

if (!urlRegex(data.longUrl)) return res.status(400).send({ status: false, message: "Either the url key or the url entered is incorrect!" })


let uniqueUrl = await urlModel.findOne({ longUrl: data.longUrl }).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 })
if (uniqueUrl) return res.status(200).send({ status: true, data: uniqueUrl })// SEARCHING FOR URL IN DB

let urlCode = shortId.generate().toLocaleLowerCase(); // GENERATING SHORT-ID OF ORIGINAL URL
let shortUrlCode = "http://localhost:3000/" + urlCode // DEFINING THE PATTERN OF SHORT URL
data.urlCode = urlCode
data.shortUrl = shortUrlCode

await urlModel.create(data)

// STORING THE DATA IN CLOUD FOR FURTHER USE

res.status(201).send({ status: true, data: data })

} catch (err) {
return res.status(500).send({ status: false, message: err.message })
}
}


// const getUrl = async (req, res) => {
// try {
// const urlCode = req.params.urlCode //VALIDATING SHORT-ID CODE USING SHORTID PACKAGE
// if (!shortId.isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid URL!" })

// let cache = await GET_ASYNC(`${urlCode}`)
// cache = JSON.parse(cache)
// if (cache) return res.status(302).redirect(cache.longUrl)

// const findUrl = await urlModel.findOne({ urlCode })
// // SEARCHING FOR URL-CODE IN DATABASE IF NOT PRESENT IN CLOUD STORAGE

// if (!findUrl) return res.status(404).send({ status: false, message: "Url not found!" })

// // await SET_ASYNC(`${urlCode}`, JSON.stringify(findUrl)) // STORING THE DATA IN CLOUD FOR FURTHER USE

// return res.status(302).redirect(findUrl.longUrl)

// } catch (err) {
// return res.status(500).send({ status: false, message: err.message })
// }
// }


module.exports = { createUrl }