const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    const data = req.body;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://test-next-crud.vercel.app/');

    await page.click('#new-client');
    
    await page.type('[type="text"]', data.nome);
    await page.type('[type="number"]', data.idade);
    
    await page.click('#save');

    await page.waitForNavigation();
    await browser.close();

    res.send('Cadastro realizado com sucesso!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});