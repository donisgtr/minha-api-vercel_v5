export default function handler(req, res) {
    // Define o tipo de resposta como JSON
    res.status(200).json({ message: 'Olá, mundo!' });
  }
  