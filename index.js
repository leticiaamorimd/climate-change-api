const PORT = process.envPORT || 8000 
const express = require('express') //call express
const axios = require('axios')
const cheerio = require('cheerio')

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    }
]

const app = express() //save express in the app const 
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title, 
                url,
                source: newspaper.name
            })

    })
})
})

app.get('/', (req, res) => {
    res.json('Welcome to my API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

    axios.get(newspaperAddress).
    then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title, 
                url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`))