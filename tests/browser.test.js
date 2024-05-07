const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 5000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

// Test that the stack is empty in the beginning
test('The stack should be empty in the beginning', async () => {
    jest.setTimeout(5000);
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

// Describe block for testing stack operations
describe('Stack Operations', () => {
    // Test pushing an item onto the stack
    test('Pushing an item onto the stack', async () => {
        let pushButton = await driver.findElement(By.id('push'));
        await pushButton.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
        
        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        expect(stack).toEqual("Bananer");
    });

    // Test peeking at the top of the stack
    test('Peeking at the top of the stack', async () => {
        let peekButton = await driver.findElement(By.id('peek'));
        await peekButton.click();

        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        // Assert that the stack is still "Bananer" since we haven't popped it
        expect(stack).toEqual("Bananer");
    });

    // Test popping an item from the stack
    test('Popping an item from the stack', async () => {
        let popButton = await driver.findElement(By.id('pop'));
        await popButton.click();

        // The stack should be empty after popping
        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        expect(stack).toEqual("n/a");
    });
});

describe('Test error situations', () => {
    test('Peek empty stack', async () => {
        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        expect(stack).toEqual("n/a");
    })

    test('Pop empty stack', async () => {
        let popButton = await driver.findElement(By.id('pop'));
        await popButton.click();
        let text = await driver.switchTo.alert();
        expect(text).toEqual("Tog bort undefined");
    })
})