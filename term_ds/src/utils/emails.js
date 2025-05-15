export function emailReg(token) {
  return `<!DOCTYPE html>
    <html lang="uk">
    <head>
      <meta charset="UTF-8" />
      <title>Активація профілю</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Дякуємо за реєстрацію!</h2>
        <p style="color: #555;">Щоб активувати ваш профіль, будь ласка, натисніть на кнопку нижче:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${import.meta.env.VITE_BASE_URL}/activate/${token}" 
            style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Активувати профіль
          </a>
        </p>
        <p style="color: #777; font-size: 14px;">Якщо ви не реєструвались на нашому сайті, просто проігноруйте цей лист.</p>
        <p style="color: #999; font-size: 12px;">З повагою,<br>Команда підтримки</p>
      </div>
    </body>
    </html>
`;
}