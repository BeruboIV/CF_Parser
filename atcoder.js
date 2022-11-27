const puppeteer = require("puppeteer");
const fs = require("fs");

const contest_id = process.argv[2];

async function scrapeProblem(problem_letter) {
    const url = `https://atcoder.jp/contests/${contest_id}/tasks/${contest_id}_${problem_letter.toLowerCase()}`;
    console.log(url);
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });

        const samples_scraped = await page.evaluate(() => {
            const samples = document.querySelectorAll("pre");
            const scraped = Array.from(samples).filter((child) => {
                return child.id !== "";
            });
            let num_scraped = scraped.length;
            for (let i = 0; i < num_scraped / 2; i++) scraped.pop();
            return scraped.map((ele) => ele.innerText);
            // return Array.from(samples).map((child) => child.innerText);
        });

        let id = 1;
        // Now we need to store the samples in text format
        samples_scraped.map((ele, idx) => {
            if (idx % 2 == 0) {
                // Input
                fs.writeFile(`${problem_letter}-${id}.in`, ele, (err) => {
                    if (err) throw err;
                });
            } else {
                // Output
                fs.writeFile(`${problem_letter}-${id}.out`, ele, (err) => {
                    if (err) throw err;
                });
                id++;
            }
            return ele;
        });
        await browser.close();
    } catch (e) {
        console.log(e);
    }
}

async function scrapeSite() {
    const url = `https://atcoder.jp/contests/${contest_id}/tasks`;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });

        // Returns all the problem letters
        const problem_letters = await page.evaluate(() => {
            const table = document.querySelectorAll("table")[0];
            const rows = table.rows.length;
            const letters = [];

            for (let i = 1; i < rows; i++) {
                letters.push(table.rows[i].cells[0].innerText);
            }

            return letters;
        });

        for (problem_letter of problem_letters) {
            scrapeProblem(problem_letter);
        }

        await browser.close();
    } catch (e) {
        console.log(e);
    }
}

scrapeSite();
