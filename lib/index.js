import inquirer from "inquirer";
import chalk from "chalk";
import fetch from "node-fetch";
const wait = (seconds = 2000) => new Promise((res) => setTimeout(res, seconds));
const welcome = async () => {
    await wait();
    console.log(chalk.blue("Currency Converter\n\nGet the latest exchange rates 🤑🤑\n"));
    await wait();
    console.log(chalk.yellow("How to use?\nEnter the total amount you want to convert\nEnter currency that you want to convert from,e.g: (USD, GBP, PKR, ...)\nEnter currency that you want to convert To,e.g: (USD, GBP, PKR, ...)\n"));
};
const key = { apiKey: "" };
const getUserInput = async () => {
    const amount = await inquirer.prompt([
        {
            name: "amount:",
            type: "input",
            message: "Amount:",
            validate: (input) => {
                if (!Number(input)) {
                    return "invalid amount";
                }
                else
                    return true;
            },
        },
    ]);
    const from = await inquirer.prompt([
        {
            name: "From:",
            type: "input",
            message: "From:",
            validate: (input) => {
                if (Number(input) || input.length != 3) {
                    return "invalid currency code";
                }
                else
                    return true;
            },
        },
    ]);
    const to = await inquirer.prompt([
        {
            name: "To:",
            type: "input",
            message: "To:",
            validate: (input) => {
                if (Number(input) || input.length != 3) {
                    return "invalid currency code";
                }
                else
                    return true;
            },
        },
    ]);
    try {
        const response = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to["To:"]}&from=${from["From:"]}&amount=${amount["amount:"]}`, {
            method: "GET",
            redirect: "follow",
            headers: key,
        });
        if (!response.ok) {
            throw new Error("Error fetching data!");
        }
        const data = await response.json();
        const rate = data.info.rate;
        const result = data.result;
        const convertedFrom = data.query.from;
        const convertedTo = data.query.to;
        console.log(`\n${chalk.yellow("Converted")}\n${chalk.green(convertedFrom)} ${chalk.white("TO")} ${chalk.green(convertedTo)}
      \nConverted Amount: ${chalk.blue(result)}\nConversion Rate: ${chalk.blue(rate)}\n`);
    }
    catch (error) {
        console.log(chalk.red("Error! Invalid Currency code"));
    }
};
let isValid = false;
const continueConversion = async () => {
    const continueProcess = await inquirer.prompt({
        name: "continue:",
        type: "confirm",
        message: "Do you want to convert another currency:",
    });
    isValid = continueProcess["continue:"];
};
console.clear();
await welcome();
do {
    console.log("");
    await getUserInput();
    await continueConversion();
} while (isValid);
