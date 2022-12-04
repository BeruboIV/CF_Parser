const puppeteer = require("puppeteer");
const fs = require("fs");

const contest_id = process.argv[2];

async function scrapeProblem(browser, problem_letter) {
    const url = `https://codeforces.com/contest/${contest_id}/problem/${problem_letter}`;
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });

        const samples_scraped = await page.evaluate((problem_letter) => {
            const samples = document.querySelectorAll(".sample-test")[0].childNodes;
            return Array.from(samples).map((child) => child.innerText);
        }, problem_letter);

        let id = 1;
        // Now we need to store the samples in text format
        samples_scraped.map((ele) => {
            if (ele[0] === "i") {
                // Input
                const input_data = ele.substr(11).trim();
                fs.writeFile(`${problem_letter}-${id}.in`, input_data, (err) => {
                    if (err) throw err;
                });
                return input_data;
            } else {
                // Output
                const output_data = ele.substr(12).trim();
                fs.writeFile(`${problem_letter}-${id}.out`, output_data, (err) => {
                    if (err) throw err;
                });
                id++;
                return output_data;
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function scrapeSite() {
    const url = `https://codeforces.com/contest/${contest_id}`;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle0" });

        // Returns all the problem letters
        const problem_letters = await page.evaluate(() => {
            const table = document.querySelectorAll(".problems")[0];
            const rows = table.rows.length;
            const letters = [];

            for (let i = 1; i < rows; i++) {
                letters.push(table.rows[i].cells[0].innerText);
            }

            return letters;
        });

        const promises = [];

        for (problem_letter of problem_letters) {
            promises.push(scrapeProblem(browser, problem_letter));
        }

        await Promise.all(promises);

        // Parse all the test cases and then close the browser.
        await browser.close();
    } catch (e) {
        console.log(e);
    }
}

scrapeSite();
