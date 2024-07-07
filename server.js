const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
    const data = req.body;

    // Verifique se 'nome' e 'idade' estão definidos e são do tipo correto
    if (typeof data.nome !== 'string' || typeof data.idade !== 'number') {
        return res.status(400).send('Nome deve ser uma string e idade deve ser um número.');
    }

    const browser = await puppeteer.launch({ 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--single-process',
            '--no-zygote'
        ],
        executablePath: process.env.NODE_ENV === 'production' 
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.goto('https://test-next-crud.vercel.app/');

    await page.click('#new-client');
    
    await page.type('[type="text"]', data.nome);
    await page.type('[type="number"]', data.idade.toString()); // Converta idade para string
    
    await page.click('#save');

    await page.waitForNavigation();
    await browser.close();

    res.send('Cadastro realizado com sucesso!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
