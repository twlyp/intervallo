const postgres = require("postgres"),
  sql = postgres("postgres://leo@localhost/intervallo");

async function getUser({ email }) {
  let rows = await sql`
    SELECT id 
    FROM users 
    WHERE email = ${email}
    `;
  if (rows.length > 0) return rows[0].id;
  rows = await sql`
    INSERT INTO users (email)
    VALUES (${email})
    RETURNING id
    `;
  if (rows.length > 0) return rows[0].id;
  return null;
}

function addOtp({ userId, otp }) {
  return sql`
    INSERT INTO otps (userid, otp)
    VALUES (${userId}, ${otp})
  `;
}

async function getOtp({ email }) {
  const rows = await sql`
    SELECT users.id, otps.otp
    FROM otps
    INNER JOIN users
      ON users.id = otps.userid
    WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
      AND email = ${email}
    ORDER BY created_at DESC
    LIMIT 1`;
  if (rows.length > 0) return rows[0];
  return null;
}

module.exports = { getUser, addOtp, getOtp };
