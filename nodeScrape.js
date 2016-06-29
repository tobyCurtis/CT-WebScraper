//include the libraries needed for the project
var request = require('request'),
    cheerio = require('cheerio'),
    jsonFormat = require('json-format'),
    fs = require('fs');

//declare local variables that will be used
var titles = [],
    imgUrl = [],
    author = [],
    price = [],
    books = [],
    holder = '';

//grab the html for the page to scrape
request('https://origin-web-scraping.herokuapp.com', function(error, response, body) {
    if (!error && response.statusCode == 200) {

        //load the body and take out extra whitespace
        var $ = cheerio.load(body, {
            normalizeWhitespace: true
        });

        //grab all the titles
        $('.panel-heading').each(function(i, elem) {
            //take out whitespace that was not normalized by cheerio
            holder = $(this).text();
            titles[i] = holder.trim();
        });

        //grab all the image urls
        $('.panel-body img').each(function(i, elem) {
            imgUrl[i] = $(this).attr('src');
        });

        //grab all the authors
        $('.panel-body p').each(function(i, elem) {
            author[i] = $(this).text();
        });

        //grab all prices
        $('.panel-body small').each(function(i, elem) {
            price[i] = $(this).text();
        });

        //organize all the data into objects
        for (var i = 0; i < titles.length; i++) {
            books.push({
                name: titles[i],
                imageUrl: imgUrl[i],
                author: author[i],
                price: price[i]
            });
        }

        //use json formatter to format objects into readable json, and use the filesystem module to wrtie this to a file 
        fs.writeFile('books.json', jsonFormat(books), function(err) {
            if (err) throw err;

            //notify the user that the operation is complete
            console.log('Json Written to file');
        });

    }
});
