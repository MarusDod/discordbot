const {By,Key,Builder, WebDriver, Capabilities} = require('selenium-webdriver');
const { Executor, HttpClient } = require('selenium-webdriver/http');
require('geckodriver');

(async () => {
    var searchQuery = "pepe"

    //let driver = await new Builder().forBrowser('firefox');

    //#button[aria-label='Agree to the use of cookies and other data for the purposes described']
    //ytd-button-renderer[2]//a[1]//tp-yt-paper-button[1]

    /*
    driver.usingServer('http://localhost:9222/wd/hub')
    await (await driver.build()).get('https://youtube.com')
    
    await driver.wait(10)
    await driver
        .findElement(By.xpath("//button[@aria-label='Agree to the use of cookies and other data for the purposes described']"))
        .click()

    let title = await driver.getTitle()
    console.log(`title: ${title}`);
*/
try{
    let executor = new Executor(new HttpClient('ws://localhost:9222'))
    let driver = new WebDriver(executor)
    await driver.get('https://youtube.com')
    //await driver.quit()
}
catch(error){
    console.error(error)
}

})()