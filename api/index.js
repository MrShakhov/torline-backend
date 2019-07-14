const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const cheerio = require('cheerio');

router
    .get('/torrents', (req, res) => {
        const { title, year, page } = req.query;
        if (!title) return res.sendStatus(400);

        // Preparing the url
        let url = `http://kinozal.tv/browse.php?s=${title}`;
        if (year) url += `&d=${year}`;
        if (page) url += `&page=${page}`;

        // Search torrents on kinozal.tv
        request({
            url,
            transform: html => cheerio.load(html)
        })
            .then($ => {
                // Parsing of search results amount
                let totalResults = +$('.tables1 tr:last-child td')
                    .text()
                    .replace(/[^\d]/g, '');

                // Preparing results object
                const result = {
                    totalResults,
                    totalPages: 0,
                    page: 0,
                    torrents: []
                };

                if (!totalResults) return res.send(result);

                // Parsing of pages amount and current page
                const paginator = $('.paginator');
                if (paginator.length) {
                    result.totalPages = +paginator.find('li:nth-last-child(2) a').text();
                    result.page = paginator.find('li.current a').text() - 1;
                } else {
                    result.totalPages = 1;
                }

                // Parsing of data about torrents
                $('tr.bg')
                    .each((i, elem) => {
                        const torrent = {
                            title: $('.nam a', elem).text(),
                            url: $('.nam a', elem).attr("href"),
                            size: $('td:nth-child(4)', elem).text(),
                            seeds: $('.sl_s', elem).text(),
                            peers: $('.sl_p', elem).text()
                        };
                        result.torrents.push(torrent);
                    });

                res.send(result);
            })
            .catch(() => res.sendStatus(500));
    });

module.exports = router;
