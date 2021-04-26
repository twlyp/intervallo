const postgres = require("postgres"),
  sql = postgres("postgres://leo@localhost/intervallo");

async function getUserId({ email }) {
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

async function getUserProfile({ userId }) {
  const [user] = await sql`
    SELECT id, name, email, answers
    FROM users
    WHERE id = ${userId}`;
  console.log("userId:", userId);
  if (!user) return null;
  user.answers = JSON.parse(user.answers);
  return user;
}

async function addOtp({ userId, otp }) {
  return await sql`
    INSERT INTO otps (userid, otp)
    VALUES (${userId}, ${otp})
  `;
}

async function checkOtp({ email }) {
  const rows = await sql`
    SELECT users.id, users.email, users.name, otps.otp
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

module.exports = { getUserId, addOtp, checkOtp, getUserProfile };
