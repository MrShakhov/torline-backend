const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const cheerio = require('cheerio');

router
    .get('/torrents', (req, res) => {
        const { title, year } = req.query;
        const baseUrl = 'http://kinozal.tv/browse.php';

        request({
            url: `${baseUrl}?s=${title}&d=${year}`,
            transform: html => cheerio.load(html)
        })
            .then($ => {
                const torrents = [];

                $('tr.bg')
                    .each((elem) => {
                        const torrent = {
                            title: elem('.num a').text(),
                            url: elem('.num a').attr('href'),
                            size: elem('td:nth-child(4)').text(),
                            seeds: elem('.sl_s').text(),
                            peers: elem('.sl_p').text()

                        };
                        torrents.push(torrent);
                    });

                res.send(torrents);
            })
            .catch(err => console.log(err));
    });

module.exports = router;
