const puppeteer = require("puppeteer");
const fs = require("fs");
require('dotenv').config();

const contest_id = process.argv[2];

async function login(browser, page) {
    const url = `https://atcoder.jp/login?continue=https%3A%2F%2Fatcoder.jp%2F`;
    console.log("Logging in..", url);
    try {
        await page.goto(url, { waitUntil: "networkidle0" });

        await page.type('#username', process.env.USERNAME);
        await page.type("#password", process.env.PASSWORD);
        await page.click("#submit");

    } catch (e) {
        console.log("Login failed...");
        console.log(e);
    }
}

async function scrapeProblem(browser, Problem) {
    const url = Problem.Url;
    console.log(url);
    try {
        // const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // await login(browser, page);
        await page.goto(url, { waitUntil: "networkidle0" });

        const samples_scraped = await page.evaluate(() => {
            const samples = document.querySelectorAll("pre");
            const scraped = Array.from(samples).filter((child) => {
                return child.id !== "";
            });
            let num_scraped = scraped.length;
            // The elements were repeated twice, so remove the extra elements
            for (let i = 0; i < num_scraped / 2; i++) scraped.pop();
            return scraped.map((ele) => ele.innerText);
            // return Array.from(samples).map((child) => child.innerText);
        });

        let id = 1;
        // Now we need to store the samples in text format
        samples_scraped.map((ele, idx) => {
            if (idx % 2 == 0) {
                // Input
                fs.writeFile(`${Problem.Problem_letter}-${id}.in`, ele, (err) => {
                    if (err) throw err;
                });
            } else {
                // Output
                fs.writeFile(`${Problem.Problem_letter}-${id}.out`, ele, (err) => {
                    if (err) throw err;
                });
                id++;
            }
            return ele;
        });

        // await browser.close();

    } catch (e) {
        console.log(e);
    }
}

async function scrapeSite() {
    const url = `https://atcoder.jp/contests/${contest_id}/tasks`;
    console.log(url);
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await login(browser, page);
        await page.goto(url, { waitUntil: "networkidle0" });

        // await page.screenshot({ path: "./screenshot.png", fullPage: true});

        // Returns all the problem letters
        const problems = await page.evaluate(() => {
            const table = document.querySelectorAll("table")[0];
            const rows = table.rows.length;
            const letters = [];

            for (let i = 1; i < rows; i++) {
                letters.push({Problem_letter: table.rows[i].cells[0].innerText, Url: table.rows[i].cells[0].firstChild.href });
            }

            return letters;
        });

        console.log(problems);
        const promises = []

        for (problem of problems) {
            promises.push(scrapeProblem(browser, problem));
        }

        await Promise.all(promises);    // All the promises must be resolved before closing the browser

        await browser.close();

    } catch (e) {
        console.log(e);
    }
}

scrapeSite();
