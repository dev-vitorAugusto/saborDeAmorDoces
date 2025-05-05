// /api/produtos.js
export default async function handler(req, res) {
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const API_KEY = process.env.API_KEY;
    const SHEET_NAME = 'Página1';
  
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao acessar a planilha.' });
    }
  }
  