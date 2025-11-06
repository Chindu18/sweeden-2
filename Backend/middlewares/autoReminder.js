import cron from "node-cron";
import { Resend } from "resend";
import Booking from "../Models/Booking.js"; // adjust path to your booking model

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Helper: find day difference
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}

// ✅ Helper: send email
async function sendMail(to, subject, html) {
  try {
   await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>", // use verified domain
      to,
      subject,
      html,
    });
    console.log(`📩 Reminder email sent → ${to}`);
  } catch (err) {
    console.error(`❌ Failed to send to ${to}:`, err.message);
  }
}

// ✅ Main job
export function startAutoReminder() {
  // Runs every day at 9 AM (server time)
  cron.schedule("21 16 * * *", async () => {
    console.log("⏰ Running auto email reminder job...");

    const today = new Date();
    const bookings = await Booking.find();

    for (let booking of bookings) {
      const movieDate = new Date(booking.date);
      const diffDays = daysBetween(movieDate, today);

      const seatList =
        booking.seatNumbers && booking.seatNumbers.length
          ? booking.seatNumbers.map((s) => `Row ${s.row}, Seat ${s.seat}`).join(", ")
          : "Not Assigned";

      let subject = "";
      let html = "";

      if (diffDays === 2) {
        subject = `🎬 ${booking.movieName} — 2 Days Left!`;
        html = `
          <div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
            <h2 style="color:#4ea1ff;">Hi ${booking.name},</h2>
            <p>Your movie <strong>${booking.movieName}</strong> is coming up in <b>2 days</b>!</p>
            <p>📅 <b>Date:</b> ${movieDate.toDateString()}<br>
               ⏰ <b>Time:</b> ${booking.timing}<br>
               🎟️ <b>Seats:</b> ${seatList}</p>
            <p>Get ready to enjoy the show 🍿</p>
          </div>`;
      } else if (diffDays === 1) {
        subject = `🎟 ${booking.movieName} — Tomorrow!`;
        html = `
          <div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
            <h2 style="color:#4ea1ff;">Hey ${booking.name},</h2>
            <p>Your movie <strong>${booking.movieName}</strong> is <b>tomorrow</b>!</p>
            <p>📅 <b>Date:</b> ${movieDate.toDateString()}<br>
               ⏰ <b>Time:</b> ${booking.timing}<br>
               🎟️ <b>Seats:</b> ${seatList}</p>
            <p>Don’t forget your popcorn 🎥</p>
          </div>`;
      } else if (diffDays === 0) {
        subject = `🍿 ${booking.movieName} — Today’s the Day!`;
        html = `
          <div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
            <h2 style="color:#4ea1ff;">Hi ${booking.name},</h2>
            <p>It’s showtime! Your movie <strong>${booking.movieName}</strong> is <b>today</b>.</p>
            <p>📅 <b>Date:</b> ${movieDate.toDateString()}<br>
               ⏰ <b>Time:</b> ${booking.timing}<br>
               🎟️ <b>Seats:</b> ${seatList}</p>
            <p>Enjoy the show, ${booking.name}! 💙</p>
          </div>`;
      }

      if (subject && html) await sendMail(booking.email, subject, html);
    }

    console.log("✅ Auto email reminder finished.");
  },
 { timezone: "Asia/Kolkata" }
);
}



//testing
export async function manualTriggerAutoReminder() {
  console.log("⚙️ Running manual test reminder job...");

  const today = new Date();
  const bookings = await Booking.find();

  for (let booking of bookings) {
    const movieDate = new Date(booking.date);
    const diffDays = Math.round(
      (movieDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

    const seatList =
      booking.seatNumbers?.length
        ? booking.seatNumbers.map((s) => `Row ${s.row}, Seat ${s.seat}`).join(", ")
        : "Not Assigned";

    let subject = "";
    let html = "";

    if (diffDays === 2) {
      subject = `🎬 ${booking.movieName} — 2 Days Left!`;
      html = `<div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
                <h2 style="color:#4ea1ff;">Hey ${booking.name},</h2>
                <p>Your movie <strong>${booking.movieName}</strong> is in <b>2 days</b>.</p>
              </div>`;
    } else if (diffDays === 1) {
      subject = `🎟 ${booking.movieName} — Tomorrow!`;
      html = `<div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
                <h2 style="color:#4ea1ff;">Hey ${booking.name},</h2>
                <p>Your movie <strong>${booking.movieName}</strong> is <b>tomorrow</b>.</p>
              </div>`;
    } else if (diffDays === 0) {
      subject = `🍿 ${booking.movieName} — Today!`;
      html = `<div style="font-family:'Segoe UI',sans-serif;background:#0d1117;color:#fff;padding:25px;border-radius:12px;">
                <h2 style="color:#4ea1ff;">Hey ${booking.name},</h2>
                <p>Your movie <strong>${booking.movieName}</strong> is <b>today</b> 🎥</p>
              </div>`;
    }

    if (subject && html) {
      await resend.emails.send({
      from: "MovieZone <noreply@tamilmovie.no>",
        to: booking.email,
        subject,
        html,
      });
      console.log(`📧 Test email sent → ${booking.email}`);
    }
  }

  console.log("✅ Manual test reminder completed.");
}
