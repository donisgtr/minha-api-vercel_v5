import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const executablePath = await chrome.executablePath;

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: executablePath || '/usr/bin/chromium-browser',
    headless: chrome.headless,
  });

  const page = await browser.newPage();
  
  await page.goto('https://cliente.apdata.com.br/dicon/', {
    waitUntil: 'networkidle2',
  });

  // Clicando no botão de aceitar cookies
  await page.waitForSelector('#button-1020');
  await page.click('#button-1020');

  // Preencher o input de usuário
  await page.waitForSelector('#ext-156');
  await page.click('#ext-156');
  await page.type('#ext-156', '2738045');

  // Preencher o input de senha
  await page.waitForSelector('#ext-155');
  await page.click('#ext-155');
  await page.type('#ext-155', 'Public@99');

  // Clicar no botão de login
  await page.waitForSelector('#ext-151');
  await page.click('#ext-151');

  try {
    await page.waitForNavigation({ timeout: 90000, waitUntil: 'networkidle2' });
  } catch (error) {
    console.error('Navigation error:', error.message);
    res.status(500).json({ error: 'Erro na navegação' });
    await browser.close();
    return;
  }

  // Tirar um screenshot
  const screenshot = await page.screenshot({ encoding: 'base64' });

  await browser.close();

  // Retornar a imagem como resposta
  res.setHeader('Content-Type', 'image/png');
  res.status(200).send(Buffer.from(screenshot, 'base64'));
}
