export default function sendHtmlResponse(res, status, title, message) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          background-color: #f4f4f4;
          display: flex;
          justify-content: center; 
          align-items: center;    
          min-height: 100vh;      
          margin: 0;
        }
        .container {
          background-color: white;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 90%; 
          text-align: center;
        }
        h1 {
          color: #333;
          font-size: 1.5em;
        }
        p {
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="container">
          <h1>${title}</h1>
          <p>${message}</p>
      </div>
    </body>
    </html>
  `;
  return res
    .status(status)
    .setHeader("Content-Type", "text/html")
    .send(htmlContent);
}
