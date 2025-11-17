import pool from './config/database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Hash passwords
    const password1 = await bcrypt.hash('juanchito123', 10);
    const password2 = await bcrypt.hash('joseph456', 10);
    const password3 = await bcrypt.hash('roro12345', 10);

    // Insert users
    console.log('👥 Creating users...');
    await pool.query(`
      INSERT INTO users (email, password_hash, role, name, phone, address) 
      VALUES 
        ('juanchito@gmail.com', $1, 'customer', 'Juan Hernandez', '+57 300 123 4567', 'Calle 10 #20-30, Sangil'),
        ('joseph@admin.com', $2, 'admin', 'Joseph Admin', '+57 310 555 0001', 'Admin Office'),
        ('rodolfito@gmail.com', $3, 'customer', 'Rodolfo García', '+57 310 987 6543', 'Carrera 5 #15-25, Sangil')
      ON CONFLICT (email) DO NOTHING;
    `, [password1, password2, password3]);
    console.log('✅ Users created');

    // Get user IDs
    const usersResult = await pool.query(`
      SELECT id, email FROM users 
      WHERE email IN ('juanchito@gmail.com', 'rodolfito@gmail.com')
    `);

    if (usersResult.rows.length > 0) {
      const juanId = usersResult.rows.find(u => u.email === 'juanchito@gmail.com')?.id;
      const rodoId = usersResult.rows.find(u => u.email === 'rodolfito@gmail.com')?.id;

      if (juanId) {
        // Insert stats for Juan
        console.log('📊 Creating user statistics...');
        await pool.query(`
          INSERT INTO user_stats (user_id, week_usage, month_usage)
          VALUES ($1, 45.5, 185.2)
          ON CONFLICT (user_id) DO UPDATE 
          SET week_usage = 45.5, month_usage = 185.2;
        `, [juanId]);

        // Insert receipts for Juan
        console.log('🧾 Creating receipts...');
        await pool.query(`
          INSERT INTO receipts (user_id, billing_month, consumption, rate, total, status, due_date, paid_date)
          VALUES 
            ($1, 'October 2025', 185, 2850, 527250, 'paid', '2025-10-15', '2025-10-12'),
            ($1, 'September 2025', 178, 2800, 498400, 'paid', '2025-09-15', '2025-09-14')
          ON CONFLICT DO NOTHING;
        `, [juanId]);

        // Insert pending receipt
        await pool.query(`
          INSERT INTO receipts (user_id, billing_month, consumption, rate, total, status, due_date)
          VALUES ($1, 'November 2025', 192, 2850, 547200, 'pending', '2025-11-15')
          ON CONFLICT DO NOTHING;
        `, [juanId]);

        // Insert support ticket
        console.log('💬 Creating support tickets...');
        await pool.query(`
          INSERT INTO support_tickets (user_id, customer_name, subject, message, status)
          VALUES ($1, 'Juan Pérez', 'Billing Question', 'Why is my bill higher this month?', 'open')
          ON CONFLICT DO NOTHING;
        `, [juanId]);
      }

      if (rodoId) {
        // Insert stats for Rodolfo
        await pool.query(`
          INSERT INTO user_stats (user_id, week_usage, month_usage)
          VALUES ($1, 38.2, 152.8)
          ON CONFLICT (user_id) DO UPDATE 
          SET week_usage = 38.2, month_usage = 152.8;
        `, [rodoId]);

        // Insert receipts for Rodolfo
        await pool.query(`
          INSERT INTO receipts (user_id, billing_month, consumption, rate, total, status, due_date, paid_date)
          VALUES 
            ($1, 'October 2025', 152, 2850, 433200, 'paid', '2025-10-15', '2025-10-13')
          ON CONFLICT DO NOTHING;
        `, [rodoId]);

        // Insert support ticket
        await pool.query(`
          INSERT INTO support_tickets (user_id, customer_name, subject, message, status, response)
          VALUES ($1, 'Rodolfo García', 'Service Request', 'Please check my water pressure', 'resolved', 'Our technician visited and adjusted your valve. Everything should be working properly now.')
          ON CONFLICT DO NOTHING;
        `, [rodoId]);
      }

      console.log('✅ Statistics, receipts, and tickets created');
    }

    console.log('🎉 Seed completed successfully!');
    console.log('\n📝 Demo Accounts:');
    console.log('   Customer: juanchito@gmail.com / juanchito123');
    console.log('   Admin:    joseph@admin.com / joseph456');
    console.log('   Customer: rodolfito@gmail.com / roro12345');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();