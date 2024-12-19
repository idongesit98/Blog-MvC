//This function calculates the reading time of the blog article
const calculateReadingTime = (text) => {
    const wordPerMin = 200;
    const article = text.trim().split(/\s+/).length
    const readingTime = Math.ceil(article/wordPerMin)
    return readingTime
}

module.exports = {calculateReadingTime}